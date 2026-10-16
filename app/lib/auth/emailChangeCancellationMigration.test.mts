import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migration = await readFile(
  new URL(
    "../../../supabase/migrations/20261015100000_add_auth_email_change_cancellation.sql",
    import.meta.url
  ),
  "utf8"
);

type RequestStatus =
  | "confirmation_pending"
  | "canonical_changed"
  | "completed"
  | "cancelled";

type CancellationState = {
  userId: string;
  generation: number;
  correlationId: string;
  status: RequestStatus;
  providerMutationStarted: boolean;
  providerAccepted: boolean;
  canonicalChanged: boolean;
  completed: boolean;
  syncJobExists: boolean;
  auditExists: boolean;
};

type ProviderState = {
  pendingAddress: boolean;
  currentToken: boolean;
  newToken: boolean;
  confirmStatus: number;
  sentAt: boolean;
};

type ProviderSchemaFields = {
  legacy: boolean;
  current: boolean;
  next: boolean;
  confirmStatus: boolean;
};

function isExactProviderSchema(fields: ProviderSchemaFields) {
  const secureFieldCount = Number(fields.current) + Number(fields.next) +
    Number(fields.confirmStatus);
  return (fields.legacy && secureFieldCount === 0) ||
    (!fields.legacy && secureFieldCount === 3);
}

function cancelRequest(
  state: CancellationState,
  provider: ProviderState,
  expected: { userId: string; generation: number; correlationId: string },
  reason = "PROVIDER_PENDING_CLEARED"
) {
  const providerClear = !provider.pendingAddress && !provider.currentToken &&
    !provider.newToken && provider.confirmStatus === 0 && !provider.sentAt;
  const identityMatches = state.userId === expected.userId &&
    state.generation === expected.generation &&
    state.correlationId === expected.correlationId;
  if (!providerClear || !identityMatches || reason !== "PROVIDER_PENDING_CLEARED") {
    return { state, changed: false, accepted: false };
  }
  if (state.status === "cancelled") {
    return { state, changed: false, accepted: state.auditExists };
  }
  const eligible = state.status === "confirmation_pending" &&
    state.providerMutationStarted && state.providerAccepted &&
    !state.canonicalChanged && !state.completed && !state.syncJobExists;
  if (!eligible) return { state, changed: false, accepted: false };
  return {
    state: { ...state, status: "cancelled" as const, auditExists: true },
    changed: true,
    accepted: true,
  };
}

const base: CancellationState = {
  userId: "user-a",
  generation: 1,
  correlationId: "correlation-a",
  status: "confirmation_pending",
  providerMutationStarted: true,
  providerAccepted: true,
  canonicalChanged: false,
  completed: false,
  syncJobExists: false,
  auditExists: false,
};

const clearProvider: ProviderState = {
  pendingAddress: false,
  currentToken: false,
  newToken: false,
  confirmStatus: 0,
  sentAt: false,
};

test("migration is transactional and collision/precondition guarded", () => {
  assert.match(migration, /^--[\s\S]*?\nbegin;/);
  assert.match(migration, /do \$preconditions\$[\s\S]*?\$preconditions\$;/);
  assert.match(migration, /Required Email Change relations are missing/);
  assert.match(migration, /Required Auth provider field is missing/);
  assert.match(migration, /Unexpected remediation audit relation collision/);
  assert.match(migration, /Unexpected cancellation function collision/);
  assert.match(migration, /\ncommit;\s*$/);
});

test("cancelled is explicit, terminal, historically accurate, and retryable only by a new generation", () => {
  assert.match(migration, /'manual_review', 'cancelled'/);
  assert.match(migration, /status = 'cancelled'[\s\S]*?cancelled_at is not null/);
  assert.match(migration, /provider_mutation_started_at is not null/);
  assert.match(migration, /provider_accepted_at is not null/);
  assert.match(migration, /canonical_changed_at is null/);
  assert.match(migration, /canonical_changed_generation is null/);
  assert.match(migration, /completed_at is null/);
  assert.match(migration, /status in \('request_failed', 'completed', 'cancelled'\)/);
  assert.match(migration, /generation = public\.auth_email_change_requests\.generation \+ 1/);
  assert.doesNotMatch(migration, /set status = 'completed'/);
});

