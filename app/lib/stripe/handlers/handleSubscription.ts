// app/lib/stripe/handlers/handleSubscription.ts

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

  const subscription = event.data.object;

  const stripeCustomerId =
    subscription.customer;



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

    // customer bestaat nog niet → maken

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
  // Upsert subscription
  // -------------------------

  await supabase
    .from("subscriptions")
    .upsert({
      id: subscription.id,

      customer_id:
        customer?.id ?? null,

      status: subscription.status,

      current_period_start:
        new Date(
          subscription.current_period_start * 1000
        ),

      current_period_end:
        new Date(
          subscription.current_period_end * 1000
        ),

      cancel_at:
        subscription.cancel_at
          ? new Date(
              subscription.cancel_at * 1000
            )
          : null,

      canceled_at:
        subscription.canceled_at
          ? new Date(
              subscription.canceled_at * 1000
            )
          : null,

      trial_start:
        subscription.trial_start
          ? new Date(
              subscription.trial_start * 1000
            )
          : null,

      trial_end:
        subscription.trial_end
          ? new Date(
              subscription.trial_end * 1000
            )
          : null,

      metadata:
        subscription.metadata ?? {},
    });



  // -------------------------
  // Sync items + plan bepalen
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
  // Update profile
  // -------------------------

  let userId =
    customer?.user_id ?? null;


  // als user_id nog niet bestaat → opnieuw ophalen

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