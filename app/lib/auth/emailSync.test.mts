import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  AUTH_EMAIL_SYNC_MAX_ATTEMPTS,
  getStripeEmailSyncIdempotencyKey,
  processAuthEmailSyncJob,
  type AuthEmailSyncJob,
  type EmailSyncDependencies,
} from "./emailSync.ts";

const USER = "11111111-1111-4111-8111-111111111111";
const job: AuthEmailSyncJob = { user_id: USER, generation: 2, lease_token: "lease", attempt_count: 1, work_kind: "sync" };
const projectRoot = new URL("../../../", import.meta.url);

function dependencies(overrides: Partial<EmailSyncDependencies> = {}) {
  let stripeEmail: string | null = "old@example.test";
  let stripeGeneration: number | null = null;
  const calls = { authReads: 0, local: 0, stripe: 0, stripeReads: 0, completed: [] as string[], verified: 0, failed: [] as Array<[string, boolean]>, reconciled: 0, idempotencyKeys: [] as string[] };
  const base: EmailSyncDependencies = {
    async getConfirmedAuthIdentity() { calls.authReads += 1; return { id: USER, email: "confirmed@example.test" }; },
    async getCustomerMapping() { return { id: "local", user_id: USER, stripe_customer_id: "cus_valid", email: "confirmed@example.test" }; },
    async findStripeCustomerIdsByUserId() { return []; },
    async syncLocal() { calls.local += 1; return true; },
    async getStripeCustomer() { calls.stripeReads += 1; return { id: "cus_valid", deleted: false, email: stripeEmail, metadataUserId: USER, syncGeneration: stripeGeneration }; },
    async updateStripeCustomerEmail(input) { calls.stripe += 1; calls.idempotencyKeys.push(input.idempotencyKey); stripeEmail = input.email; stripeGeneration = input.generation; },
    async isLeaseCurrent() { return true; },
    async complete(_job, reason) { calls.completed.push(reason); return true; },
    async completeVerification() { calls.verified += 1; return true; },
    async fail(_job, code, retryable) { calls.failed.push([code, retryable]); return true; },
    async ensureReconciliation(_userId, observedGeneration) { calls.reconciled += 1; return observedGeneration + 1; },
    ...overrides,
  };
  return { base, calls };
}

test("confirmed Auth email is the only value written locally and to the matching Stripe customer", async () => {
  const state = dependencies();
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(state.calls.local, 1);
  assert.equal(state.calls.stripe, 1);
  assert.equal(state.calls.stripeReads, 2);
  assert.deepEqual(state.calls.idempotencyKeys, [
    getStripeEmailSyncIdempotencyKey(USER, job.generation),
  ]);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an already-equal Stripe email completes without an update call", async () => {
  const state = dependencies({
    async getStripeCustomer() {
      state.calls.stripeReads += 1;
      return { id: "cus_valid", deleted: false, email: "confirmed@example.test", metadataUserId: USER, syncGeneration: 2 };
    },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(state.calls.stripe, 0);
  assert.equal(state.calls.stripeReads, 1);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an ambiguous Stripe timeout with a matching readback is treated as success", async () => {
  let reads = 0;
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return {
        id: "cus_valid",
        deleted: false,
        email: reads === 1 ? "old@example.test" : "confirmed@example.test",
        metadataUserId: USER,
        syncGeneration: reads === 1 ? null : 2,
      };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("timeout after provider acceptance");
    },
  });

  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(reads, 2);
  assert.equal(state.calls.authReads, 3);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, []);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an ambiguous Stripe timeout with a mismatching readback remains retryable", async () => {
  let reads = 0;
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return { id: "cus_valid", deleted: false, email: "old@example.test", metadataUserId: USER, syncGeneration: null };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("timeout without provider acceptance");
    },
  });

  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.equal(reads, 2);
  assert.equal(state.calls.authReads, 3);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, [["STRIPE_SYNC_FAILED", true]]);
});

