import {
  resolveNutritionDiscoveryMarketCodes,
  type NutritionMarketRow,
} from "@/lib/markets/nutritionMarketSupport";
import type { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import {
  mergeNormalAndExactDiscoveryRows,
  normalizeNutritionSearchName,
  selectEligibleProductKeys,
  type NutritionDiscoveryLanguage,
  type NutritionDiscoveryType,
  type NutritionProductDiscoveryRow,
  type NutritionProductMarketRow,
  type NutritionProductSearchNameRow,
} from "@/lib/search/nutritionProductDiscoveryRules";

export {
  parseNutritionDiscoveryLanguage,
  parseNutritionDiscoveryType,
} from "@/lib/search/nutritionProductDiscoveryRules";

type NutritionProductDiscoveryClient = Awaited<
  ReturnType<typeof createSupabaseServerUser>
>;

export const NUTRITION_DISCOVERY_SEARCH_LIMIT = 100;

export type NutritionProductDiscoveryContext = {
  marketCodes: string[];
  eligibleProductKeys: string[];
};

export type NutritionDiscoveryCategory = {
  key: string;
  label: string;
};

type ProfileRegionRow = {
  food_region: string | null;
};

type ProductCategoryRow = {
  product_key: string;
  group_display_key: string | null;
};

type CategoryTranslationRow = {
  group_key: string;
  name: string;
};

export async function loadNutritionProductDiscoveryContext(
  client: NutritionProductDiscoveryClient,
  userId: string
): Promise<NutritionProductDiscoveryContext> {
  const [profileResult, marketsResult] = await Promise.all([
    client
      .from("profiles")
      .select("food_region")
      .eq("id", userId)
      .maybeSingle(),
    client
      .from("nutrition_markets")
      .select("market_code, is_active"),
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (marketsResult.error) {
    throw marketsResult.error;
  }

  const profile = profileResult.data as ProfileRegionRow | null;
  const markets = (marketsResult.data ?? []) as NutritionMarketRow[];
  const marketCodes = resolveNutritionDiscoveryMarketCodes(
    profile?.food_region,
    markets
  );

  const mappingsResult = await client
    .from("nutrition_product_markets")
    .select("product_key, market_code")
    .in("market_code", marketCodes);

  if (mappingsResult.error) {
    throw mappingsResult.error;
  }

  return {
    marketCodes,
    eligibleProductKeys: selectEligibleProductKeys(
      (mappingsResult.data ?? []) as NutritionProductMarketRow[],
      marketCodes
    ),
  };
}

export async function searchNutritionProducts(
  client: NutritionProductDiscoveryClient,
  context: NutritionProductDiscoveryContext,
  input: {
    type: NutritionDiscoveryType;
    lang: NutritionDiscoveryLanguage;
    query: string;
  }
) {
  const normalizedQuery = normalizeNutritionSearchName(input.query);

  if (normalizedQuery.length < 1) {
    return [];
  }

  let normalRows: NutritionProductDiscoveryRow[] = [];

  if (context.eligibleProductKeys.length > 0) {
    const { data, error } = await client
      .from("nutrition_products_search")
      .select("product_key, name, is_drink, is_basic")
      .in("product_key", context.eligibleProductKeys)
      .eq("lang", input.lang)
      .eq("is_drink", input.type === "drink")
      .ilike("name", `%${input.query}%`)
      .limit(NUTRITION_DISCOVERY_SEARCH_LIMIT);

    if (error) {
      throw error;
    }

    normalRows = (data ?? []) as NutritionProductDiscoveryRow[];
  }

  const exactResult = await client
    .from("nutrition_product_search_names")
    .select(
      "product_key, display_name, is_drink, is_basic, search_name_type"
    )
    .eq("lang", input.lang)
    .eq("is_drink", input.type === "drink")
    .eq("search_name_normalized", normalizedQuery)
    .order("product_key", { ascending: true })
    .order("search_name_type", { ascending: true });

  if (exactResult.error) {
    throw exactResult.error;
  }

  return mergeNormalAndExactDiscoveryRows(
    normalRows,
    (exactResult.data ?? []) as NutritionProductSearchNameRow[]
  );
}

export async function listNutritionDiscoveryCategories(
  client: NutritionProductDiscoveryClient,
  context: NutritionProductDiscoveryContext,
  input: {
    type: NutritionDiscoveryType;
    lang: NutritionDiscoveryLanguage;
  }
) {
  if (context.eligibleProductKeys.length === 0) {
    return [];
  }

  const productsResult = await client
    .from("nutrition_products")
    .select("product_key, group_display_key")
    .in("product_key", context.eligibleProductKeys)
    .eq("is_drink", input.type === "drink");

  if (productsResult.error) {
    throw productsResult.error;
  }

  const categoryKeys = [...new Set(
    ((productsResult.data ?? []) as ProductCategoryRow[])
      .map(({ group_display_key }) => group_display_key)
      .filter((key): key is string => Boolean(key))
  )];

  if (categoryKeys.length === 0) {
    return [];
  }

  const translationsResult = await client
    .from("nutrition_product_group_translations")
    .select("group_key, name")
    .in("group_key", categoryKeys)
    .eq("lang", input.lang);

  if (translationsResult.error) {
    throw translationsResult.error;
  }

  const labelMap = new Map(
    ((translationsResult.data ?? []) as CategoryTranslationRow[])
      .map(({ group_key, name }) => [group_key, name])
  );

  return categoryKeys
    .map((key) => ({
      key,
      label: labelMap.get(key) ?? key,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, input.lang, {
        sensitivity: "base",
      })
    ) satisfies NutritionDiscoveryCategory[];
}
