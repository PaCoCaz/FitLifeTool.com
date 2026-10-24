// app/lib/stripe/handlers/handleSubscription.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import { getStripe } from "../stripe";
import { syncCustomerEntitlements } from "../entitlementSync";
import { persistStripeSubscription } from "../subscriptionPersistence";
import { resolveLocalCustomerMapping } from "../customerMapping";

function getStripeId(
  value: string | { id?: string } | null
) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.id ?? null;
}

export async function handleSubscription(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const sub =
    event.data.object as Stripe.Subscription;

  const stripeCustomerId =
    getStripeId(sub.customer);

  if (!stripeCustomerId) {
    return;
  }

  // -------------------------
  // get full subscription
  // -------------------------

  const subscription = (await getStripe().subscriptions.retrieve(
    sub.id,
    {
      expand: ["items.data.price"],
    }
  )) as Stripe.Subscription;

  // -------------------------
  // find customer
  // -------------------------

  const customer = await resolveLocalCustomerMapping({
    supabase,
    stripeCustomerId,
    retrieveStripeCustomer: async (customerId) =>
      getStripe().customers.retrieve(customerId),
  });

  await persistStripeSubscription(
    supabase,
    subscription,
    customer.id
  );

  await syncCustomerEntitlements(stripeCustomerId);
}
