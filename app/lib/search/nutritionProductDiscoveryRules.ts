export type NutritionDiscoveryType = "food" | "drink";
export type NutritionDiscoveryLanguage =
  | "en"
  | "nl"
  | "fr"
  | "de"
  | "pl";

export type NutritionProductMarketRow = {
  product_key: string;
  market_code: string;
};

export type NutritionProductDiscoveryRow = {
  product_key: string;
  name: string;
  is_drink: boolean;
  is_basic: boolean;
  is_exact_search_match?: boolean;
};

export type NutritionProductSearchNameRow = {
  product_key: string;
  display_name: string;
  is_drink: boolean;
  is_basic: boolean;
  search_name_type: "OFFICIAL" | "ALIAS";
};

export function normalizeNutritionSearchName(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/gu, " ")
    .toLowerCase();
}

export function parseNutritionDiscoveryType(
  value: string | null
): NutritionDiscoveryType | null {
  if (value === "food" || value === "drink") {
    return value;
  }

  return null;
}

export function parseNutritionDiscoveryLanguage(
  value: string | null
): NutritionDiscoveryLanguage | null {
  if (
    value === "en" ||
    value === "nl" ||
    value === "fr" ||
    value === "de" ||
    value === "pl"
  ) {
    return value;
  }

  return null;
}

export function selectEligibleProductKeys(
  mappings: NutritionProductMarketRow[],
  marketCodes: readonly string[]
) {
  const allowedMarkets = new Set(marketCodes);

  return [...new Set(
    mappings
      .filter(({ market_code }) => allowedMarkets.has(market_code))
      .map(({ product_key }) => product_key)
  )].sort();
}

export function deduplicateDiscoveryRows(
  rows: NutritionProductDiscoveryRow[]
) {
  return [...new Map(
    rows.map((row) => [row.product_key, row])
  ).values()];
}

export function mergeNormalAndExactDiscoveryRows(
  normalRows: NutritionProductDiscoveryRow[],
  exactRows: NutritionProductSearchNameRow[]
) {
  const rowsByProductKey = new Map(
    deduplicateDiscoveryRows(normalRows).map((row) => [
      row.product_key,
      row,
    ])
  );

  const deterministicExactRows = [...exactRows].sort((a, b) =>
    a.product_key.localeCompare(b.product_key) ||
    a.search_name_type.localeCompare(b.search_name_type)
  );

  for (const row of deterministicExactRows) {
    const existing = rowsByProductKey.get(row.product_key);

    if (existing) {
      rowsByProductKey.set(row.product_key, {
        ...existing,
        is_exact_search_match: true,
      });
      continue;
    }

    rowsByProductKey.set(row.product_key, {
      product_key: row.product_key,
      name: row.display_name,
      is_drink: row.is_drink,
      is_basic: row.is_basic,
      is_exact_search_match: true,
    });
  }

  return [...rowsByProductKey.values()];
}
