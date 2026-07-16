// app/lib/stripe/customerEntitlements.ts

import "server-only";

import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  selectEntitlementSubscription,
  type SelectedEntitlement,
  type SubscriptionEntitlementInput,
} from "./entitlementRules";
import { getPlanIdForPriceId } from "./planLookup";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

type ActiveSubscriptionRow = {
  id: string;
  status: string | null;
  current_period_end: string | null;
  subscription_items?: Array<{
    price_id: string | null;
  }> | null;
};

export async function getCustomerEntitlementSnapshot(
  supabase: SupabaseClientLike,
  customerId: string
): Promise<SelectedEntitlement> {
  const {
    data: activeSubscriptions,
    error: activeSubscriptionsError,
  } = await supabase
    .from("subscriptions")
    .select(`
      id,
      status,
      current_period_end,
      created_at,
      subscription_items (
        price_id
      )
    `)
    .eq("customer_id", customerId)
    .in("status", ["active", "trialing"])
    .order("created_at", {
      ascending: false,
    });

  if (activeSubscriptionsError) {
    throw activeSubscriptionsError;
  }

  const rows =
    (activeSubscriptions ?? []) as ActiveSubscriptionRow[];

  const subscriptions: SubscriptionEntitlementInput[] =
    [];

  for (const subscription of rows) {
    const planIds = [];

    for (const item of subscription.subscription_items ?? []) {
      if (!item.price_id) {
        continue;
      }

      const planId = await getPlanIdForPriceId(
        supabase,
        item.price_id
      );

      planIds.push(planId);
    }

    subscriptions.push({
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd:
        subscription.current_period_end,
      planIds,
    });
  }

  return selectEntitlementSubscription(
    subscriptions
  );
}
