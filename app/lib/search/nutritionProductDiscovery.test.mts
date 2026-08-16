import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolveNutritionDiscoveryMarketCodes } from "../markets/nutritionMarketSupport.ts";
import {
  deduplicateDiscoveryRows,
  mergeNormalAndExactDiscoveryRows,
  normalizeNutritionSearchName,
  parseNutritionDiscoveryLanguage,
  parseNutritionDiscoveryType,
  selectEligibleProductKeys,
} from "./nutritionProductDiscoveryRules.ts";
import {
  rankAndLimitProductSearchResults,
} from "./productSearchFilters.ts";

const markets = [
  { market_code: "GLOBAL", is_active: true },
  { market_code: "NL", is_active: true },
  { market_code: "DE", is_active: true },
];

const mappings = [
  { product_key: "APPLE", market_code: "GLOBAL" },
  { product_key: "CHEESE_30", market_code: "NL" },
  { product_key: "BREAD_CORN", market_code: "NL" },
  { product_key: "BREAD_CORN", market_code: "DE" },
  { product_key: "DE_ONLY", market_code: "DE" },
];

function eligibleFor(foodRegion: string) {
  return selectEligibleProductKeys(
    mappings,
    resolveNutritionDiscoveryMarketCodes(foodRegion, markets)
  );
}

test("GLOBAL product is discoverable in every region scope", () => {
  assert.equal(eligibleFor("NL").includes("APPLE"), true);
  assert.equal(eligibleFor("DE").includes("APPLE"), true);
  assert.equal(eligibleFor("SE").includes("APPLE"), true);
});

test("NL-only product is excluded from DE and unsupported SE", () => {
  assert.equal(eligibleFor("NL").includes("CHEESE_30"), true);
  assert.equal(eligibleFor("DE").includes("CHEESE_30"), false);
  assert.equal(eligibleFor("SE").includes("CHEESE_30"), false);
});

test("DE-only fixture is excluded from NL", () => {
  assert.equal(eligibleFor("DE").includes("DE_ONLY"), true);
  assert.equal(eligibleFor("NL").includes("DE_ONLY"), false);
});

test("multi-region product appears only once", () => {
  const keys = selectEligibleProductKeys(
    [
      ...mappings,
      { product_key: "BREAD_CORN", market_code: "NL" },
    ],
    ["GLOBAL", "NL"]
  );

  assert.equal(
    keys.filter((key) => key === "BREAD_CORN").length,
    1
  );
});

test("duplicate search rows are reduced to one product", () => {
  const rows = deduplicateDiscoveryRows([
    {
      product_key: "APPLE",
      name: "Apple",
      is_drink: false,
      is_basic: true,
    },
    {
      product_key: "APPLE",
      name: "Apple",
      is_drink: false,
      is_basic: true,
    },
  ]);

  assert.equal(rows.length, 1);
});

test("exact search normalization is case-insensitive and Unicode-whitespace safe", () => {
  assert.equal(
    normalizeNutritionSearchName(
      "  GOUDSE\u00a0\u2003kaas 48+  "
    ),
    "goudse kaas 48+"
  );
  assert.equal(
    normalizeNutritionSearchName("Kaas, 48+, Goudse"),
    "kaas, 48+, goudse"
  );
});

test("partial, typo and unregistered alias terms are not exact matches", () => {
  const approvedAlias = normalizeNutritionSearchName(
    "Goudse kaas 48+"
  );

  assert.notEqual(normalizeNutritionSearchName("kaas"), approvedAlias);
  assert.notEqual(
    normalizeNutritionSearchName("Goudse kaas 48"),
    approvedAlias
  );
  assert.notEqual(
    normalizeNutritionSearchName("Kaas 48+"),
    approvedAlias
  );
});

test("alias exact matches expose the official display name", () => {
  const rows = mergeNormalAndExactDiscoveryRows([], [
    {
      product_key: "CHEESE_GOUDA_48",
      display_name: "Kaas, 48+, Goudse",
      is_drink: false,
      is_basic: true,
      search_name_type: "ALIAS",
    },
  ]);

  assert.deepEqual(rows, [
    {
      product_key: "CHEESE_GOUDA_48",
      name: "Kaas, 48+, Goudse",
      is_drink: false,
      is_basic: true,
      is_exact_search_match: true,
    },
  ]);
});

