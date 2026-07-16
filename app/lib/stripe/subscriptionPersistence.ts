// app/lib/stripe/subscriptionPersistence.ts

import "server-only";

import type Stripe from "stripe";
import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

type SubscriptionItemLike = {
  id: string;
  price?: {
    id?: string | null;
  } | null;
  quantity?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
};

type SubscriptionLike = Stripe.Subscription & {
  plan?: {
    id?: string | null;
  } | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
};

type PersistOptions = {
  status?: string | null;
};

function toDate(ts?: number | null) {
  if (!ts) return null;
  return new Date(ts * 1000);
}

function getSubscriptionItems(
  subscription: SubscriptionLike
): SubscriptionItemLike[] {
  return subscription.items?.data?.length
    ? (subscription.items.data as SubscriptionItemLike[])
    : [
        {
          id: subscription.id,
          price: {
            id:
              subscription.plan?.id ??
              subscription.items?.data?.[0]?.price?.id,
          },
          quantity: 1,
        },
      ];
}

export async function persistStripeSubscription(
  supabase: SupabaseClientLike,
  subscription: SubscriptionLike,
  customerId: string,
  options: PersistOptions = {}
) {
  const items = getSubscriptionItems(subscription);

  let periodStart: number | null = null;
  let periodEnd: number | null = null;

  for (const item of items) {
    periodStart =
      item.current_period_start ??
      subscription.current_period_start ??
      periodStart;

    periodEnd =
      item.current_period_end ??
      subscription.current_period_end ??
      periodEnd;
  }

  const { error: subscriptionError } =
    await supabase
      .from("subscriptions")
      .upsert({
        id: subscription.id,
        customer_id: customerId,
        status: options.status ?? subscription.status ?? null,
        current_period_start: toDate(periodStart),
        current_period_end: toDate(periodEnd),
        cancel_at: toDate(subscription.cancel_at),
        canceled_at: toDate(subscription.canceled_at),
        trial_start: toDate(subscription.trial_start),
        trial_end: toDate(subscription.trial_end),
        metadata: subscription.metadata ?? {},
      });

  if (subscriptionError) {
    throw subscriptionError;
  }

  for (const item of items) {
    const priceId = item.price?.id;

    if (!priceId) {
      continue;
    }

    const { error: itemError } =
      await supabase
        .from("subscription_items")
        .upsert({
          id: item.id,
          subscription_id: subscription.id,
          price_id: priceId,
          quantity: item.quantity ?? 1,
        });

    if (itemError) {
      throw itemError;
    }
  }
}
