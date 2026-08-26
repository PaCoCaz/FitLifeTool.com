import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AUTH_EMAIL_SYNC_MAX_ATTEMPTS } from "./emailSync.ts";

const migration = await readFile(
  new URL(
    "../../../supabase/migrations/20260825100000_add_auth_email_sync_outbox.sql",
    import.meta.url
  ),
  "utf8"
);
const identityHandbook = await readFile(
  new URL("../../../app/(app)/handbook/doc-l3-0002/page.tsx", import.meta.url),
  "utf8"
);
type ClaimState = {
  attemptCount: number;
  status: "pending" | "processing" | "manual_review";
  leaseExpired: boolean;
};

function claimAfterLeaseExpiry(state: ClaimState) {
  if (
    state.status === "manual_review" ||
    (state.status === "processing" && !state.leaseExpired)
  ) {
    return { state, claimed: false };
  }

  if (state.attemptCount >= AUTH_EMAIL_SYNC_MAX_ATTEMPTS) {
    return {
      state: {
        ...state,
        status: "manual_review" as const,
        leaseExpired: false,
      },
      claimed: false,
    };
  }

  return {
    state: {
      attemptCount: state.attemptCount + 1,
      status: "processing" as const,
      leaseExpired: false,
    },
    claimed: true,
  };
}

test("email sync outbox stores identity and state but never duplicates email PII", () => {
  assert.match(migration, /create table public\.auth_email_sync_jobs/);
  assert.match(
    migration,
    /user_id uuid primary key[\s\S]*?references auth\.users \(id\)[\s\S]*?on delete cascade/
  );
  assert.doesNotMatch(
    migration.match(/create table public\.auth_email_sync_jobs \([\s\S]*?\n\);/)?.[0] ?? "",
    /\bemail\b/
  );
  assert.match(migration, /generation bigint not null default 1/);
  assert.match(migration, /lease_token uuid/);
  assert.match(migration, /lease_expires_at timestamptz/);
});

test("confirmed auth email changes atomically supersede older generations", () => {
  assert.match(
    migration,
    /after update of email on auth\.users[\s\S]*?when \(old\.email is distinct from new\.email\)/
  );
  assert.match(
    migration,
    /on conflict \(user_id\) do update[\s\S]*?generation = public\.auth_email_sync_jobs\.generation \+ 1/
  );
  assert.doesNotMatch(
    migration.match(/create or replace function public\.enqueue_auth_email_sync_from_auth_user\(\)[\s\S]*?\$\$;/)?.[0] ?? "",
    /customers|stripe/i
  );
});

test("the synchronous trigger rollback contract requires a real pre-live database test", () => {
  const triggerFunction =
    migration.match(
      /create or replace function public\.enqueue_auth_email_sync_from_auth_user\(\)[\s\S]*?\$\$;/
    )?.[0] ?? "";
  assert.match(triggerFunction, /insert into public\.auth_email_sync_jobs/);
  assert.doesNotMatch(triggerFunction, /exception\s+when|customers|stripe/i);
  assert.match(identityHandbook, /synchroon onderdeel van dezelfde Auth-databasetransactie/);
  assert.match(identityHandbook, /echte, geïsoleerde\s+database-integratietest verplicht/);
  assert.match(identityHandbook, /statische\s+migrationtests/);
});

test("outbox is RLS protected and service-role only", () => {
  assert.match(
    migration,
    /alter table public\.auth_email_sync_jobs enable row level security;/
  );
  for (const role of ["public", "anon", "authenticated"]) {
    assert.match(
      migration,
      new RegExp(
        `revoke all on table public\\.auth_email_sync_jobs from ${role};`
      )
    );
  }
  assert.match(
    migration,
    /grant select\s+on table public\.auth_email_sync_jobs\s+to service_role;/
  );
  assert.doesNotMatch(migration, /create policy/);
});

test("every callable outbox function is hardened and explicitly owned", () => {
  const functions = [
    "request_auth_email_reconciliation",
    "claim_auth_email_sync_jobs",
    "is_auth_email_sync_lease_current",
    "mark_auth_email_local_synced",
    "complete_auth_email_sync_job",
    "fail_auth_email_sync_job",
  ];

  for (const name of functions) {
    const start = migration.indexOf(`create or replace function public.${name}`);
    const next = migration.indexOf("create or replace function public.", start + 1);
    const source = migration.slice(start, next === -1 ? migration.length : next);
    assert.notEqual(start, -1, `${name} must exist`);
    assert.match(source, /security definer/);
    assert.match(source, /set search_path = ''/);
    assert.match(source, /auth\.jwt\(\) ->> 'role'/);
    assert.match(source, /caller_role <> 'service_role'/);
    assert.match(source, /errcode = '42501'/);
    assert.match(source, /owner to postgres/);
    assert.match(source, /from public, anon, authenticated/);
    assert.match(source, /to service_role/);
  }
});

