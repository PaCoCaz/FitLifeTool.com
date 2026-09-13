// app/api/stripe/checkout/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { isAllowedStripePriceId } from "@/lib/stripe/planLookup";

export async function POST(req: Request) {
  const supabase = createSupabaseServer();

  try {
    const body = await req.json() as {
      priceId: string;
    };

    const { priceId } = body;

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Missing data" }),
        { status: 400 }
      );
    }

    const supabaseUser = await createSupabaseServerUser();

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "No user" }),
        { status: 401 }
      );
    }

    if (
      !(await isAllowedStripePriceId(
        supabase,
        priceId
      ))
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid price" }),
        { status: 400 }
      );
    }

    const { data: customer, error: customerReadError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (customerReadError) {
      throw new Error("CUSTOMER_MAPPING_READ_FAILED");
    }

    let stripeCustomerId = customer?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        metadata: { user_id: user.id },
      });

      stripeCustomerId = newCustomer.id;

    }

    const { data: mappingResult, error: mappingError } = await supabase.rpc(
      "establish_customer_mapping",
      {
        p_user_id: user.id,
        p_stripe_customer_id: stripeCustomerId,
      }
    );

    if (
      mappingError ||
      (mappingResult !== "established" && mappingResult !== "existing")
    ) {
      throw new Error("CUSTOMER_MAPPING_ESTABLISHMENT_FAILED");
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

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1&stripe_return=checkout`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=1&stripe_return=checkout_cancel`,

      client_reference_id: user.id,
    });

    return new Response(JSON.stringify({ url: session.url }));
  } catch {
    console.error("STRIPE_CHECKOUT_FAILED");

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
