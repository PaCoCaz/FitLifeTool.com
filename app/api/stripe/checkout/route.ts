// app/api/stripe/checkout/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { isAllowedStripePriceId } from "@/lib/stripe/planLookup";
import { ensureSupabaseCustomerMapping } from "@/lib/stripe/customerMapping";

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

    const {
      data: customer,
      error: customerError,
    } = await supabase
      .from("customers")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (customerError) {
      throw customerError;
    }

    let stripeCustomerId = customer?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        metadata: { user_id: user.id },
      });

      stripeCustomerId = newCustomer.id;

      await ensureSupabaseCustomerMapping(supabase, {
        userId: user.id,
        stripeCustomerId,
      });
    } else {
      await ensureSupabaseCustomerMapping(supabase, {
        userId: user.id,
        stripeCustomerId,
      });

      await stripe.customers.update(stripeCustomerId, {
        metadata: { user_id: user.id },
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

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1&stripe_return=checkout`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=1&stripe_return=checkout_cancel`,

      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
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
