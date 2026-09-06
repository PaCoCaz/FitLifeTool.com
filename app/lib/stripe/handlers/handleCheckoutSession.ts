// app/lib/stripe/handlers/handleCheckoutSession.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";

type CheckoutCustomerMapping = {
  stripe_customer_id: string;
  user_id: string;
};

type CustomerWriter = {
  from(table: "customers"): {
    upsert(
      values: CheckoutCustomerMapping
    ): PromiseLike<{ error: unknown | null }>;
  };
};

export async function handleCheckoutSession(
  event: Stripe.Event,
  supabase: CustomerWriter = createSupabaseServer()
) {
  const session =
    event.data.object as Stripe.Checkout.Session;

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const userId =
    session.client_reference_id;

  if (!stripeCustomerId) {
    throw new Error(
      "Missing customer in session"
    );
  }

  if (!userId) {
    throw new Error(
      "Missing user id in session"
    );
  }

  const { error } = await supabase
    .from("customers")
    .upsert({
      stripe_customer_id: stripeCustomerId,
      user_id: userId,
    });

  if (error) {
    throw error;
  }
}
