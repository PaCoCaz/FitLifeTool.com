import type Stripe from "stripe";
import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";

type SupabaseAdmin = ReturnType<typeof createSupabaseServer>;

export type AuthEmailSyncJob = {
  user_id: string;
  generation: number;
  lease_token: string;
  attempt_count: number;
};

type CustomerMapping = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
};

type StripeCustomerSnapshot = {
  id: string;
  deleted: boolean;
  email: string | null;
  metadataUserId: string | null;
};

export const AUTH_EMAIL_SYNC_MAX_ATTEMPTS = 5;

export type EmailSyncDependencies = {
  getConfirmedAuthIdentity(userId: string): Promise<{ id: string; email: string | null } | null>;
  getCustomerMapping(userId: string): Promise<CustomerMapping | null>;
  findStripeCustomerIdsByUserId(userId: string): Promise<string[]>;
  updateLocalCustomerEmail(input: { customerId: string; userId: string; email: string }): Promise<boolean>;
  getStripeCustomer(stripeCustomerId: string): Promise<StripeCustomerSnapshot>;
  updateStripeCustomerEmail(input: { stripeCustomerId: string; userId: string; email: string }): Promise<void>;
  isLeaseCurrent(job: AuthEmailSyncJob): Promise<boolean>;
  markLocalSynced(job: AuthEmailSyncJob): Promise<boolean>;
  complete(job: AuthEmailSyncJob, reason: "synced" | "no_local_billing_relation"): Promise<boolean>;
  fail(job: AuthEmailSyncJob, code: string, retryable: boolean, delaySeconds: number): Promise<boolean>;
  requestReconciliation(userId: string): Promise<void>;
};

function retryDelay(attemptCount: number) {
  return Math.min(300 * 2 ** Math.max(0, attemptCount - 1), 86_400);
}

async function failSafely(dependencies: EmailSyncDependencies, job: AuthEmailSyncJob, code: string, retryable: boolean) {
  const retryAllowed =
    retryable && job.attempt_count < AUTH_EMAIL_SYNC_MAX_ATTEMPTS;
  const persistedCode = retryable && !retryAllowed
    ? `${code}_RETRY_EXHAUSTED`
    : code;

  await dependencies.fail(
    job,
    persistedCode,
    retryAllowed,
    retryDelay(job.attempt_count)
  );
  return retryAllowed ? "retryable_failed" : "manual_review";
}

function stripeIdentityMatches(
  customer: StripeCustomerSnapshot,
  mapping: CustomerMapping,
  userId: string
) {
  return !customer.deleted &&
    customer.id === mapping.stripe_customer_id &&
    customer.metadataUserId === userId;
}

