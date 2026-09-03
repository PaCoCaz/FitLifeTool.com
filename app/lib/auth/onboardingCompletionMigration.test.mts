import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../../../supabase/migrations/20260903100000_add_atomic_onboarding_completion.sql",
  import.meta.url
);
const sql = await readFile(migrationUrl, "utf8");

function functionBody(name: string) {
  const pattern = new RegExp(
    `(?:create|create or replace) function public\\.${name}\\([\\s\\S]*?\\n\\$function\\$;`,
    "i"
  );
  const match = sql.match(pattern);
  assert.ok(match, `${name} definition must exist`);
  return match[0];
}

test("migration is transactional and refuses unexpected live schema", () => {
  assert.match(sql, /^begin;/i);
  assert.match(sql, /commit;\s*$/i);
  assert.match(sql, /AUTH_JOURNEY_04E_SCHEMA_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_PROFILE_COLUMN_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_GOAL_EXCLUSION_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_RECALCULATION_SIGNATURE_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_TRIGGER_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_FUNCTION_OVERLOAD_PRECONDITION_FAILED/);
  assert.match(sql, /AUTH_JOURNEY_04E_FUNCTION_COLLISION/);
  assert.doesNotMatch(sql, /drop table|alter table[\s\S]*drop column|disable trigger/i);
});

