import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

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

  // -------------------------
  // customer
  // -------------------------

  const { data: customer } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .single();

  console.log("customer", customer);

  if (!customer) {
    return new Response(
      JSON.stringify({ error: "No customer" }),
      { status: 400 }
    );
  }

  // -------------------------
  // try subscription with customers.id
  // -------------------------

  let { data: subscription } =
    await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customer.id)
      .maybeSingle();

  // -------------------------
  // try subscription with stripe id
  // -------------------------

  if (!subscription) {

    const res =
      await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq(
          "customer_id",
          customer.stripe_customer_id
        )
        .maybeSingle();

    subscription = res.data;
  }

  console.log("subscription", subscription);

  if (!subscription) {

    return new Response(
      JSON.stringify({
        error: "No subscription found",
      }),
      { status: 400 }
    );

  }

  // -------------------------
  // stripe subscription
  // -------------------------

  const sub =
    await stripe.subscriptions.retrieve(
      subscription.id
    );

  const itemId =
    sub.items.data[0].id;

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