export async function processAuthEmailSyncJob(dependencies: EmailSyncDependencies, job: AuthEmailSyncJob) {
  let authIdentity;
  try {
    authIdentity = await dependencies.getConfirmedAuthIdentity(job.user_id);
  } catch {
    return failSafely(dependencies, job, "AUTH_READ_FAILED", true);
  }

  if (!authIdentity || authIdentity.id !== job.user_id || !authIdentity.email) {
    return failSafely(dependencies, job, "AUTH_IDENTITY_MISSING", false);
  }
  if (!(await dependencies.isLeaseCurrent(job))) return "stale";

  let mapping;
  try {
    mapping = await dependencies.getCustomerMapping(job.user_id);
  } catch {
    return failSafely(dependencies, job, "MAPPING_READ_FAILED", true);
  }

  if (!mapping) {
    let orphanStripeCustomerIds;
    try {
      orphanStripeCustomerIds =
        await dependencies.findStripeCustomerIdsByUserId(job.user_id);
    } catch {
      return failSafely(dependencies, job, "STRIPE_MAPPING_SEARCH_FAILED", true);
    }
    if (orphanStripeCustomerIds.length > 0) {
      return failSafely(dependencies, job, "ORPHAN_STRIPE_MAPPING", false);
    }
    return (await dependencies.complete(job, "no_local_billing_relation"))
      ? "completed_no_mapping"
      : "stale";
  }
  if (mapping.user_id !== job.user_id || !/^cus_[A-Za-z0-9]+$/.test(mapping.stripe_customer_id)) {
    return failSafely(dependencies, job, "MAPPING_INTEGRITY_FAILED", false);
  }

  try {
    const localUpdated = await dependencies.updateLocalCustomerEmail({
      customerId: mapping.id,
      userId: job.user_id,
      email: authIdentity.email,
    });
    if (!localUpdated) return failSafely(dependencies, job, "LOCAL_MAPPING_CHANGED", true);
    if (!(await dependencies.markLocalSynced(job))) return "stale";
  } catch {
    return failSafely(dependencies, job, "LOCAL_SYNC_FAILED", true);
  }

  let stripeCustomer;
  try {
    stripeCustomer = await dependencies.getStripeCustomer(mapping.stripe_customer_id);
  } catch {
    return failSafely(dependencies, job, "STRIPE_READ_FAILED", true);
  }
  if (!stripeIdentityMatches(stripeCustomer, mapping, job.user_id)) {
    return failSafely(dependencies, job, "STRIPE_IDENTITY_MISMATCH", false);
  }
  if (!(await dependencies.isLeaseCurrent(job))) return "stale";

  let currentIdentity;
  try {
    currentIdentity = await dependencies.getConfirmedAuthIdentity(job.user_id);
  } catch {
    return failSafely(dependencies, job, "AUTH_RECHECK_FAILED", true);
  }
  if (!currentIdentity || currentIdentity.id !== job.user_id || currentIdentity.email !== authIdentity.email) {
    await dependencies.requestReconciliation(job.user_id);
    return "stale_generation";
  }

  if (stripeCustomer.email === currentIdentity.email) {
    if (!(await dependencies.isLeaseCurrent(job))) return "stale";
    return (await dependencies.complete(job, "synced")) ? "completed" : "stale";
  }

  try {
    await dependencies.updateStripeCustomerEmail({
      stripeCustomerId: mapping.stripe_customer_id,
      userId: job.user_id,
      email: authIdentity.email,
    });
  } catch {
    if (!(await dependencies.isLeaseCurrent(job))) return "stale";

    let readbackCustomer;
    try {
      readbackCustomer = await dependencies.getStripeCustomer(
        mapping.stripe_customer_id
      );
    } catch {
      return failSafely(
        dependencies,
        job,
        "STRIPE_SYNC_READBACK_FAILED",
        true
      );
    }

    if (!stripeIdentityMatches(readbackCustomer, mapping, job.user_id)) {
      return failSafely(
        dependencies,
        job,
        "STRIPE_IDENTITY_MISMATCH",
        false
      );
    }
    if (!(await dependencies.isLeaseCurrent(job))) return "stale";

    let readbackIdentity;
    try {
      readbackIdentity = await dependencies.getConfirmedAuthIdentity(
        job.user_id
      );
    } catch {
      return failSafely(
        dependencies,
        job,
        "AUTH_READBACK_RECHECK_FAILED",
        true
      );
    }

    if (
      !readbackIdentity ||
      readbackIdentity.id !== job.user_id ||
      readbackIdentity.email !== currentIdentity.email
    ) {
      await dependencies.requestReconciliation(job.user_id);
      return "stale_generation";
    }

    if (readbackCustomer.email !== readbackIdentity.email) {
      return failSafely(dependencies, job, "STRIPE_SYNC_FAILED", true);
    }
  }
  if (!(await dependencies.isLeaseCurrent(job))) return "stale";

  return (await dependencies.complete(job, "synced")) ? "completed" : "stale";
}

function rpcSucceeded(data: unknown, error: unknown) {
  if (error) throw new Error("Auth email synchronization RPC failed");
  return data === true;
}

