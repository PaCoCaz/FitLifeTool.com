import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, projectRoot), "utf8");
const migration = await read(
  "supabase/migrations/20260827100000_harden_profile_role_authorization.sql"
);

const EXPECTED_PROFILE_UPDATE_COLUMNS = [
  "activity_goal_kcal",
  "activity_level",
  "birthdate",
  "bmi",
  "calculation_sex",
  "calorie_goal",
  "country_code",
  "first_name",
  "food_region",
  "gender",
  "goal",
  "height_cm",
  "language",
  "last_name",
  "target_weight_kg",
  "tdee",
  "updated_at",
  "water_goal_ml",
  "weight_kg",
].sort();

function grantedUpdateColumns() {
  const grant = migration.match(
    /grant update \(([\s\S]*?)\) on table public\.profiles to authenticated;/
  );
  assert.ok(grant, "authenticated profile update grant must exist");
  return grant[1]
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean)
    .sort();
}

test("migration fails closed before enforcing the exact role domain", () => {
  assert.match(
    migration,
    /where p\.role is null[\s\S]*?p\.role not in \('user', 'developer', 'admin', 'owner'\)/
  );
  assert.match(migration, /using errcode = '23514'/);
  assert.doesNotMatch(migration, /update public\.profiles|set role\s*=/i);
  assert.match(migration, /alter column role set default 'user'/);
  assert.match(migration, /alter column role set not null/);
  assert.match(
    migration,
    /check \(role in \('user', 'developer', 'admin', 'owner'\)\)/
  );
});

test("client table writes are revoked before an exact self-service allowlist is granted", () => {
  assert.match(
    migration,
    /revoke insert, update on table public\.profiles from public, anon, authenticated;/
  );
  assert.deepEqual(grantedUpdateColumns(), EXPECTED_PROFILE_UPDATE_COLUMNS);
  assert.equal(grantedUpdateColumns().includes("role"), false);
  assert.equal(grantedUpdateColumns().includes("abonnement"), false);
  assert.doesNotMatch(migration, /grant insert[\s\S]*?to (?:anon|authenticated)/i);
  assert.doesNotMatch(
    migration,
    /grant update on table public\.profiles to authenticated/i
  );
});

test("existing client profile updates remain inside the granted column boundary", async () => {
  const expectedBySource: Record<string, string[]> = {
    "app/lib/LangProvider.tsx": ["language"],
    "app/lib/GoalProvider.tsx": ["goal"],
    "app/lib/recalculateUserTargets.ts": [
      "tdee",
      "calorie_goal",
      "activity_goal_kcal",
      "water_goal_ml",
      "bmi",
    ],
    "app/(app)/dashboard/weight/page.tsx": [
      "weight_kg",
      "target_weight_kg",
      "bmi",
      "water_goal_ml",
    ],
    "app/components/auth/OnboardingBodyStep.tsx": [
      "height_cm",
      "weight_kg",
      "calculation_sex",
      "updated_at",
    ],
    "app/components/auth/OnboardingPersonalStep.tsx": [
      "gender",
      "birthdate",
      "updated_at",
    ],
    "app/components/auth/OnboardingFinalStep.tsx": [
      "activity_level",
      "goal",
      "updated_at",
    ],
    "app/components/settings/AccountCard.tsx": ["first_name", "last_name"],
    "app/components/settings/RegionCard.tsx": [
      "country_code",
      "food_region",
      "updated_at",
    ],
    "app/components/settings/BodyCard.tsx": [
      "birthdate",
      "gender",
      "height_cm",
      "weight_kg",
    ],
    "app/components/settings/LifestyleCard.tsx": ["activity_level"],
  };
  const granted = new Set(grantedUpdateColumns());

  for (const [path, columns] of Object.entries(expectedBySource)) {
    const source = await read(path);
    assert.match(source, /\.from\("profiles"\)[\s\S]*?\.update\(/, path);
    for (const column of columns) {
      assert.match(source, new RegExp(`\\b${column}\\b`), `${path}: ${column}`);
      assert.equal(granted.has(column), true, `${column} must remain writable`);
    }
  }
});

test("profile bootstrap is server-owned and accepts no caller role", async () => {
  const [route, bootstrap] = await Promise.all([
    read("app/api/onboarding/profile/route.ts"),
    read("app/lib/auth/profileBootstrap.ts"),
  ]);

  assert.match(route, /const admin = createSupabaseServer\(\)/);
  assert.match(route, /id: user\.id/);
  assert.doesNotMatch(route, /role\s*:/);
  assert.doesNotMatch(bootstrap, /\brole\b/);
});

test("server bootstrap and billing writers remain outside client column grants", async () => {
  const [bootstrapRoute, entitlementSync] = await Promise.all([
    read("app/api/onboarding/profile/route.ts"),
    read("app/lib/stripe/entitlementSync.ts"),
  ]);

  assert.match(bootstrapRoute, /const admin = createSupabaseServer\(\)/);
  assert.match(entitlementSync, /const supabase = createSupabaseServer\(\)/);
  assert.match(entitlementSync, /abonnement: planId/);
  assert.equal(grantedUpdateColumns().includes("abonnement"), false);
  assert.doesNotMatch(
    migration,
    /revoke[\s\S]*?on table public\.profiles from service_role/i
  );
});

test("profile role authority comes from the own database row, never auth metadata", async () => {
  const [proxy, layout, navigation] = await Promise.all([
    read("proxy.ts"),
    read("app/(app)/handbook/layout.tsx"),
    read("app/components/layout/TopNavigation.tsx"),
  ]);

  for (const source of [proxy, layout, navigation]) {
    assert.match(source, /\.from\("profiles"\)[\s\S]*?\.select\("role"\)/);
    assert.doesNotMatch(source, /(?:user_metadata|app_metadata)[\s\S]{0,80}?role/);
  }
});

test("migration exposes no role-management function to client roles", () => {
  assert.doesNotMatch(migration, /create(?: or replace)? function[\s\S]*?role/i);
  assert.doesNotMatch(
    migration,
    /grant execute[\s\S]*?to (?:public|anon|authenticated)/i
  );
});
