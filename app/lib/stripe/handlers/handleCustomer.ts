// app/lib/stripe/handlers/handleCustomer.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";

type CustomerMapping = {
  stripe_customer_id: string;
};

type CustomerWriter = {
  from(table: "customers"): {
    upsert(
      values: CustomerMapping
    ): PromiseLike<{ error: unknown | null }>;
  };
};

export async function handleCustomer(
  event: Stripe.Event,
  supabase: CustomerWriter = createSupabaseServer()
) {
  const customer =
    event.data.object as Stripe.Customer;

  const { error } = await supabase
    .from("customers")
    .upsert({
      stripe_customer_id: customer.id,
    });

  if (error) {
    throw error;
  }
}
