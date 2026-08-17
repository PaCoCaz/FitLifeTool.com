import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../../../", import.meta.url);
const migrationSource = await readFile(
  new URL(
    "supabase/migrations/20260817090000_harden_billing_access.sql",
    projectRoot
  ),
  "utf8"
);
const dashboardSource = await readFile(
  new URL("app/lib/DashboardStore.tsx", projectRoot),
  "utf8"
);
const favoritesRouteSource = await readFile(
  new URL("app/api/favorites/route.ts", projectRoot),
  "utf8"
);
const favoritesServerSource = await readFile(
  new URL("app/lib/favorites/favoritesServer.ts", projectRoot),
  "utf8"
);

test("customers removes public read and restores authenticated owner-only select", () => {
  assert.match(
    migrationSource,
    /drop policy if exists temporary_public_read_customers\s+on public\.customers;/
  );
  assert.match(
    migrationSource,
    /create policy users_can_read_own_customer[\s\S]*?on public\.customers[\s\S]*?for select[\s\S]*?to authenticated[\s\S]*?using \(user_id = \(select auth\.uid\(\)\)\);/
  );
  assert.doesNotMatch(
    migrationSource,
    /create policy [^;]+on public\.customers[\s\S]*?to (?:public|anon)[\s\S]*?using \(true\)/
  );
});

test("subscriptions removes both public reads and restores owner-only select", () => {
  for (const policy of [
    "public_read_subscriptions",
    "temporary_public_read_subscriptions",
  ]) {
    assert.match(
      migrationSource,
      new RegExp(
        `drop policy if exists ${policy}\\s+on public\\.subscriptions;`
      )
    );
  }

  assert.match(
    migrationSource,
    /create policy users_can_read_own_subscriptions[\s\S]*?to authenticated[\s\S]*?c\.id = subscriptions\.customer_id[\s\S]*?c\.user_id = \(select auth\.uid\(\)\)/
  );
  assert.doesNotMatch(
    migrationSource,
    /create policy [^;]+on public\.subscriptions[\s\S]*?to (?:public|anon)[\s\S]*?using \(true\)/
  );
});

test("plan feature RPC keeps its signature and binds authenticated calls to auth.uid", () => {
  assert.match(
    migrationSource,
    /create or replace function public\.get_user_plan_features\(\s*p_user_id uuid\s*\)/
  );
  assert.match(migrationSource, /security definer/);
  assert.match(migrationSource, /set search_path = ''/);
  assert.match(
    migrationSource,
    /caller_role text := auth\.jwt\(\) ->> 'role'/
  );
  assert.match(migrationSource, /caller_user_id uuid := auth\.uid\(\)/);
  assert.match(
    migrationSource,
    /caller_role = 'authenticated'[\s\S]*?caller_user_id = p_user_id/
  );
  assert.match(
    migrationSource,
    /else\s+raise exception 'Not authorized to resolve plan features'[\s\S]*?errcode = '42501'/
  );
});

test("anon has no RPC execute grant while authenticated and service role remain supported", () => {
  assert.match(
    migrationSource,
    /revoke all\s+on function public\.get_user_plan_features\(uuid\)\s+from public;/
  );
  assert.match(
    migrationSource,
    /revoke all\s+on function public\.get_user_plan_features\(uuid\)\s+from anon;/
  );
  assert.match(
    migrationSource,
    /grant execute\s+on function public\.get_user_plan_features\(uuid\)\s+to authenticated, service_role;/
  );
  assert.doesNotMatch(
    migrationSource,
    /grant execute[\s\S]*?get_user_plan_features\(uuid\)[\s\S]*?to anon;/
  );
});

test("existing authenticated and trusted server callers remain compatible", () => {
  assert.match(
    dashboardSource,
    /supabase\.rpc\("get_user_plan_features", \{\s*p_user_id: user\.id/
  );
  assert.match(favoritesRouteSource, /const user = await getRequestUser\(\)/);
  assert.match(favoritesRouteSource, /createSupabaseServer\(\)/);
  assert.match(
    favoritesServerSource,
    /\.rpc\(\s*"get_user_plan_features",\s*\{\s*p_user_id: userId/
  );
});
