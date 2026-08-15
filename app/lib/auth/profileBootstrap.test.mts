import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveProfileBootstrapValues } from "./profileBootstrap.ts";

test("bootstrap values validate metadata and support recoverable input", () => {
  assert.deepEqual(resolveProfileBootstrapValues({ first_name: "Ada", last_name: "Lovelace", country_code: "GB", food_region: "GB", language: "en" }), {
    first_name: "Ada", last_name: "Lovelace", country_code: "GB", food_region: "GB", language: "en",
  });
  assert.equal(resolveProfileBootstrapValues({ country_code: "GLOBAL" }), null);
  assert.ok(resolveProfileBootstrapValues({}, { first_name: "Ada", last_name: "Lovelace", country_code: "NL", food_region: "NL", language: "nl" }));
});

test("bootstrap route authenticates, is idempotent and never trusts a supplied user id", async () => {
  const source = await readFile(new URL("../../api/onboarding/profile/route.ts", import.meta.url), "utf8");
  assert.match(source, /auth\.getUser\(\)/);
  assert.match(source, /if \(existing\) return Response\.json\(\{ status: "exists" \}/);
  assert.match(source, /id: user\.id/);
  assert.doesNotMatch(source, /recovery\.user_id|body\.user_id/);
  assert.match(source, /\.eq\("is_active", true\)/);
});
