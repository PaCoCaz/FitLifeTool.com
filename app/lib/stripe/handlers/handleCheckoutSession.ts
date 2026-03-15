// app/lib/stripe/handlers/handleCheckoutSession.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function handleCheckoutSession(
  event: any
) {
  const supabase = createSupabaseServer();

  const session = event.data.object;

  const stripeCustomerId =
    session.customer;

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

  // ✅ upsert instead of update
  await supabase
    .from("customers")
    .upsert({
      stripe_customer_id:
        stripeCustomerId,

      user_id: userId,
    });
}