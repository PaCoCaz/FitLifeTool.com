// app/lib/stripe/planLookup.ts

import "server-only";

import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

export async function getPlanIdForPriceId(
  supabase: SupabaseClientLike,
  priceId: string
) {
  const { data: mapping, error: mappingError } =
    await supabase
      .from("price_plan_map")
      .select("plan_id")
      .eq("price_id", priceId)
      .maybeSingle();

  if (mappingError) {
    throw mappingError;
  }

  const planId = mapping?.plan_id ?? null;

  if (!planId) {
    return null;
  }

  const { data: planConfig, error: planConfigError } =
    await supabase
      .from("plan_config")
      .select("id")
      .eq("id", planId)
      .maybeSingle();

  if (planConfigError) {
    throw planConfigError;
  }

  if (!planConfig) {
    throw new Error(
      `Stripe price ${priceId} maps to missing plan_config ${planId}`
    );
  }

  return planId;
}

export async function isAllowedStripePriceId(
  supabase: SupabaseClientLike,
  priceId: string
) {
  return Boolean(
    await getPlanIdForPriceId(supabase, priceId)
  );
}