export function createEmailSyncDependencies(supabase: SupabaseAdmin, stripe: Stripe): EmailSyncDependencies {
  return {
    async getConfirmedAuthIdentity(userId) {
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      if (error) throw new Error("Auth read failed");
      return data.user ? { id: data.user.id, email: data.user.email ?? null } : null;
    },
    async getCustomerMapping(userId) {
      const { data, error } = await supabase.from("customers").select("id, user_id, stripe_customer_id").eq("user_id", userId).maybeSingle();
      if (error) throw new Error("Mapping read failed");
      return data as CustomerMapping | null;
    },
    async findStripeCustomerIdsByUserId(userId) {
      const result = await stripe.customers.search({
        query: `metadata['user_id']:'${userId}'`,
        limit: 2,
      });
      return result.data.map((customer) => customer.id);
    },
    async updateLocalCustomerEmail(input) {
      const { data, error } = await supabase.from("customers").update({ email: input.email }).eq("id", input.customerId).eq("user_id", input.userId).select("id");
      if (error) throw new Error("Local email sync failed");
      return data.length === 1;
    },
    async getStripeCustomer(stripeCustomerId) {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      return {
        id: customer.id,
        deleted: customer.deleted === true,
        email: customer.deleted ? null : customer.email,
        metadataUserId: customer.deleted ? null : customer.metadata?.user_id ?? null,
      };
    },
    async updateStripeCustomerEmail(input) {
      await stripe.customers.update(input.stripeCustomerId, { email: input.email, metadata: { user_id: input.userId } });
    },
    async isLeaseCurrent(job) {
      const { data, error } = await supabase.rpc("is_auth_email_sync_lease_current", { p_user_id: job.user_id, p_generation: job.generation, p_lease_token: job.lease_token });
      return rpcSucceeded(data, error);
    },
    async markLocalSynced(job) {
      const { data, error } = await supabase.rpc("mark_auth_email_local_synced", { p_user_id: job.user_id, p_generation: job.generation, p_lease_token: job.lease_token });
      return rpcSucceeded(data, error);
    },
    async complete(job, reason) {
      const { data, error } = await supabase.rpc("complete_auth_email_sync_job", { p_user_id: job.user_id, p_generation: job.generation, p_lease_token: job.lease_token, p_completion_reason: reason });
      return rpcSucceeded(data, error);
    },
    async fail(job, code, retryable, delaySeconds) {
      const { data, error } = await supabase.rpc("fail_auth_email_sync_job", { p_user_id: job.user_id, p_generation: job.generation, p_lease_token: job.lease_token, p_error_code: code, p_retryable: retryable, p_delay_seconds: delaySeconds });
      return rpcSucceeded(data, error);
    },
    async requestReconciliation(userId) {
      const { error } = await supabase.rpc("request_auth_email_reconciliation", { p_user_id: userId });
      if (error) throw new Error("Reconciliation request failed");
    },
  };
}

export async function requestAuthEmailReconciliation(
  supabase: SupabaseAdmin,
  userId: string
) {
  const { error } = await supabase.rpc(
    "request_auth_email_reconciliation",
    { p_user_id: userId }
  );
  if (error) throw new Error("Reconciliation request failed");
}

export async function processAuthEmailSyncBatch(input: { supabase: SupabaseAdmin; stripe: Stripe; limit?: number }) {
  const { data, error } = await input.supabase.rpc("claim_auth_email_sync_jobs", { p_limit: input.limit ?? 10, p_lease_seconds: 120 });
  if (error) throw new Error("Unable to claim Auth email synchronization jobs");

  const jobs = (data ?? []) as AuthEmailSyncJob[];
  const dependencies = createEmailSyncDependencies(input.supabase, input.stripe);
  const results: string[] = [];
  for (const job of jobs) results.push(await processAuthEmailSyncJob(dependencies, job));
  return { claimed: jobs.length, results };
}