test("an in-scope exact product is not returned twice", () => {
  const rows = mergeNormalAndExactDiscoveryRows([
    {
      product_key: "CHEESE_GOUDA_48",
      name: "Kaas, 48+, Goudse",
      is_drink: false,
      is_basic: true,
    },
  ], [
    {
      product_key: "CHEESE_GOUDA_48",
      display_name: "Kaas, 48+, Goudse",
      is_drink: false,
      is_basic: true,
      search_name_type: "OFFICIAL",
    },
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.is_exact_search_match, true);
});

test("multiple genuine exact products have deterministic product order", () => {
  const rows = mergeNormalAndExactDiscoveryRows([], [
    {
      product_key: "PRODUCT_B",
      display_name: "Shared name",
      is_drink: false,
      is_basic: false,
      search_name_type: "ALIAS",
    },
    {
      product_key: "PRODUCT_A",
      display_name: "Shared name",
      is_drink: false,
      is_basic: false,
      search_name_type: "OFFICIAL",
    },
  ]);

  assert.deepEqual(
    rows.map(({ product_key }) => product_key),
    ["PRODUCT_A", "PRODUCT_B"]
  );
});

test("ranking remains exact, starts-with, contains and locale-aware", () => {
  const ranked = rankAndLimitProductSearchResults([
    { product_key: "CONTAINS", name: "Red apple" },
    { product_key: "STARTS", name: "Apple sauce" },
    { product_key: "EXACT", name: "Apple" },
  ], "apple", "en");

  assert.deepEqual(
    ranked.map(({ product_key }) => product_key),
    ["EXACT", "STARTS", "CONTAINS"]
  );
});

test("route parameters accept only supported food/drink and languages", () => {
  assert.equal(parseNutritionDiscoveryType("food"), "food");
  assert.equal(parseNutritionDiscoveryType("drink"), "drink");
  assert.equal(parseNutritionDiscoveryType("other"), null);
  assert.equal(parseNutritionDiscoveryLanguage("nl"), "nl");
  assert.equal(parseNutritionDiscoveryLanguage("sv"), null);
});

test("eligibility is part of the database search before the result limit", async () => {
  const source = await readFile(
    new URL("./nutritionProductDiscovery.ts", import.meta.url),
    "utf8"
  );
  const searchStart = source.indexOf(
    '.from("nutrition_products_search")'
  );
  const eligibleFilter = source.indexOf(
    '.in("product_key", context.eligibleProductKeys)',
    searchStart
  );
  const resultLimit = source.indexOf(
    ".limit(NUTRITION_DISCOVERY_SEARCH_LIMIT)",
    searchStart
  );

  assert.ok(searchStart >= 0);
  assert.ok(eligibleFilter > searchStart);
  assert.ok(resultLimit > eligibleFilter);
});

test("categories use the same eligible product set", async () => {
  const source = await readFile(
    new URL("./nutritionProductDiscovery.ts", import.meta.url),
    "utf8"
  );
  const categoriesStart = source.indexOf(
    "listNutritionDiscoveryCategories"
  );
  const eligibleFilter = source.indexOf(
    '.in("product_key", context.eligibleProductKeys)',
    categoriesStart
  );

  assert.ok(categoriesStart >= 0);
  assert.ok(eligibleFilter > categoriesStart);
});

test("server route authenticates and never accepts client identity or market scope", async () => {
  const source = await readFile(
    new URL("../../api/nutrition/products/search/route.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /client\.auth\.getUser\(\)/);
  assert.match(source, /user\.id/);
  assert.doesNotMatch(source, /searchParams\.get\("user_id"\)/);
  assert.doesNotMatch(source, /searchParams\.get\("food_region"\)/);
  assert.doesNotMatch(source, /searchParams\.get\("market/);
});

test("every request reloads persistent profile food_region and active markets", async () => {
  const source = await readFile(
    new URL("./nutritionProductDiscovery.ts", import.meta.url),
    "utf8"
  );

  assert.match(source, /from\("profiles"\)/);
  assert.match(source, /select\("food_region"\)/);
  assert.match(source, /from\("nutrition_markets"\)/);
  assert.match(source, /select\("market_code, is_active"\)/);
});

test("food and drink pages share ProductSearchPage and the same API", async () => {
  const [food, drink, searchPage] = await Promise.all([
    readFile(
      new URL("../../(app)/dashboard/food/search/page.tsx", import.meta.url),
      "utf8"
    ),
    readFile(
      new URL("../../(app)/dashboard/drink/search/page.tsx", import.meta.url),
      "utf8"
    ),
    readFile(
      new URL("../../components/dashboard/ProductSearchPage.tsx", import.meta.url),
      "utf8"
    ),
  ]);

  assert.match(food, /<SearchPage type="food"/);
  assert.match(drink, /<SearchPage type="drink"/);
  assert.match(searchPage, /api\/nutrition\/products\/search/);
});

test("search and category requests reject stale responses", async () => {
  const source = await readFile(
    new URL("../../components/dashboard/ProductSearchPage.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /categoryRequestSequenceRef/);
  assert.match(source, /searchRequestSequenceRef/);
  assert.match(source, /new AbortController\(\)/);
  assert.match(source, /requestSequence !== searchRequestSequenceRef\.current/);
});

test("favorites, history and direct product routes remain market-unfiltered", async () => {
  const sources = await Promise.all([
    readFile(
      new URL("../favorites/favoritesServer.ts", import.meta.url),
      "utf8"
    ),
    readFile(
      new URL("../../(app)/dashboard/hydration/page.tsx", import.meta.url),
      "utf8"
    ),
    readFile(
      new URL("../../(app)/dashboard/food/add/[productKey]/page.tsx", import.meta.url),
      "utf8"
    ),
    readFile(
      new URL("../../(app)/dashboard/drink/add/[productKey]/page.tsx", import.meta.url),
      "utf8"
    ),
  ]);

  for (const source of sources) {
    assert.doesNotMatch(source, /nutrition_product_markets/);
  }
});

test("cross-market fallback uses only strict exact names in the active language and type", async () => {
  const source = await readFile(
    new URL("./nutritionProductDiscovery.ts", import.meta.url),
    "utf8"
  );
  const exactStart = source.indexOf(
    '.from("nutrition_product_search_names")'
  );
  const exactEnd = source.indexOf(
    "if (exactResult.error)",
    exactStart
  );
  const exactQuery = source.slice(exactStart, exactEnd);

  assert.ok(exactStart >= 0);
  assert.match(
    exactQuery,
    /\.eq\("search_name_normalized", normalizedQuery\)/
  );
  assert.match(exactQuery, /\.eq\("lang", input\.lang\)/);
  assert.match(
    exactQuery,
    /\.eq\("is_drink", input\.type === "drink"\)/
  );
  assert.match(exactQuery, /\.order\("product_key"/);
  assert.doesNotMatch(exactQuery, /\.ilike\(|\.like\(|textSearch/);
});
