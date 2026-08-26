// app/lib/stripe/handlers/handleCheckoutSession.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import {
  ensureSupabaseCustomerMapping,
  getCheckoutSessionUserId,
} from "../customerMapping";

function getStripeCustomerId(
  customer: Stripe.Checkout.Session["customer"]
) {
  if (typeof customer === "string") {
    return customer;
  }

  return customer?.id ?? null;
}

export async function handleCheckoutSession(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const session =
    event.data.object as Stripe.Checkout.Session;

  const stripeCustomerId =
    getStripeCustomerId(session.customer);

  const userId = getCheckoutSessionUserId({
    clientReferenceId: session.client_reference_id,
    metadataUserId: session.metadata?.user_id,
  });

  if (!stripeCustomerId) {
    throw new Error(
      "Missing customer in session"
    );
  }

  await ensureSupabaseCustomerMapping(supabase, {
    stripeCustomerId,
    userId,
  });
}
