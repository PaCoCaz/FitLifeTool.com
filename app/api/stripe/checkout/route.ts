// app/api/stripe/checkout/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function POST(
  req: Request
) {
  const supabase = createSupabaseServer();

  const body = await req.json();

  const { priceId, userId } = body;

  if (!priceId) {
    return new Response(
      JSON.stringify({
        error: "Missing priceId",
      }),
      { status: 400 }
    );
  }

  if (!userId) {
    return new Response(
      JSON.stringify({
        error: "Missing userId",
      }),
      { status: 400 }
    );
  }

  // -------------------------
  // Check existing customer
  // -------------------------

  const { data: customer } =
    await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

  // -------------------------
  // Create checkout session
  // -------------------------

  const session =
    await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      payment_method_types: [
        "card",
        "ideal",
        "sepa_debit",
      ],

      success_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=1`,

      client_reference_id: userId,

      customer:
        customer?.stripe_customer_id ??
        undefined,

      allow_promotion_codes: true,
    });

  return new Response(
    JSON.stringify({
      url: session.url,
    })
  );
}
