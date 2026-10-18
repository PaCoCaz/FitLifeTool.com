import type Stripe from "stripe";
import { stripe } from "../stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  applyStripeSubscriptionSnapshot,
  type StripeEventLease,
  type SupabaseClientLike,
} from "../subscriptionPersistence";

export async function handleSubscription(
  event: Stripe.Event,
  lease: StripeEventLease,
  dependencies: {
    supabase?: SupabaseClientLike;
    retrieveSubscription?: (id: string) => Promise<Stripe.Subscription>;
  } = {}
) {
  const eventSubscription = event.data.object as Stripe.Subscription;
  const snapshotIsCurrent =
    event.type !== "customer.subscription.deleted";
  const retrieve =
    dependencies.retrieveSubscription ??
    ((id: string) => stripe.subscriptions.retrieve(id, {
      expand: ["items.data.price"],
    }) as Promise<Stripe.Subscription>);
  const subscription = snapshotIsCurrent
    ? await retrieve(eventSubscription.id)
    : eventSubscription;

  return applyStripeSubscriptionSnapshot(
    dependencies.supabase ?? createSupabaseServer(),
    subscription,
    lease,
    { snapshotIsCurrent }
  );
}
