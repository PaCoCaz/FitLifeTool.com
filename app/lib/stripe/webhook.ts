import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { stripe } from "./stripe";
import { handleCheckoutSession } from "./handlers/handleCheckoutSession";
import { handleCustomer } from "./handlers/handleCustomer";
import { handleInvoice } from "./handlers/handleInvoice";
import { handlePrice } from "./handlers/handlePrice";
import { handleProduct } from "./handlers/handleProduct";
import { handleSubscription } from "./handlers/handleSubscription";
import {
  completeStripeWebhookEvent,
  type StripeEventLease,
  type SupabaseClientLike,
} from "./subscriptionPersistence";

const LEASE_SECONDS = 120;

type ClaimDecision =
  | "acquired"
  | "duplicate_completed"
  | "busy"
  | "retry_later"
  | "manual_review"
  | "metadata_conflict";

type ClaimRow = {
  decision: ClaimDecision;
  processing_generation: number | null;
};

type RecoveryRow = {
  event_id: string;
  event_type: string;
  stripe_created_at: string;
  livemode: boolean;
  processing_generation: number;
  lease_token: string;
};

export function verifyStripeEvent(body: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET_MISSING");
  return stripe.webhooks.constructEvent(body, signature, secret);
}

export function getStripePayloadSha256(body: string) {
  return createHash("sha256").update(body).digest("hex");
}

export function getConfiguredStripeLivemode() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (/^(sk|rk)_live_/.test(key)) return true;
  if (/^(sk|rk)_test_/.test(key)) return false;
  throw new Error("STRIPE_RUNTIME_MODE_UNRESOLVED");
}

function firstRow<T>(data: unknown): T | null {
  if (Array.isArray(data)) return (data[0] as T | undefined) ?? null;
  return (data as T | null) ?? null;
}

async function dispatchClaimedEvent(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike
) {
  switch (event.type) {
    case "product.created":
    case "product.updated":
      return handleProduct(event, lease, supabase);
    case "price.created":
    case "price.updated":
      return handlePrice(event, lease, supabase);
    case "customer.created":
    case "customer.updated":
      return handleCustomer(event, lease, supabase);
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return handleSubscription(event, lease, { supabase });
    case "invoice.paid":
    case "invoice.payment_failed":
      return handleInvoice(event, lease, { supabase });
    case "checkout.session.completed":
      return handleCheckoutSession(event, lease, supabase);
    default:
      return completeStripeWebhookEvent(
        supabase,
        lease,
        "unhandled"
      );
  }
}

function isRetryable(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";
  return !["22023", "23503", "23505", "42501"].includes(code);
}

async function failClaimedEvent(
  supabase: SupabaseClientLike,
  lease: StripeEventLease,
  error: unknown
) {
  const retryable = isRetryable(error);
  const { error: failureError } = await supabase.rpc(
    "fail_stripe_webhook_event",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_retryable: retryable,
      p_error_code: retryable
        ? "PROCESSING_FAILED"
        : "INVARIANT_FAILED",
      p_retry_after_seconds: 60,
    }
  );
  if (failureError) {
    console.error("STRIPE_EVENT_FAILURE_STATE_WRITE_FAILED");
  }
}

export async function processClaimedStripeEvent(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  try {
    await dispatchClaimedEvent(event, lease, supabase);
  } catch (error) {
    await failClaimedEvent(supabase, lease, error);
    throw error;
  }
}

export async function handleStripeEvent(
  event: Stripe.Event,
  payloadSha256: string,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  if (event.livemode !== getConfiguredStripeLivemode()) {
    throw new Error("STRIPE_EVENT_MODE_MISMATCH");
  }

  const leaseToken = randomUUID();
  const stripeCreatedAt = new Date(event.created * 1000).toJSON();
  const { data, error } = await supabase.rpc(
    "claim_stripe_webhook_event",
    {
      p_event_id: event.id,
      p_event_type: event.type,
      p_stripe_created_at: stripeCreatedAt,
      p_livemode: event.livemode,
      p_payload_sha256: payloadSha256,
      p_lease_token: leaseToken,
      p_lease_seconds: LEASE_SECONDS,
    }
  );
  if (error) throw error;

  const claim = firstRow<ClaimRow>(data);
  if (!claim) throw new Error("STRIPE_EVENT_CLAIM_INVALID");
  if (claim.decision === "duplicate_completed") return "completed";
  if (claim.decision !== "acquired" || !claim.processing_generation) {
    throw new Error(`STRIPE_EVENT_${claim.decision.toUpperCase()}`);
  }

  await processClaimedStripeEvent(event, {
    eventId: event.id,
    generation: claim.processing_generation,
    leaseToken,
    stripeCreatedAt,
  }, supabase);
  return "processed";
}

export async function recoverOneStripeWebhookEvent(
  supabase: SupabaseClientLike = createSupabaseServer(),
  retrieveEvent: (id: string) => Promise<Stripe.Event> =
    (id) => stripe.events.retrieve(id)
) {
  const leaseToken = randomUUID();
  const { data, error } = await supabase.rpc(
    "claim_recoverable_stripe_webhook_event",
    {
      p_lease_token: leaseToken,
      p_lease_seconds: LEASE_SECONDS,
    }
  );
  if (error) throw error;
  const recovery = firstRow<RecoveryRow>(data);
  if (!recovery) return "none";

  const lease: StripeEventLease = {
    eventId: recovery.event_id,
    generation: recovery.processing_generation,
    leaseToken: recovery.lease_token,
    stripeCreatedAt: recovery.stripe_created_at,
  };

  try {
    const event = await retrieveEvent(recovery.event_id);
    if (
      event.id !== recovery.event_id ||
      event.type !== recovery.event_type ||
      event.livemode !== recovery.livemode
    ) {
      const conflict = { code: "22023" };
      await failClaimedEvent(supabase, lease, conflict);
      return "manual_review";
    }
    await processClaimedStripeEvent(event, lease, supabase);
    return "recovered";
  } catch (recoveryError) {
    await failClaimedEvent(supabase, lease, recoveryError);
    return "failed";
  }
}
