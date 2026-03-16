// app/lib/stripe/handlers/handleSubscription.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";


// -------------------------
// PRICE → PLAN mapping
// -------------------------

const PRICE_TO_PLAN: Record<string, string> = {
  price_1TAso3HU07xU2AfQk4fucP73: "premium",
  price_1TAsyJHU07xU2AfQ5Ss20Yir: "premium",

  price_1TAsr7HU07xU2AfQhxqpau3T: "pro",
  price_1TAt1EHU07xU2AfQSbh7FOzO: "pro",

  price_1TAsreHU07xU2AfQPvQnjJuz: "coach",
  price_1TAt1kHU07xU2AfQS3UxNprt: "coach",
};


export async function handleSubscription(
  event: any
) {
  const supabase = createSupabaseServer();

  const sub = event.data.object;

  // ✅ altijd echte subscription ophalen
  const subscription =
    (await stripe.subscriptions.retrieve(
      sub.id,
      {
        expand: ["items.data.price"],
      }
    )) as any;


  const stripeCustomerId =
    subscription.customer;

  if (!stripeCustomerId) {
    throw new Error("No customer");
  }


  // -------------------------
  // Find customer
  // -------------------------

  let { data: customer } =
    await supabase
      .from("customers")
      .select("id, user_id")
      .eq(
        "stripe_customer_id",
        stripeCustomerId
      )
      .maybeSingle();


  if (!customer) {

    await supabase
      .from("customers")
      .insert({
        stripe_customer_id:
          stripeCustomerId,
      });

    const { data: again } =
      await supabase
        .from("customers")
        .select("id, user_id")
        .eq(
          "stripe_customer_id",
          stripeCustomerId
        )
        .single();

    customer = again;

  }


  // -------------------------
  // helper
  // -------------------------

  function toDate(
    value: number | null | undefined
  ) {
    if (!value) return null;
    return new Date(value * 1000);
  }


  // -------------------------
  // Upsert subscription
  // -------------------------

  await supabase
    .from("subscriptions")
    .upsert({
      id: subscription.id,

      customer_id:
        customer?.id ?? null,

      status:
        subscription.status ?? null,

      current_period_start:
        toDate(
          subscription.current_period_start
        ),

      current_period_end:
        toDate(
          subscription.current_period_end
        ),

      cancel_at:
        toDate(subscription.cancel_at),

      canceled_at:
        toDate(subscription.canceled_at),

      trial_start:
        toDate(subscription.trial_start),

      trial_end:
        toDate(subscription.trial_end),

      metadata:
        subscription.metadata ?? {},
    });


  // -------------------------
  // Sync items + plan
  // -------------------------

  const items =
    subscription.items.data;

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

        subscription_id:
          subscription.id,

        price_id: priceId,

        quantity:
          item.quantity ?? 1,
      });

    if (PRICE_TO_PLAN[priceId]) {
      plan = PRICE_TO_PLAN[priceId];
    }

  }


  // -------------------------
  // Update profile plan
  // -------------------------

  let userId =
    customer?.user_id ?? null;

  if (!userId) {

    const { data: again } =
      await supabase
        .from("customers")
        .select("user_id")
        .eq(
          "stripe_customer_id",
          stripeCustomerId
        )
        .single();

    userId = again?.user_id ?? null;

  }


  if (userId) {

    await supabase
      .from("profiles")
      .update({
        abonnement: plan,
      })
      .eq("id", userId);

  }

}