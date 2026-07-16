// app/lib/stripe/webhook.ts

import { stripe } from "./stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";

import { handleProduct } from "./handlers/handleProduct";
import { handlePrice } from "./handlers/handlePrice";
import { handleCustomer } from "./handlers/handleCustomer";
import { handleSubscription } from "./handlers/handleSubscription";
import { handleInvoice } from "./handlers/handleInvoice";
import { handleCheckoutSession } from "./handlers/handleCheckoutSession";



// =========================
// Verify Stripe event
// =========================

export function verifyStripeEvent(
  body: string,
  signature: string
) {
  const secret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "Missing STRIPE_WEBHOOK_SECRET"
    );
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    secret
  );
}



// =========================
// Idempotency check
// =========================

async function hasEventBeenProcessed(
  eventId: string
) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}



async function saveEvent(
  eventId: string,
  type: string
) {
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("stripe_events")
    .insert({
      id: eventId,
      type,
    });

  if (error && error.code !== "23505") {
    throw error;
  }
}



// =========================
// Dispatcher
// =========================

export async function handleStripeEvent(
  event: Stripe.Event
) {

  console.log("STRIPE EVENT:", event.type);

  if (await hasEventBeenProcessed(event.id)) {
    return;
  }

  try {

    switch (event.type) {

      case "product.created":
      case "product.updated":
        await handleProduct(event);
        break;

      case "price.created":
      case "price.updated":
        await handlePrice(event);
        break;

      case "customer.created":
      case "customer.updated":
        await handleCustomer(event);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":

        console.log(
          "SUBSCRIPTION EVENT DATA:",
          event.data.object
        );

        await handleSubscription(event);
        break;

      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoice(event);
        break;

      case "checkout.session.completed":
        await handleCheckoutSession(event);
        /*
         * A Checkout Session is not a Subscription. The customer
         * link is stored here; subscription state is synced from
         * customer.subscription.created/updated events.
         */
        break;

      default:
        console.log(
          "UNHANDLED EVENT:",
          event.type
        );
        break;
    }

    await saveEvent(event.id, event.type);

  } catch (err) {

    console.error(
      "Stripe handler error",
      err
    );

    throw err;
  }
}
