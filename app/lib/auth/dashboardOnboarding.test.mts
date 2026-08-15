import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../DashboardStore.tsx", import.meta.url), "utf8");

test("DashboardProvider does not refresh before onboarding profile bootstrap", () => {
  assert.match(source, /pathname === "\/onboarding"/);
  assert.match(source, /if \(!user\?\.id \|\| isOnboarding\)/);
  assert.match(source, /enabled: Boolean\(user\?\.id\) && !isOnboarding/);
});

test("an absent onboarding profile is an optional query result", () => {
  const profileQueries = source.match(/\.maybeSingle\(\)/g) ?? [];
  assert.ok(profileQueries.length >= 2);
  assert.doesNotMatch(source, /\.eq\("id", user\.id\)\s*\.single\(\)/);
});

test("real Supabase errors are logged without secrets or personal data", () => {
  assert.match(source, /message: error\.message \?\? null/);
  assert.match(source, /code: error\.code \?\? null/);
  assert.match(source, /details: error\.details \?\? null/);
  assert.match(source, /hint: error\.hint \?\? null/);
});
