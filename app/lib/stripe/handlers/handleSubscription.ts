// app/lib/stripe/handlers/handleSubscription.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import { stripe } from "../stripe";
import { syncCustomerEntitlements } from "../entitlementSync";
import { persistStripeSubscription } from "../subscriptionPersistence";

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

  const subscription = (await stripe.subscriptions.retrieve(
    sub.id,
    {
      expand: ["items.data.price"],
    }
  )) as Stripe.Subscription;

  // -------------------------
  // find customer
  // -------------------------

  const { data: existingCustomer, error: customerError } =
    await supabase
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();

  if (customerError) {
    throw customerError;
  }

  let customer = existingCustomer;

  if (!customer) {
    const { error: insertCustomerError } =
      await supabase
        .from("customers")
        .insert({
          stripe_customer_id: stripeCustomerId,
        });

    if (insertCustomerError) {
      throw insertCustomerError;
    }

    const {
      data: createdCustomer,
      error: createdCustomerError,
    } = await supabase
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .single();

    if (createdCustomerError) {
      throw createdCustomerError;
    }

    customer = createdCustomer;
  }

  await persistStripeSubscription(
    supabase,
    subscription,
    customer.id
  );

  await syncCustomerEntitlements(stripeCustomerId);
}
