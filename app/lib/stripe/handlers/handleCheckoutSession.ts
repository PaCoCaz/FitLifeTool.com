// app/lib/stripe/handlers/handleCheckoutSession.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";

type CustomerWriter = {
  rpc(
    functionName: "establish_customer_mapping",
    values: {
      p_user_id: string;
      p_stripe_customer_id: string;
    }
  ): PromiseLike<{ data: unknown; error: unknown | null }>;
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

  const { data, error } = await supabase.rpc(
    "establish_customer_mapping",
    {
      p_user_id: userId,
      p_stripe_customer_id: stripeCustomerId,
    }
  );

  if (error || (data !== "established" && data !== "existing")) {
    throw error ?? new Error("Customer mapping establishment failed");
  }
}