test("the maximum attempt escalates repeated Stripe failure for bounded manual review", async () => {
  let reads = 0;
  const exhaustedJob = {
    ...job,
    attempt_count: AUTH_EMAIL_SYNC_MAX_ATTEMPTS,
  };
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return { id: "cus_valid", deleted: false, email: "old@example.test", metadataUserId: USER, syncGeneration: null };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("persistent provider failure");
    },
  });

  assert.equal(
    await processAuthEmailSyncJob(state.base, exhaustedJob),
    "manual_review"
  );
  assert.equal(reads, 2);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, [
    ["STRIPE_SYNC_FAILED_RETRY_EXHAUSTED", false],
  ]);
});

test("a periodically reclaimed exhausted sync avoids Stripe mutation when already converged", async () => {
  const reconsideredJob = { ...job, attempt_count: 1 };
  const state = dependencies({
    async getStripeCustomer() {
      state.calls.stripeReads += 1;
      return {
        id: "cus_valid",
        deleted: false,
        email: "confirmed@example.test",
        metadataUserId: USER,
        syncGeneration: reconsideredJob.generation,
      };
    },
  });

  assert.equal(
    await processAuthEmailSyncJob(state.base, reconsideredJob),
    "completed"
  );
  assert.equal(state.calls.stripe, 0);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("a periodically reclaimed exhausted sync repairs divergence with the current Auth authority", async () => {
  const reconsideredJob = { ...job, attempt_count: 1 };
  const state = dependencies();

  assert.equal(
    await processAuthEmailSyncJob(state.base, reconsideredJob),
    "completed"
  );
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("absence of a local customer is a completed no-billing relation", async () => {
  const state = dependencies({ async getCustomerMapping() { return null; } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed_no_mapping");
  assert.equal(state.calls.stripe, 0);
  assert.deepEqual(state.calls.completed, ["no_local_billing_relation"]);
});

test("a later mapping-created generation executes after no-local completion", async () => {
  const state = dependencies();
  const reopenedJob = { ...job, generation: job.generation + 1 };

  assert.equal(await processAuthEmailSyncJob(state.base, reopenedJob), "completed");
  assert.equal(state.calls.local, 1);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("a Stripe customer without its required local mapping is sent to manual review", async () => {
  const state = dependencies({
    async getCustomerMapping() { return null; },
    async findStripeCustomerIdsByUserId() { return ["cus_orphan"]; },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "manual_review");
  assert.deepEqual(state.calls.failed, [["ORPHAN_STRIPE_MAPPING", false]]);
  assert.deepEqual(state.calls.completed, []);
});

test("an unavailable orphan-mapping check retries instead of assuming no billing relation", async () => {
  const state = dependencies({
    async getCustomerMapping() { return null; },
    async findStripeCustomerIdsByUserId() { throw new Error("provider unavailable"); },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.deepEqual(state.calls.failed, [["STRIPE_MAPPING_SEARCH_FAILED", true]]);
  assert.deepEqual(state.calls.completed, []);
});

test("an inconsistent local or Stripe mapping fails closed for manual review", async () => {
  const local = dependencies({ async getCustomerMapping() { return { id: "local", user_id: "other", stripe_customer_id: "cus_valid", email: "confirmed@example.test" }; } });
  assert.equal(await processAuthEmailSyncJob(local.base, job), "manual_review");
  assert.deepEqual(local.calls.failed, [["MAPPING_INTEGRITY_FAILED", false]]);

  const stripe = dependencies({ async getStripeCustomer() { return { id: "cus_valid", deleted: false, email: null, metadataUserId: "other", syncGeneration: null }; } });
  assert.equal(await processAuthEmailSyncJob(stripe.base, job), "manual_review");
  assert.deepEqual(stripe.calls.failed, [["STRIPE_IDENTITY_MISMATCH", false]]);
});

test("transient failures are retryable and never expose provider payloads", async () => {
  const state = dependencies({ async updateStripeCustomerEmail() { throw new Error("secret provider payload"); } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.deepEqual(state.calls.failed, [["STRIPE_SYNC_FAILED", true]]);
});

test("transient failures on attempts one through four retain bounded retry", async () => {
  for (let attempt = 1; attempt < AUTH_EMAIL_SYNC_MAX_ATTEMPTS; attempt += 1) {
    const state = dependencies({
      async updateStripeCustomerEmail() {
        throw new Error("temporary provider outage");
      },
    });
    const retryingJob = { ...job, attempt_count: attempt };

    assert.equal(
      await processAuthEmailSyncJob(state.base, retryingJob),
      "retryable_failed"
    );
    assert.deepEqual(state.calls.failed, [["STRIPE_SYNC_FAILED", true]]);
  }
});

test("a newer confirmed Auth identity prevents stale Stripe writes", async () => {
  let reads = 0;
  const state = dependencies({
    async getConfirmedAuthIdentity() {
      reads += 1;
      return { id: USER, email: reads === 1 ? "first@example.test" : "newer@example.test" };
    },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "stale_generation");
  assert.equal(state.calls.stripe, 0);
  assert.equal(state.calls.reconciled, 1);
});

test("expired or replaced leases stop processing before downstream mutation", async () => {
  const state = dependencies({ async isLeaseCurrent() { return false; } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "stale");
  assert.equal(state.calls.local, 0);
  assert.equal(state.calls.stripe, 0);
});

test("RACE A-C: superseding generations are fenced before Auth, local, and Stripe side effects", async () => {
  const beforeAuth = dependencies({ async isLeaseCurrent() { return false; } });
  assert.equal(await processAuthEmailSyncJob(beforeAuth.base, job), "stale");
  assert.equal(beforeAuth.calls.local, 0);
  assert.equal(beforeAuth.calls.stripe, 0);

  const localFence = dependencies({ async syncLocal() { return false; } });
  assert.equal(await processAuthEmailSyncJob(localFence.base, job), "stale");
  assert.equal(localFence.calls.stripe, 0);

  let leaseChecks = 0;
  const beforeStripe = dependencies({
    async isLeaseCurrent() { leaseChecks += 1; return leaseChecks < 3; },
  });
  assert.equal(await processAuthEmailSyncJob(beforeStripe.base, job), "stale");
  assert.equal(beforeStripe.calls.stripe, 0);
});

test("RACE D-E-H: a stale in-flight Stripe success cannot finalize newer work and guarantees reconciliation", async () => {
  let release!: () => void;
  let started!: () => void;
  const callStarted = new Promise<void>((resolve) => { started = resolve; });
  const continueCall = new Promise<void>((resolve) => { release = resolve; });
  let currentEmail = "generation-n@example.test";
  let leaseCurrent = true;
  let stripeEmail = "older@example.test";
  let stripeGeneration: number | null = null;
  const state = dependencies({
    async getConfirmedAuthIdentity() {
      state.calls.authReads += 1;
      return { id: USER, email: currentEmail };
    },
    async getCustomerMapping() {
      return { id: "local", user_id: USER, stripe_customer_id: "cus_valid", email: currentEmail };
    },
    async isLeaseCurrent() { return leaseCurrent; },
    async getStripeCustomer() {
      state.calls.stripeReads += 1;
      return { id: "cus_valid", deleted: false, email: stripeEmail, metadataUserId: USER, syncGeneration: stripeGeneration };
    },
    async updateStripeCustomerEmail(input) {
      state.calls.stripe += 1;
      state.calls.idempotencyKeys.push(input.idempotencyKey);
      started();
      await continueCall;
      stripeEmail = input.email;
      stripeGeneration = input.generation;
    },
  });

  const running = processAuthEmailSyncJob(state.base, job);
  await callStarted;
  currentEmail = "generation-n-plus-one@example.test";
  leaseCurrent = false;
  release();

  assert.equal(await running, "reconciliation_required");
  assert.equal(state.calls.reconciled, 1);
  assert.deepEqual(state.calls.completed, []);
  assert.equal(stripeGeneration, job.generation);
});

test("RACE F: ambiguous Stripe completion still performs readback and reconciliation after lease loss", async () => {
  let leaseCurrent = true;
  let reads = 0;
  const state = dependencies({
    async isLeaseCurrent() { return leaseCurrent; },
    async getStripeCustomer() {
      reads += 1;
      return { id: "cus_valid", deleted: false, email: "generation-n@example.test", metadataUserId: USER, syncGeneration: 2 };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      leaseCurrent = false;
      throw new Error("ambiguous after acceptance");
    },
  });
  state.base.getConfirmedAuthIdentity = async () => {
    state.calls.authReads += 1;
    return { id: USER, email: leaseCurrent ? "confirmed@example.test" : "generation-n-plus-one@example.test" };
  };

  assert.equal(await processAuthEmailSyncJob(state.base, job), "reconciliation_required");
  assert.ok(reads >= 2);
  assert.equal(state.calls.reconciled, 1);
  assert.deepEqual(state.calls.completed, []);
});

test("RACE G: lease reclaim is SQL-fenced and same-generation Stripe idempotency is stable", async () => {
  const reclaimed = { ...job, lease_token: "replacement-lease" };
  assert.equal(
    getStripeEmailSyncIdempotencyKey(job.user_id, job.generation),
    getStripeEmailSyncIdempotencyKey(reclaimed.user_id, reclaimed.generation)
  );
  assert.notEqual(
    getStripeEmailSyncIdempotencyKey(job.user_id, job.generation),
    getStripeEmailSyncIdempotencyKey(job.user_id, job.generation + 1)
  );
  assert.doesNotMatch(
    getStripeEmailSyncIdempotencyKey(job.user_id, job.generation),
    /@|\.test/i
  );

  const staleLease = dependencies({ async syncLocal() { return false; } });
  assert.equal(await processAuthEmailSyncJob(staleLease.base, job), "stale");
  assert.deepEqual(staleLease.calls.completed, []);
  assert.deepEqual(staleLease.calls.failed, []);
});

test("completed drift verification is bounded, converged when equal, and creates one unbound reconciliation on mismatch", async () => {
  const verificationJob: AuthEmailSyncJob = { ...job, work_kind: "verify" };
  const converged = dependencies({
    async getStripeCustomer() {
      converged.calls.stripeReads += 1;
      return { id: "cus_valid", deleted: false, email: "confirmed@example.test", metadataUserId: USER, syncGeneration: 2 };
    },
  });
  assert.equal(await processAuthEmailSyncJob(converged.base, verificationJob), "verified");
  assert.equal(converged.calls.verified, 1);
  assert.equal(converged.calls.reconciled, 0);
  assert.equal(converged.calls.stripe, 0);

  const drift = dependencies({
    async getCustomerMapping() {
      return { id: "local", user_id: USER, stripe_customer_id: "cus_valid", email: "stale@example.test" };
    },
  });
  assert.equal(
    await processAuthEmailSyncJob(drift.base, verificationJob),
    "drift_reconciliation_required"
  );
  assert.equal(drift.calls.reconciled, 1);
  assert.equal(drift.calls.stripe, 0);
});

test("cron endpoint is secret-protected and Vercel schedule composes as one explicit job", async () => {
  const [route, configuration] = await Promise.all([
    readFile(new URL("app/api/cron/auth-email-sync/route.ts", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
  ]);
  assert.match(route, /process\.env\.CRON_SECRET/);
  assert.match(route, /authorization/);
  assert.doesNotMatch(route, /console\.(log|error)|last_error_code/);
  assert.deepEqual(JSON.parse(configuration), {
    $schema: "https://openapi.vercel.sh/vercel.json",
    crons: [{ path: "/api/cron/auth-email-sync", schedule: "0 3 * * *" }],
  });
});
