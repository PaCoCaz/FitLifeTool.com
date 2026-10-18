import "server-only";

import type Stripe from "stripe";
import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export type SupabaseClientLike = ReturnType<typeof createSupabaseServer>;

export type StripeEventLease = {
  eventId: string;
  generation: number;
  leaseToken: string;
  stripeCreatedAt: string;
};

type SubscriptionItemLike = {
  id: string;
  price?: { id?: string | null } | null;
  quantity?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
};

type SubscriptionLike = Stripe.Subscription & {
  plan?: { id?: string | null } | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
};

function toIsoDate(timestamp?: number | null) {
  return timestamp
    ? new Date(timestamp * 1000).toJSON()
    : null;
}

function getSubscriptionItems(
  subscription: SubscriptionLike
): SubscriptionItemLike[] {
  return subscription.items?.data?.length
    ? (subscription.items.data as SubscriptionItemLike[])
    : [{
        id: subscription.id,
        price: {
          id:
            subscription.plan?.id ??
            subscription.items?.data?.[0]?.price?.id,
        },
        quantity: 1,
      }];
}

export async function applyStripeSubscriptionSnapshot(
  supabase: SupabaseClientLike,
  subscription: SubscriptionLike,
  lease: StripeEventLease,
  options: { snapshotIsCurrent: boolean }
) {
  const subscriptionItems = getSubscriptionItems(subscription);
  const items = subscriptionItems.map((item) => ({
    id: item.id,
    price_id: item.price?.id ?? null,
    quantity: item.quantity ?? 1,
  }));

  let periodStart: number | null =
    subscription.current_period_start ?? null;
  let periodEnd: number | null =
    subscription.current_period_end ?? null;

  for (const item of subscriptionItems) {
    periodStart = item.current_period_start ?? periodStart;
    periodEnd = item.current_period_end ?? periodEnd;
  }

  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!stripeCustomerId) {
    throw new Error("STRIPE_SUBSCRIPTION_CUSTOMER_MISSING");
  }

  const { data, error } = await supabase.rpc(
    "apply_stripe_subscription_snapshot",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_stripe_event_created_at: lease.stripeCreatedAt,
      p_snapshot_is_current: options.snapshotIsCurrent,
      p_subscription_id: subscription.id,
      p_stripe_customer_id: stripeCustomerId,
      p_status: subscription.status,
      p_current_period_start: toIsoDate(periodStart),
      p_current_period_end: toIsoDate(periodEnd),
      p_cancel_at: toIsoDate(subscription.cancel_at),
      p_canceled_at: toIsoDate(subscription.canceled_at),
      p_trial_start: toIsoDate(subscription.trial_start),
      p_trial_end: toIsoDate(subscription.trial_end),
      p_cancel_at_period_end:
        subscription.cancel_at_period_end ?? false,
      p_items: items,
    }
  );

  if (error) throw error;
  if (data !== "applied" && data !== "stale_ignored") {
    throw new Error("STRIPE_SUBSCRIPTION_APPLY_REJECTED");
  }

  return data as "applied" | "stale_ignored";
}

export async function completeStripeWebhookEvent(
  supabase: SupabaseClientLike,
  lease: StripeEventLease,
  outcomeCode: string
) {
  const { data, error } = await supabase.rpc(
    "complete_stripe_webhook_event",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_outcome_code: outcomeCode,
    }
  );

  if (error || data !== "completed") {
    throw error ?? new Error("STRIPE_EVENT_COMPLETION_REJECTED");
  }
}
