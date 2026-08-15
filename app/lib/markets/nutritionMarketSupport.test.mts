import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildSupportedRegionalMarketCodes,
  formatUnsupportedRegionMessage,
  isSupportedRegionalMarket,
} from "./nutritionMarketSupport.ts";

const supported = buildSupportedRegionalMarketCodes([
  { market_code: "GLOBAL", is_active: true },
  { market_code: "NL", is_active: true },
  { market_code: "DE", is_active: true },
  { market_code: "BE", is_active: false },
]);

test("active regional market codes come from nutrition markets", () => {
  assert.deepEqual(supported, ["DE", "NL"]);
});

test("GLOBAL is never treated as regional support", () => {
  assert.equal(isSupportedRegionalMarket("GLOBAL", supported), false);
});

test("inactive markets are not treated as supported", () => {
  assert.equal(isSupportedRegionalMarket("BE", supported), false);
});

test("unsupported SE requires the international-results fallback", () => {
  assert.equal(isSupportedRegionalMarket("SE", supported), false);
});

test("supported NL does not require the fallback", () => {
  assert.equal(isSupportedRegionalMarket("NL", supported), true);
});

test("supported DE does not require the fallback", () => {
  assert.equal(isSupportedRegionalMarket("DE", supported), true);
});

test("changing NL to SE changes support to unsupported", () => {
  assert.equal(isSupportedRegionalMarket("NL", supported), true);
  assert.equal(isSupportedRegionalMarket("SE", supported), false);
});

test("changing SE to NL changes support to supported", () => {
  assert.equal(isSupportedRegionalMarket("SE", supported), false);
  assert.equal(isSupportedRegionalMarket("NL", supported), true);
});

test("fallback country name is dynamic and can follow the active UI language", () => {
  const template = "Regional product data for {{country}} will be added later.";
  assert.equal(formatUnsupportedRegionMessage(template, "Sweden"), "Regional product data for Sweden will be added later.");
  assert.equal(formatUnsupportedRegionMessage(template, "Schweden"), "Regional product data for Schweden will be added later.");
});

test("market support API reads only market_code and is_active", async () => {
  const source = await readFile(new URL("../../api/reference/nutrition-markets/route.ts", import.meta.url), "utf8");
  const helper = await readFile(new URL("./nutritionMarketSupport.ts", import.meta.url), "utf8");
  assert.match(helper, /from\("nutrition_markets"\)/);
  assert.match(helper, /select\("market_code, is_active"\)/);
  assert.doesNotMatch(source + helper, /nutrition_product_markets/);
});

test("RegionCard evaluates the saved food region after save", async () => {
  const source = await readFile(new URL("../../components/settings/RegionCard.tsx", import.meta.url), "utf8");
  assert.match(source, /setSaved\(\{ \.\.\.draft \}\)/);
  assert.match(source, /saved\?\.food_region/);
  assert.match(source, /supportedMarketCodes/);
});

test("RegionCard keeps residence country and food region independent", async () => {
  const source = await readFile(new URL("../../components/settings/RegionCard.tsx", import.meta.url), "utf8");
  assert.match(source, /\{ \.\.\.current, country_code \}/);
  assert.match(source, /\{ \.\.\.current, food_region \}/);
  assert.doesNotMatch(source, /country_code: food_region/);
  assert.doesNotMatch(source, /food_region: country_code/);
});

test("GLOBAL is not offered as a food region", async () => {
  const source = await readFile(new URL("../../components/auth/CountrySelect.tsx", import.meta.url), "utf8");
  assert.match(source, /api\/reference\/countries/);
  assert.doesNotMatch(source, /GLOBAL/);
});
