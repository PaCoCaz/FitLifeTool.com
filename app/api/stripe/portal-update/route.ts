// app/api/stripe/portal-update/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

export async function POST() {

  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
  } =
    await supabaseUser.auth.getUser();

  if (!user) {

    return new Response(
      JSON.stringify({
        error: "No user",
      }),
      { status: 401 }
    );

  }

  const supabaseAdmin =
    createSupabaseServer();

  const { data: customer } =
    await supabaseAdmin
      .from("customers")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

  if (!customer) {

    return new Response(
      JSON.stringify({
        error: "No customer",
      }),
      { status: 400 }
    );

  }

  const { data: sub } =
    await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("status", "active")
      .single();

  if (!sub) {

    return new Response(
      JSON.stringify({
        error: "No subscription",
      }),
      { status: 400 }
    );

  }

  const portal =
    await stripe.billingPortal.sessions.create(
      {
        customer:
          customer.stripe_customer_id,

        return_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,

        flow_data: {
          type: "subscription_update",

          subscription_update: {
            subscription: sub.id,
          },
        },
      }
    );

  return new Response(
    JSON.stringify({
      url: portal.url,
    })
  );

}