test("provider clearance supports only known locked Auth schemas and never trusts a boolean", () => {
  const cancellation = migration.indexOf("create function public.cancel_auth_email_change_request");
  const providerRead = migration.indexOf("from auth.users user_record", cancellation);
  const lock = migration.indexOf("pg_advisory_xact_lock", providerRead);
  const requestRead = migration.indexOf("from public.auth_email_change_requests request_row", lock);
  const transition = migration.indexOf("set status = 'cancelled'", requestRead);
  assert.ok(providerRead >= 0 && lock > providerRead && requestRead > lock && transition > requestRead);
  assert.match(migration, /pg_catalog\.to_jsonb\(user_record\)/);
  for (const field of [
    "email_change", "email_change_token", "email_change_token_current",
    "email_change_token_new", "email_change_confirm_status", "email_change_sent_at",
  ]) assert.match(migration, new RegExp(field));
  assert.match(migration, /Unsupported Auth provider Email Change schema/);
  assert.match(migration, /has_legacy_provider_schema and secure_provider_column_count = 0/);
  assert.match(migration, /not has_legacy_provider_schema and has_secure_provider_schema/);
  assert.match(migration, /has_legacy_provider_schema and not has_any_secure_provider_field/);
  assert.match(migration, /if has_secure_provider_schema then/);
  assert.match(migration, /elsif has_legacy_provider_schema then/);
  assert.match(migration, /for update;/);
  assert.match(migration, /Required canonical Email Change trigger is missing or disabled/);
  assert.match(migration, /trigger_record\.tgenabled in \('O', 'A'\)/);
  assert.match(migration, /enqueue_auth_email_sync_from_auth_user\(\)/);
  assert.doesNotMatch(migration, /p_provider_(?:clear|pending)/);
});

test("only exact legacy and exact secure provider schemas are accepted", () => {
  const accepted: string[] = [];
  const rejected: string[] = [];

  for (let mask = 0; mask < 16; mask += 1) {
    const fields = {
      legacy: Boolean(mask & 8),
      current: Boolean(mask & 4),
      next: Boolean(mask & 2),
      confirmStatus: Boolean(mask & 1),
    };
    const shape = [fields.legacy, fields.current, fields.next, fields.confirmStatus]
      .map((present) => present ? "1" : "0")
      .join("");
    (isExactProviderSchema(fields) ? accepted : rejected).push(shape);
  }

  assert.deepEqual(accepted, ["0111", "1000"]);
  assert.equal(rejected.length, 14);
  for (const hybrid of ["1001", "1010", "1100", "1011", "1101", "1110", "1111"]) {
    assert.ok(rejected.includes(hybrid), `hybrid schema ${hybrid} must fail closed`);
  }
  for (const partialSecure of ["0001", "0010", "0011", "0100", "0101", "0110"]) {
    assert.ok(rejected.includes(partialSecure), `partial secure schema ${partialSecure} must fail closed`);
  }
  assert.ok(rejected.includes("0000"), "unknown schema must fail closed");
});

test("cancellation is exact-CAS, canonical-safe, sync-safe, and idempotent", () => {
  const start = migration.indexOf("create function public.cancel_auth_email_change_request");
  const end = migration.indexOf("create or replace function public.get_own_auth_email_change_state", start);
  const source = migration.slice(start, end);
  assert.match(source, /request_row\.user_id = p_user_id/);
  assert.match(source, /request_row\.generation = p_generation/);
  assert.match(source, /request_row\.correlation_id = p_correlation_id/);
  assert.match(source, /request_record\.status <> 'confirmation_pending'/);
  assert.match(source, /request_record\.canonical_changed_at is not null/);
  assert.match(source, /request_record\.canonical_changed_generation is not null/);
  assert.match(source, /request_record\.completed_at is not null/);
  assert.match(source, /job_record\.request_generation = p_generation/);
  assert.match(source, /if request_record\.status = 'cancelled'/);
  assert.match(source, /auth_email_change_remediation_events/);
});