test("claiming is bounded, concurrent-safe, and recovers expired leases", () => {
  assert.match(migration, /for update skip locked/);
  assert.match(migration, /limit pg_catalog\.least\(pg_catalog\.greatest\(p_limit, 1\), 50\)/);
  assert.match(migration, /j\.status = 'processing'[\s\S]*?j\.lease_expires_at <= pg_catalog\.now\(\)/);
  assert.match(migration, /pg_catalog\.gen_random_uuid\(\)/);
  assert.match(migration, /pg_catalog\.greatest\(p_lease_seconds, 30\)/);
  assert.match(
    migration,
    new RegExp(
      `status = 'manual_review'[\\s\\S]*?last_error_code = 'WORKER_ATTEMPTS_EXHAUSTED'[\\s\\S]*?where j\\.attempt_count >= ${AUTH_EMAIL_SYNC_MAX_ATTEMPTS}`
    )
  );
  assert.match(
    migration,
    new RegExp(
      `from public\\.auth_email_sync_jobs j\\s+where j\\.attempt_count < ${AUTH_EMAIL_SYNC_MAX_ATTEMPTS}[\\s\\S]*?for update skip locked`
    )
  );
});

test("repeated lease expiry stops permanently at the hard attempt limit", () => {
  let state: ClaimState = {
    attemptCount: 0,
    status: "pending",
    leaseExpired: false,
  };

  for (
    let expectedAttempt = 1;
    expectedAttempt <= AUTH_EMAIL_SYNC_MAX_ATTEMPTS;
    expectedAttempt += 1
  ) {
    const result = claimAfterLeaseExpiry(state);
    assert.equal(result.claimed, true);
    assert.equal(result.state.attemptCount, expectedAttempt);
    assert.equal(result.state.status, "processing");
    state = { ...result.state, leaseExpired: true };
  }

  const exhausted = claimAfterLeaseExpiry(state);
  assert.equal(exhausted.claimed, false);
  assert.equal(
    exhausted.state.attemptCount,
    AUTH_EMAIL_SYNC_MAX_ATTEMPTS
  );
  assert.equal(exhausted.state.status, "manual_review");

  const terminal = claimAfterLeaseExpiry(exhausted.state);
  assert.equal(terminal.claimed, false);
  assert.deepEqual(terminal.state, exhausted.state);
});

test("an expired lease below the maximum remains reclaimable", () => {
  const result = claimAfterLeaseExpiry({
    attemptCount: AUTH_EMAIL_SYNC_MAX_ATTEMPTS - 1,
    status: "processing",
    leaseExpired: true,
  });

  assert.equal(result.claimed, true);
  assert.equal(result.state.attemptCount, AUTH_EMAIL_SYNC_MAX_ATTEMPTS);
  assert.equal(result.state.status, "processing");
});

test("stale generations and lost leases cannot mutate completion state", () => {
  for (const name of [
    "is_auth_email_sync_lease_current",
    "mark_auth_email_local_synced",
    "complete_auth_email_sync_job",
    "fail_auth_email_sync_job",
  ]) {
    const start = migration.indexOf(`create or replace function public.${name}`);
    const next = migration.indexOf("create or replace function public.", start + 1);
    const source = migration.slice(start, next === -1 ? migration.length : next);
    assert.match(source, /j\.user_id = p_user_id/);
    assert.match(source, /j\.generation = p_generation/);
    assert.match(source, /j\.lease_token = p_lease_token/);
    assert.match(source, /j\.lease_expires_at > pg_catalog\.now\(\)/);
  }
  assert.match(
    migration,
    /p_completion_reason = 'no_local_billing_relation'[\s\S]*?j\.local_synced_generation = p_generation/
  );
});

test("existing mappings are seeded without copying email PII", () => {
  assert.match(
    migration,
    /insert into public\.auth_email_sync_jobs \(user_id\)\s+select c\.user_id\s+from public\.customers c\s+on conflict \(user_id\) do nothing;/
  );
});

test("error persistence accepts only sanitized non-PII codes", () => {
  assert.match(
    migration,
    /p_error_code !~ '\^\[A-Z0-9_\]\{1,64\}\$'/
  );
  assert.doesNotMatch(migration, /last_error_message|error_detail|provider_payload/);
});
