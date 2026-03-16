// app/lib/stripe/handlers/handleInvoice.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function handleInvoice(
  event: any
) {
  const supabase = createSupabaseServer();

  const invoice = event.data.object;

  const subscriptionId =
    invoice.subscription;

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
    )) as any;


  const stripeCustomerId =
    subscription.customer;

  if (!stripeCustomerId) {
    return;
  }


  // -------------------------
  // customer zoeken
  // -------------------------

  const { data: customer } =
    await supabase
      .from("customers")
      .select("id, user_id")
      .eq(
        "stripe_customer_id",
        stripeCustomerId
      )
      .single();

  if (!customer) {
    return;
  }


  function toDate(
    value: number | null | undefined
  ) {
    if (!value) return null;
    return new Date(value * 1000);
  }


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

  await supabase
    .from("subscriptions")
    .upsert({
      id: subscription.id,

      customer_id:
        customer.id,

      status:
        status ?? subscription.status,

      current_period_start:
        toDate(
          subscription.current_period_start
        ),

      current_period_end:
        toDate(
          subscription.current_period_end
        ),
    });

}