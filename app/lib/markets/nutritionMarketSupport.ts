const REGIONAL_MARKET_CODE = /^[A-Z]{2}$/;

export type NutritionMarketRow = {
  market_code: string;
  is_active: boolean;
};

type NutritionMarketClient = {
  from: (table: string) => unknown;
};

type NutritionMarketsTable = {
  select: (columns: string) => Promise<{
    data: NutritionMarketRow[] | null;
    error: unknown;
  }>;
};

export function buildSupportedRegionalMarketCodes(rows: NutritionMarketRow[]) {
  return [...new Set(
    rows
      .filter(({ market_code, is_active }) => is_active && REGIONAL_MARKET_CODE.test(market_code))
      .map(({ market_code }) => market_code)
  )].sort();
}

export function isSupportedRegionalMarket(
  foodRegion: string,
  supportedMarketCodes: readonly string[]
) {
  return supportedMarketCodes.includes(foodRegion);
}

export function formatUnsupportedRegionMessage(template: string, countryName: string) {
  return template.replace("{{country}}", countryName);
}

export async function getSupportedRegionalMarketCodes(client: NutritionMarketClient) {
  const { data, error } = await (client.from("nutrition_markets") as NutritionMarketsTable)
    .select("market_code, is_active");

  if (error) throw error;
  return buildSupportedRegionalMarketCodes(data ?? []);
}
