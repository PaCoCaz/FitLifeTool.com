import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const migrationPath = "supabase/migrations/20261016100000_add_public_registration_control.sql";
const read = (path: string) => readFile(new URL(path, root), "utf8");

test("migration creates one closed singleton with server-clock expiry", async () => {
  const sql = await read(migrationPath);
  assert.match(sql, /singleton_id smallint primary key default 1/);
  assert.match(sql, /insert into public\.public_registration_control[\s\S]*values \(1, false\)/);
  assert.match(sql, /open_until > pg_catalog\.clock_timestamp\(\)/);
  assert.match(sql, /pg_catalog\.make_interval\(mins => p_duration_minutes\)/);
  assert.match(sql, /p_duration_minutes < 1 or p_duration_minutes > 60/);
  assert.doesNotMatch(sql, /client_timestamp|p_open_until/);
});

test("admin mutations are canonically authorized, serialized and transactionally audited", async () => {
  const sql = await read(migrationPath);
  assert.match(sql, /caller_user_id uuid := auth\.uid\(\)/);
  assert.match(sql, /caller_role text := auth\.jwt\(\) ->> 'role'/);
  assert.match(sql, /application_role not in \('owner', 'admin'\)/);
  assert.match(sql, /from public\.public_registration_control[\s\S]*for update/);
  assert.match(sql, /insert into public\.public_registration_control_events/);
  assert.match(sql, /append-only/);
  assert.doesNotMatch(sql, /email|token|secret/i);
});

test("RLS, ACL and grants expose only the narrow functions", async () => {
  const sql = await read(migrationPath);
  assert.equal((sql.match(/enable row level security/g) ?? []).length, 2);
  assert.match(sql, /revoke all on table public\.public_registration_control from public, anon, authenticated/);
  assert.match(sql, /revoke all on table public\.public_registration_control_events from public, anon, authenticated/);
  assert.match(sql, /grant execute on function public\.get_public_registration_status\(\) to anon, authenticated/);
  assert.match(sql, /grant execute on function public\.set_public_registration_status\(text, integer\) to authenticated/);
  assert.match(sql, /grant execute on function public\.hook_enforce_public_registration\(jsonb\) to supabase_auth_admin/);
  assert.doesNotMatch(sql, /grant (?:all|select|insert|update|delete) on table[\s\S]*authenticated/i);
});

test("Before User Created hook validates the documented payload and has no bypass", async () => {
  const sql = await read(migrationPath);
  assert.match(sql, /input #>> '\{metadata,name\}' <> 'before-user-created'/);
  assert.match(sql, /\{user,app_metadata,provider\}/);
  assert.equal((sql.match(/\bcoalesce\(pg_catalog\.jsonb_typeof/g) ?? []).length, 3);
  assert.doesNotMatch(sql, /pg_catalog\.coalesce\(/);
  assert.match(sql, /control_count <> 1 or effective_open is not true/);
  assert.match(sql, /exception when others then/);
  assert.match(sql, /'http_code', 403/);
  assert.doesNotMatch(sql, /hook_name|bypass|is_admin|user_metadata.*admin/i);
});

test("provider contract records signup and invite gating while admin create remains separate", async () => {
  const [sql, handbook, panel] = await Promise.all([
    read(migrationPath),
    read("app/(app)/handbook/doc-l3-0002/page.tsx"),
    read("app/components/admin/RegistrationControlPanel.tsx"),
  ]);
  assert.match(sql, /gates public signup and admin invites; admin\.createUser uses the separate authorized admin route/);
  assert.match(handbook, /inviteUserByEmail/);
  assert.match(handbook, /admin\.createUser/);
  assert.match(panel, /inviteRestriction/);
});
