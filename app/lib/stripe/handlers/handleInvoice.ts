import type Stripe from "stripe";
import { stripe } from "../stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  applyStripeSubscriptionSnapshot,
  type StripeEventLease,
  type SupabaseClientLike,
} from "../subscriptionPersistence";

type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
};

export async function handleInvoice(
  event: Stripe.Event,
  lease: StripeEventLease,
  dependencies: {
    supabase?: SupabaseClientLike;
    retrieveSubscription?: (id: string) => Promise<Stripe.Subscription>;
  } = {}
) {
  const invoice = event.data.object as InvoiceWithSubscription;
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) {
    throw new Error("STRIPE_INVOICE_SUBSCRIPTION_MISSING");
  }

  const retrieve =
    dependencies.retrieveSubscription ??
    ((id: string) => stripe.subscriptions.retrieve(id, {
      expand: ["items.data.price"],
    }) as Promise<Stripe.Subscription>);
  const subscription = await retrieve(subscriptionId);

  return applyStripeSubscriptionSnapshot(
    dependencies.supabase ?? createSupabaseServer(),
    subscription,
    lease,
    { snapshotIsCurrent: true }
  );
}
