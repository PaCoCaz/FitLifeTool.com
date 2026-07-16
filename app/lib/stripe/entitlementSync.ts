// app/lib/stripe/entitlementSync.ts

import "server-only";

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { getCustomerEntitlementSnapshot } from "./customerEntitlements";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

type SyncCustomerEntitlementsResult = {
  customerFound: boolean;
  userId: string | null;
  planId: string;
  profileUpdated: boolean;
};

export async function syncCustomerEntitlements(
  stripeCustomerId: string
) {
  const supabase = createSupabaseServer();

  return syncCustomerEntitlementsWithClient(
    supabase,
    stripeCustomerId
  );
}

export async function syncCustomerEntitlementsWithClient(
  supabase: SupabaseClientLike,
  stripeCustomerId: string
): Promise<SyncCustomerEntitlementsResult> {
  const { data: customer, error: customerError } =
    await supabase
      .from("customers")
      .select("id, user_id")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();

  if (customerError) {
    throw customerError;
  }

  if (!customer) {
    return {
      customerFound: false,
      userId: null,
      planId: "free",
      profileUpdated: false,
    };
  }

  if (!customer.user_id) {
    return {
      customerFound: true,
      userId: null,
      planId: "free",
      profileUpdated: false,
    };
  }

  const entitlement =
    await getCustomerEntitlementSnapshot(
      supabase,
      customer.id
    );

  const planId = entitlement.planId;

  const { error: profileError } =
    await supabase
      .from("profiles")
      .update({
        abonnement: planId,
      })
      .eq("id", customer.user_id);

  if (profileError) {
    throw profileError;
  }

  return {
    customerFound: true,
    userId: customer.user_id,
    planId,
    profileUpdated: true,
  };
}
