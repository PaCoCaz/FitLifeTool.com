// app/lib/stripe/handlers/handleInvoice.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import { syncCustomerEntitlements } from "../entitlementSync";
import { persistStripeSubscription } from "../subscriptionPersistence";
import { resolveLocalCustomerMapping } from "../customerMapping";

type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
};

function getStripeId(
  value: string | { id?: string } | null | undefined
) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.id ?? null;
}

export async function handleInvoice(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const invoice =
    event.data.object as InvoiceWithSubscription;

  const subscriptionId =
    getStripeId(invoice.subscription);

  if (!subscriptionId) {
    return;
  }


  // -------------------------
  // subscription ophalen bij Stripe
  // -------------------------

  const subscription =
    (await stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ["items.data.price"],
      }
    )) as Stripe.Subscription;


  const stripeCustomerId =
    getStripeId(subscription.customer);

  if (!stripeCustomerId) {
    return;
  }


  // -------------------------
  // customer zoeken
  // -------------------------

  const customer = await resolveLocalCustomerMapping({
    supabase,
    stripeCustomerId,
    retrieveStripeCustomer: async (customerId) =>
      stripe.customers.retrieve(customerId),
  });

  // -------------------------
  // status bepalen
  // -------------------------

  let status: string | null = null;

  if (event.type === "invoice.paid") {
    status = "active";
  }

  if (
    event.type ===
    "invoice.payment_failed"
  ) {
    status = "past_due";
  }


  // -------------------------
  // subscription upsert
  // -------------------------

  await persistStripeSubscription(
    supabase,
    subscription,
    customer.id,
    {
      status: status ?? subscription.status,
    }
  );

  await syncCustomerEntitlements(stripeCustomerId);

}
