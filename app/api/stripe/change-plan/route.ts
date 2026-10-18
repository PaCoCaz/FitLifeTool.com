//  app/api/stripe/change-plan/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { isAllowedStripePriceId } from "@/lib/stripe/planLookup";

export async function POST(req: Request) {

  const body = await req.json();
  const { priceId } = body;

  if (!priceId) {
    return new Response(
      JSON.stringify({ error: "Missing priceId" }),
      { status: 400 }
    );
  }

  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: "No user" }),
      { status: 401 }
    );
  }

  const supabaseAdmin =
    createSupabaseServer();

  if (
    !(await isAllowedStripePriceId(
      supabaseAdmin,
      priceId
    ))
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid price" }),
      { status: 400 }
    );
  }

  // -------------------------
  // customer
  // -------------------------

  const { data: customer } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .single();

  if (!customer) {
    return new Response(
      JSON.stringify({ error: "No customer" }),
      { status: 400 }
    );
  }

  const { data: subscriptions, error: subscriptionsError } =
    await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("customer_id", customer.id)
      .in("status", ["active", "trialing"]);

  if (subscriptionsError || subscriptions?.length !== 1) {

    return new Response(
      JSON.stringify({
        error: "Subscription cannot be changed",
      }),
      { status: 409 }
    );

  }

  const subscription = subscriptions[0];

  // -------------------------
  // stripe subscription
  // -------------------------

  const sub =
    await stripe.subscriptions.retrieve(
      subscription.id
    );

  if (sub.items.data.length !== 1) {
    return new Response(
      JSON.stringify({ error: "Subscription cannot be changed" }),
      { status: 409 }
    );
  }

  const itemId = sub.items.data[0].id;

  await stripe.subscriptions.update(
    subscription.id,
    {
      items: [
        {
          id: itemId,
          price: priceId,
        },
      ],
      proration_behavior:
        "create_prorations",
    }
  );

  return new Response(
    JSON.stringify({ ok: true })
  );
}
