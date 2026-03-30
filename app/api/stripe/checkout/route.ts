// app/api/stripe/checkout/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function POST(req: Request) {
  const supabase = createSupabaseServer();

  try {
    const body = await req.json() as {
      priceId: string;
      userId: string;
    };

    const { priceId, userId } = body;

    if (!priceId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing data" }),
        { status: 400 }
      );
    }

    const { data: customer } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    let stripeCustomerId = customer?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        metadata: { user_id: userId },
      });

      stripeCustomerId = newCustomer.id;

      await supabase.from("customers").insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=1`,

      client_reference_id: userId,
    });

    return new Response(JSON.stringify({ url: session.url }));
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}