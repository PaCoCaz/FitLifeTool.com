//  app/api/profile/subscription-details/route.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

export async function GET() {

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

  const supabase =
    createSupabaseServer();

  // profile

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("abonnement")
      .eq("id", user.id)
      .single();

  // customer

  const { data: customer } =
    await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

  if (!customer) {

    return new Response(
      JSON.stringify({
        plan:
          profile?.abonnement ??
          "free",
      })
    );

  }

  // subscription

  const { data: subscription } =
    await supabase
      .from("subscriptions")
      .select(
        "status, current_period_end"
      )
      .eq(
        "customer_id",
        customer.id
      )
      .maybeSingle();

  return new Response(
    JSON.stringify({
      plan:
        profile?.abonnement ??
        "free",

      status:
        subscription?.status ??
        null,

      current_period_end:
        subscription?.current_period_end ??
        null,
    })
  );

}