//  app/api/stripe/change-plan/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { isAllowedStripePriceId } from "@/lib/stripe/planLookup";
import {
  ChangePlanError,
  changePlanForUser,
} from "@/lib/stripe/changePlan";

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

  try {
    await changePlanForUser(
      {
        async findCustomerByUserId(userId) {
          const { data, error } = await supabaseAdmin
            .from("customers")
            .select("id, stripe_customer_id")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (!data) {
            return null;
          }

          return {
            id: data.id,
            stripeCustomerId: data.stripe_customer_id,
          };
        },

        async findChangeableSubscriptionsByCustomerId(
          localCustomerId
        ) {
          const { data, error } = await supabaseAdmin
            .from("subscriptions")
            .select("id")
            .eq("customer_id", localCustomerId)
            .in("status", ["active", "trialing"])
            .limit(2);

          if (error) {
            throw error;
          }

          return data ?? [];
        },

        async retrieveStripeSubscription(subscriptionId) {
          return stripe.subscriptions.retrieve(
            subscriptionId
          );
        },

        async updateStripeSubscription(
          subscriptionId,
          update
        ) {
          await stripe.subscriptions.update(
            subscriptionId,
            {
              items: [
                {
                  id: update.itemId,
                  price: update.priceId,
                },
              ],
              proration_behavior: "create_prorations",
            }
          );
        },
      },
      {
        userId: user.id,
        priceId,
      }
    );

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof ChangePlanError) {
      const status =
        error.code === "AMBIGUOUS_SUBSCRIPTION" ||
        error.code === "STRIPE_CUSTOMER_MISMATCH"
          ? 409
          : 400;

      return Response.json(
        {
          error: error.code,
        },
        {
          status,
        }
      );
    }

    console.error("Change plan error", error);

    return Response.json(
      {
        error: "CHANGE_PLAN_FAILED",
      },
      {
        status: 500,
      }
    );
  }
}