test("migration rejects every unexpected protected function overload", () => {
  for (const name of [
    "recalculate_user_targets",
    "trigger_recalculate_targets",
    "recalculate_user_targets_internal",
    "complete_user_onboarding",
  ]) {
    assert.match(
      sql,
      new RegExp(
        `procedure_record\\.proname(?:\\s*=\\s*'${name}'|\\s+in\\s*\\([\\s\\S]*?'${name}')`,
        "i"
      )
    );
  }
  assert.match(sql, /namespace_record\.nspname = 'public'/);
  assert.match(sql, /recalculate_user_targets'[\s\S]*?\) <> 1/);
  assert.match(sql, /trigger_recalculate_targets'[\s\S]*?\) <> 1/);
});

test("completion RPC has the exact identity-free signature and least privilege", () => {
  const body = functionBody("complete_user_onboarding");
  assert.match(
    body,
    /complete_user_onboarding\(\s*p_activity_level text,\s*p_goal text\s*\)\s*returns text/i
  );
  assert.doesNotMatch(body, /p_user_id|p_email|return_to|returnTo/i);
  assert.match(body, /security definer/i);
  assert.match(body, /set search_path = ''/i);
  assert.match(body, /caller_user_id uuid := auth\.uid\(\)/);
  assert.match(body, /caller_role text := auth\.jwt\(\) ->> 'role'/);
  assert.match(
    body,
    /caller_role is distinct from 'authenticated'\s+or caller_user_id is null/
  );
  assert.match(body, /where profile\.id = caller_user_id\s*for update/);

  assert.match(
    sql,
    /alter function public\.complete_user_onboarding\(text, text\) owner to postgres/i
  );
  assert.match(
    sql,
    /revoke all on function public\.complete_user_onboarding\(text, text\)\s+from public, anon, authenticated, service_role/i
  );
  assert.match(
    sql,
    /grant execute on function public\.complete_user_onboarding\(text, text\)\s+to authenticated/i
  );
  assert.doesNotMatch(
    sql,
    /grant execute on function public\.complete_user_onboarding\(text, text\)[\s\S]*?to (?:public|anon|service_role)/i
  );
});

test("completion validates prerequisites, active regions and onboarding allowlists", () => {
  const body = functionBody("complete_user_onboarding");
  for (const value of [
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
    "LOSE",
    "MAINTAIN",
    "GAIN",
    "male",
    "female",
    "other",
  ]) {
    assert.match(body, new RegExp(`'${value}'`));
  }
  assert.doesNotMatch(
    body.slice(body.indexOf("if p_activity_level"), body.indexOf("select profile.*")),
    /HOLIDAY/
  );
  assert.match(body, /profile_row\.birthdate > current_date/);
  assert.match(body, /profile_row\.height_cm <= 0/);
  assert.match(body, /profile_row\.weight_kg <= 0/);
  assert.match(body, /from public\.countries as country[\s\S]*country\.is_active = true/);
  assert.match(body, /from public\.countries as food_region[\s\S]*food_region\.is_active = true/);
});

test("completion serializes goal establishment and relies on one trigger recalculation", () => {
  const body = functionBody("complete_user_onboarding");
  assert.match(body, /from public\.user_goal_periods as goal_period[\s\S]*end_at is null/);
  assert.match(body, /for update/);
  assert.match(body, /active_goal_count > 1[\s\S]*return 'STATE_CONFLICT'/);
  assert.match(body, /insert into public\.user_goal_periods/);
  assert.match(body, /update public\.user_goal_periods as goal_period/);
  assert.match(body, /update public\.profiles as profile[\s\S]*activity_level = p_activity_level/);
  assert.ok(
    body.indexOf("insert into public.user_goal_periods") <
      body.indexOf("update public.profiles as profile")
  );
  assert.doesNotMatch(body, /perform public\.recalculate_user_targets_internal/);
  assert.match(body, /return 'ALREADY_COMPLETE'/);
  assert.match(body, /return 'COMPLETED'/);
});

test("internal calculator is owner-only, active-goal based and preserves live formulas", () => {
  const body = functionBody("recalculate_user_targets_internal");
  assert.match(body, /security definer/i);
  assert.match(body, /set search_path = ''/i);
  assert.match(body, /goal_period\.end_at is null/);
  assert.doesNotMatch(body, /order by[\s\S]*start_at/i);
  for (const multiplier of ["1.15", "1.25", "1.35", "1.45", "1.55"]) {
    assert.match(body, new RegExp(multiplier.replace(".", "\\.")));
  }
  assert.match(body, /when 'LOSE' then -400/);
  assert.match(body, /when 'GAIN' then 400/);
  assert.match(body, /when 'male' then 1600/);
  assert.match(body, /else 1200/);
  assert.match(body, /pg_catalog\.greatest\(250, calculated_tdee \* 0\.20\)/);
  assert.match(body, /water_goal_ml = pg_catalog\.round\(profile_weight_kg \* 35\)/);
  assert.doesNotMatch(body, /\bbmi\b/i);
  assert.match(
    sql,
    /revoke all on function public\.recalculate_user_targets_internal\(uuid\)\s+from public, anon, authenticated, service_role/i
  );
  assert.doesNotMatch(
    sql,
    /grant execute on function public\.recalculate_user_targets_internal/i
  );
});

test("compatible recalculation wrapper binds authenticated callers and retains service role", () => {
  const body = functionBody("recalculate_user_targets");
  assert.match(body, /recalculate_user_targets\(p_user_id uuid\)\s*returns void/i);
  assert.match(body, /security definer/i);
  assert.match(body, /set search_path = ''/i);
  assert.match(body, /caller_role = 'authenticated' and caller_user_id = p_user_id/);
  assert.match(body, /caller_role = 'service_role'/);
  assert.match(body, /errcode = '42501'/);
  assert.match(body, /perform public\.recalculate_user_targets_internal\(p_user_id\)/);
  assert.match(
    sql,
    /grant execute on function public\.recalculate_user_targets\(uuid\)\s+to authenticated, service_role/i
  );
});

test("profile trigger skips pre-goal updates and recalculates once a goal exists", () => {
  const body = functionBody("trigger_recalculate_targets");
  assert.match(body, /returns trigger/i);
  assert.match(body, /security definer/i);
  assert.match(body, /set search_path = ''/i);
  assert.match(
    body,
    /if not exists \([\s\S]*from public\.user_goal_periods as goal_period[\s\S]*goal_period\.user_id = new\.id[\s\S]*goal_period\.end_at is null[\s\S]*then\s+return new;\s+end if;/i
  );
  assert.ok(
    body.indexOf("if not exists") <
      body.indexOf("perform public.recalculate_user_targets_internal(new.id)")
  );
  assert.match(body, /perform public\.recalculate_user_targets_internal\(new\.id\)/);
  assert.match(sql, /recalc_targets_on_profile_update/);
  assert.match(sql, /after update of weight_kg, activity_level/i);
});

test("database relations in hardened functions are schema-qualified", () => {
  for (const name of [
    "recalculate_user_targets_internal",
    "recalculate_user_targets",
    "trigger_recalculate_targets",
    "complete_user_onboarding",
  ]) {
    const body = functionBody(name);
    assert.doesNotMatch(body, /^\s*from\s+(?!public\.)[a-z_]+/im);
    assert.doesNotMatch(body, /^\s*update\s+(?!public\.)[a-z_]+/im);
    assert.doesNotMatch(body, /^\s*insert into\s+(?!public\.)[a-z_]+/im);
    assert.doesNotMatch(body, /^\s*delete from\s+(?!public\.)[a-z_]+/im);
  }
});
