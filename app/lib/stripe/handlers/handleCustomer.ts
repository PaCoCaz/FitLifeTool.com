// app/lib/stripe/handlers/handleCustomer.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import {
  ensureSupabaseCustomerMapping,
  getStripeCustomerUserId,
} from "../customerMapping";

export async function handleCustomer(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const customer =
    event.data.object as Stripe.Customer;
  const userId = getStripeCustomerUserId(customer);

  await ensureSupabaseCustomerMapping(supabase, {
    userId,
    stripeCustomerId: customer.id,
    email: customer.email,
  });
}
