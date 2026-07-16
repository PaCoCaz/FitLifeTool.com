// app/api/profile/subscription-details/route.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { getCustomerEntitlementSnapshot } from "@/lib/stripe/customerEntitlements";

export async function GET() {
  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    return Response.json(
      {
        error: "No user",
      },
      {
        status: 401,
      }
    );
  }

  const supabase =
    createSupabaseServer();

  /* ───────────────── Customer ───────────────── */

  const {
    data: customer,
    error: customerError,
  } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (customerError) {
    console.error(
      "Subscription details customer error:",
      customerError
    );

    return Response.json(
      {
        error: "Could not load customer",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * Zonder customer kan er geen actuele Stripe-subscription
   * zijn. profiles.abonnement wordt hier bewust niet als
   * bron van waarheid gebruikt.
   */
  if (!customer) {
    return Response.json({
      plan: "free",
      status: null,
      current_period_end: null,
    });
  }

  try {
    const entitlement =
      await getCustomerEntitlementSnapshot(
        supabase,
        customer.id
      );

    return Response.json({
      plan: entitlement.planId,
      status: entitlement.status,
      current_period_end:
        entitlement.currentPeriodEnd,
    });
  } catch (error) {
    console.error(
      "Subscription details entitlement error:",
      error
    );

    return Response.json(
      {
        error:
          "Could not load subscription details",
      },
      {
        status: 500,
      }
    );
  }
}
