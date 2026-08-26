// app/lib/stripe/handlers/handleCustomer.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";
import {
  ensureSupabaseCustomerMapping,
  getStripeCustomerUserId,
  stripeCustomerEmailNeedsReconciliation,
} from "../customerMapping";
import { requestAuthEmailReconciliation } from "@/lib/auth/emailSync";

export async function handleCustomer(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const customer =
    event.data.object as Stripe.Customer;
  const userId = getStripeCustomerUserId(customer);

  const { data: authData, error: authError } =
    await supabase.auth.admin.getUserById(userId);

  if (authError || !authData.user?.email) {
    throw new Error("Confirmed Auth identity is unavailable");
  }

  await ensureSupabaseCustomerMapping(supabase, {
    userId,
    stripeCustomerId: customer.id,
  });

  if (stripeCustomerEmailNeedsReconciliation({
    customer,
    expectedUserId: authData.user.id,
    confirmedAuthEmail: authData.user.email,
  })) {
    await requestAuthEmailReconciliation(supabase, userId);
  }
}
