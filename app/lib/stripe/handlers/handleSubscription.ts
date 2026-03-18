// app/lib/stripe/handlers/handleSubscription.ts

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

  const sub = event.data.object;

  const stripeCustomerId = sub.customer;

  if (!stripeCustomerId) return;


  // -------------------------
  // find customer (retry safe)
  // -------------------------

  let { data: customer } =
    await supabase
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();


  if (!customer) {

    // create placeholder

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

  const items = sub.items?.data ?? [];

  let periodStart: number | null = null;
  let periodEnd: number | null = null;

  let plan = "free";


  for (const item of items) {

    const priceId =
      item.price?.id ??
      item.plan?.id ??
      null;

    if (!priceId) continue;

    periodStart =
      item.current_period_start ??
      sub.current_period_start ??
      periodStart;

    periodEnd =
      item.current_period_end ??
      sub.current_period_end ??
      periodEnd;

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

      current_period_start: toDate(periodStart),

      current_period_end: toDate(periodEnd),

      cancel_at: toDate(sub.cancel_at),

      canceled_at: toDate(sub.canceled_at),

      trial_start: toDate(sub.trial_start),

      trial_end: toDate(sub.trial_end),

      metadata: sub.metadata ?? {},
    });


  // -------------------------
  // profile plan update
  // -------------------------

  const userId = customer?.user_id ?? null;

  if (userId) {

    await supabase
      .from("profiles")
      .update({
        abonnement: plan,
      })
      .eq("id", userId);
  }

}