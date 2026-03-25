// app/lib/stripe/handlers/handleSubscription.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TAso3HU07xU2AfQk4fucP73: "premium",
  price_1TAsyJHU07xU2AfQ5Ss20Yir: "premium",

  price_1TAsr7HU07xU2AfQhxqpau3T: "pro",
  price_1TAt1EHU07xU2AfQSbh7FOzO: "pro",

  price_1TAsreHU07xU2AfQPvQnjJuz: "coach",
  price_1TAt1kHU07xU2AfQS3UxNprt: "coach",
};

function toDate(ts?: number | null) {
  if (!ts) return null;
  return new Date(ts * 1000);
}

export async function handleSubscription(event: any) {

  const supabase = createSupabaseServer();

  const subEvent = event.data.object;

  if (!subEvent?.id) return;

  // ✅ ALWAYS retrieve from Stripe
  const sub =
  (await stripe.subscriptions.retrieve(
    subEvent.id,
    {
      expand: ["items.data.price"],
    }
  )) as any;

  const stripeCustomerId = sub.customer;

  if (!stripeCustomerId) return;

  // -------------------------
  // find customer
  // -------------------------

  let { data: customer } =
    await supabase
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();

  if (!customer) {

    await supabase
      .from("customers")
      .insert({
        stripe_customer_id: stripeCustomerId,
      });

    const { data: again } =
      await supabase
        .from("customers")
        .select("*")
        .eq("stripe_customer_id", stripeCustomerId)
        .single();

    customer = again;
  }

  // -------------------------
  // items
  // -------------------------

  const items = sub.items.data;

  let plan = "free";

  for (const item of items) {

    const priceId =
      typeof item.price === "string"
        ? item.price
        : item.price.id;

    await supabase
      .from("subscription_items")
      .upsert({
        id: item.id,
        subscription_id: sub.id,
        price_id: priceId,
        quantity: item.quantity ?? 1,
      });

    if (PRICE_TO_PLAN[priceId]) {
      plan = PRICE_TO_PLAN[priceId];
    }
  }

  // -------------------------
  // subscription
  // -------------------------

  await supabase
    .from("subscriptions")
    .upsert({
      id: sub.id,

      customer_id: customer?.id ?? null,

      status: sub.status ?? null,

      current_period_start:
        toDate(sub.current_period_start),

      current_period_end:
        toDate(sub.current_period_end),

      cancel_at:
        toDate(sub.cancel_at),

      canceled_at:
        toDate(sub.canceled_at),

      trial_start:
        toDate(sub.trial_start),

      trial_end:
        toDate(sub.trial_end),

      metadata:
        sub.metadata ?? {},
    });

  // -------------------------
  // profile plan
  // -------------------------

  const userId = customer?.user_id;

  if (userId) {
    await supabase
      .from("profiles")
      .update({
        abonnement: plan,
      })
      .eq("id", userId);
  }

}