test("ACL and audit surface are service-role-only and PII-minimal", () => {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on table public\.auth_email_change_remediation_events[\s\S]*?service_role/);
  assert.match(migration, /grant select on table public\.auth_email_change_remediation_events to service_role/);
  assert.match(migration, /revoke insert, update on table public\.auth_email_change_requests from service_role/);
  assert.match(migration, /caller_role is distinct from 'service_role'/);
  assert.match(migration, /revoke all on function public\.cancel_auth_email_change_request[\s\S]*?public, anon, authenticated/);
  assert.match(migration, /grant execute[\s\S]*?cancel_auth_email_change_request[\s\S]*?to service_role/);
  const auditTable = migration.match(
    /create table public\.auth_email_change_remediation_events \([\s\S]*?\n\);/
  )?.[0] ?? "";
  assert.doesNotMatch(auditTable, /\bemail\b|token|callback|link|payload/i);
});

test("provider-pending variants all fail closed", () => {
  for (const provider of [
    { ...clearProvider, pendingAddress: true },
    { ...clearProvider, currentToken: true },
    { ...clearProvider, newToken: true },
    { ...clearProvider, confirmStatus: 1 },
    { ...clearProvider, sentAt: true },
  ]) {
    const result = cancelRequest(base, provider, base);
    assert.equal(result.accepted, false);
    assert.deepEqual(result.state, base);
  }
});

test("identity, generation, correlation, reason, and state mismatches fail closed", () => {
  for (const expected of [
    { userId: "user-b", generation: 1, correlationId: "correlation-a" },
    { userId: "user-a", generation: 2, correlationId: "correlation-a" },
    { userId: "user-a", generation: 1, correlationId: "correlation-b" },
  ]) assert.equal(cancelRequest(base, clearProvider, expected).accepted, false);
  assert.equal(cancelRequest(base, clearProvider, base, "FREE_TEXT").accepted, false);
  for (const state of [
    { ...base, status: "canonical_changed" as const, canonicalChanged: true },
    { ...base, status: "completed" as const, completed: true },
    { ...base, providerMutationStarted: false },
    { ...base, providerAccepted: false },
    { ...base, syncJobExists: true },
  ]) assert.equal(cancelRequest(state, clearProvider, state).accepted, false);
});

test("successful cancellation is auditable, idempotent, and never completed", () => {
  const first = cancelRequest(base, clearProvider, base);
  assert.equal(first.accepted, true);
  assert.equal(first.changed, true);
  assert.equal(first.state.status, "cancelled");
  assert.equal(first.state.completed, false);
  assert.equal(first.state.canonicalChanged, false);
  assert.equal(first.state.auditExists, true);
  const second = cancelRequest(first.state, clearProvider, base);
  assert.equal(second.accepted, true);
  assert.equal(second.changed, false);
  assert.deepEqual(second.state, first.state);
});

test("own-state and PostgREST boundary release only cancelled rows without an epoch", () => {
  const ownStateStart = migration.indexOf("create or replace function public.get_own_auth_email_change_state");
  const boundaryStart = migration.indexOf("create or replace function public.enforce_auth_email_change_session_boundary");
  const ownState = migration.slice(ownStateStart, boundaryStart);
  const boundary = migration.slice(boundaryStart);
  assert.match(ownState, /'requesting', 'confirmation_pending', 'status_unknown', 'manual_review'/);
  assert.doesNotMatch(ownState, /'requesting', 'confirmation_pending', 'status_unknown', 'manual_review', 'cancelled'/);
  assert.match(boundary, /request_status in \('request_failed', 'cancelled'\)[\s\S]*?change_epoch is null/);
  assert.match(boundary, /request_path = '\/rpc\/get_own_auth_email_change_state'/);
});
