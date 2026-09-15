import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AUTH_EMAIL_SYNC_MAX_ATTEMPTS } from "./emailSync.ts";

const migration = await readFile(
  new URL(
    "../../../supabase/migrations/20260908100000_add_auth_email_change_flow.sql",
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
  reconsiderationDue?: boolean;
  lastErrorCode?: string;
};

type SessionEvidence = {
  sessionId: string | null;
  sessionUserId?: string;
  sessionCreatedAt?: number;
  passwordAmrAt?: number;
};

type RaceStatus =
  | "requesting" | "request_failed" | "confirmation_pending"
  | "status_unknown" | "canonical_changed" | "completed" | "manual_review";
type RaceRequest = {
  generation: number;
  correlationId: string;
  status: RaceStatus;
  canonicalChangedAt: number | null;
  canonicalChangedGeneration: number | null;
  reservationExpiresAt?: number;
  providerMutationStartedAt?: number | null;
};

function reserveRequest(request: RaceRequest | null, now: number): RaceRequest | null {
  const reclaimable = request?.status === "requesting" &&
    request.providerMutationStartedAt == null &&
    request.canonicalChangedGeneration === null &&
    (request.reservationExpiresAt ?? Number.POSITIVE_INFINITY) <= now;
  if (request && !["request_failed", "completed"].includes(request.status) && !reclaimable) return null;
  return {
    generation: (request?.generation ?? 0) + 1,
    correlationId: `request-${(request?.generation ?? 0) + 1}`,
    status: "requesting",
    canonicalChangedAt: request?.canonicalChangedAt ?? null,
    canonicalChangedGeneration: null,
    reservationExpiresAt: now + 300,
    providerMutationStartedAt: null,
  };
}

function preProviderRecoveryAvailable(request: RaceRequest, now: number) {
  return request.status === "requesting" &&
    (request.reservationExpiresAt ?? Number.POSITIVE_INFINITY) <= now &&
    request.providerMutationStartedAt == null &&
    request.canonicalChangedGeneration === null;
}

function releaseBeforeProvider(
  request: RaceRequest,
  expected: { generation: number; correlationId: string }
) {
  if (request.generation !== expected.generation ||
    request.correlationId !== expected.correlationId ||
    request.status !== "requesting" || request.providerMutationStartedAt != null) {
    return { request, changed: false };
  }
  return {
    request: {
      ...request,
      status: request.canonicalChangedGeneration === null ? "request_failed" as const : "manual_review" as const,
    },
    changed: true,
  };
}

function markProviderMutationStarted(
  request: RaceRequest,
  expected: { generation: number; correlationId: string },
  now: number
) {
  if (request.generation !== expected.generation ||
    request.correlationId !== expected.correlationId ||
    request.status !== "requesting" || request.canonicalChangedGeneration !== null) {
    return { request, changed: false };
  }
  return {
    request: { ...request, providerMutationStartedAt: request.providerMutationStartedAt ?? now },
    changed: true,
  };
}

type MappingRow = {
  id: string;
  userId: string | null;
  stripeCustomerId: string | null;
};

type MappingState = {
  rows: MappingRow[];
  generation: number;
  requestGeneration: number | null;
};

type IdentityIndexCandidate = {
  targetColumn: "user_id" | "stripe_customer_id" | "email";
  unique: boolean;
  valid: boolean;
  ready: boolean;
  live: boolean;
  immediate: boolean;
  nullsDistinct: boolean;
  partial: boolean;
  expression: boolean;
  keyColumnCount: number;
  includeColumnCount: number;
};

function acceptsIdentityIndex(
  index: IdentityIndexCandidate,
  targetColumn: "user_id" | "stripe_customer_id"
) {
  return index.targetColumn === targetColumn &&
    index.unique && index.valid && index.ready && index.live &&
    index.immediate && index.nullsDistinct && !index.partial &&
    !index.expression && index.keyColumnCount === 1;
}

function mappingTransition(
  state: MappingState,
  previous: MappingRow | null,
  current: MappingRow,
  activeRequestGeneration: number | null = null
) {
  const valid = current.userId !== null && /^cus_[A-Za-z0-9]+$/.test(current.stripeCustomerId ?? "");
  const unchanged = previous?.userId === current.userId &&
    previous?.stripeCustomerId === current.stripeCustomerId;
  return valid && !unchanged
    ? { ...state, generation: state.generation + 1, requestGeneration: activeRequestGeneration }
    : state;
}

function establishMapping(state: MappingState, userId: string, stripeCustomerId: string) {
  const byUser = state.rows.find((row) => row.userId === userId);
  const byStripe = state.rows.find((row) => row.stripeCustomerId === stripeCustomerId);
  if (byUser && byStripe && byUser.id !== byStripe.id) throw new Error("conflict");
  if (byUser?.stripeCustomerId === stripeCustomerId) return { state, result: "existing" as const };
  if (byUser?.stripeCustomerId || (byStripe?.userId && byStripe.userId !== userId)) {
    throw new Error("conflict");
  }
  const previous = byUser ? { ...byUser } : byStripe ? { ...byStripe } : null;
  const current = byUser ?? byStripe ?? { id: `row-${state.rows.length + 1}`, userId: null, stripeCustomerId: null };
  current.userId = userId;
  current.stripeCustomerId = stripeCustomerId;
  if (!previous) state.rows.push(current);
  return { state: mappingTransition(state, previous, current), result: "established" as const };
}

function replaceMapping(
  state: MappingState,
  userId: string,
  expectedStripeCustomerId: string,
  newStripeCustomerId: string
) {
  const current = state.rows.find((row) => row.userId === userId);
  if (!current) throw new Error("missing");
  if (current.stripeCustomerId === newStripeCustomerId) return state;
  if (current.stripeCustomerId !== expectedStripeCustomerId) throw new Error("stale");
  if (state.rows.some((row) => row.id !== current.id && row.stripeCustomerId === newStripeCustomerId)) {
    throw new Error("conflict");
  }
  const previous = { ...current };
  current.stripeCustomerId = newStripeCustomerId;
  return mappingTransition(state, previous, current);
}

function establishInTransaction(
  state: MappingState,
  userId: string,
  stripeCustomerId: string,
  failAfterMapping: boolean
) {
  const draft: MappingState = {
    ...state,
    rows: state.rows.map((row) => ({ ...row })),
  };
  const result = establishMapping(draft, userId, stripeCustomerId);
  return failAfterMapping ? state : result.state;
}

function observeCanonicalChange(request: RaceRequest | null, at: number) {
  if (!request) {
    return {
      request: {
        generation: 1,
        correlationId: "generated",
        status: "manual_review" as const,
        canonicalChangedAt: at,
        canonicalChangedGeneration: null,
      },
      boundGeneration: null,
    };
  }
  const active = ["requesting", "confirmation_pending", "status_unknown"].includes(request.status);
  return {
    request: {
      ...request,
      status: active
        ? request.status === "requesting" ? "requesting" as const : "canonical_changed" as const
        : "manual_review" as const,
      canonicalChangedAt: Math.max(request.canonicalChangedAt ?? at, at),
      canonicalChangedGeneration: active ? request.generation : null,
    },
    boundGeneration: active ? request.generation : null,
  };
}

function applyProviderTransition(
  request: RaceRequest,
  expected: { generation: number; correlationId: string },
  transition: "accept" | "unknown" | "fail",
  syncCompleted = false
) {
  if (
    request.generation !== expected.generation ||
    request.correlationId !== expected.correlationId ||
    request.status !== "requesting"
  ) return { request, changed: false };
  const observed = request.canonicalChangedGeneration === request.generation;
  const status: RaceStatus = transition === "fail"
    ? observed ? "manual_review" : "request_failed"
    : observed
      ? syncCompleted ? "completed" : "canonical_changed"
      : transition === "accept" ? "confirmation_pending" : "status_unknown";
  return { request: { ...request, status }, changed: true };
}

function clearsEmailChangeBoundary(
  userId: string,
  canonicalChangedAt: number,
  evidence: SessionEvidence
) {
  return (
    evidence.sessionId !== null &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(evidence.sessionId) &&
    evidence.sessionUserId === userId &&
    typeof evidence.sessionCreatedAt === "number" &&
    evidence.sessionCreatedAt > canonicalChangedAt &&
    typeof evidence.passwordAmrAt === "number" &&
    evidence.passwordAmrAt > canonicalChangedAt
  );
}

function claimAfterLeaseExpiry(state: ClaimState) {
  if (state.status === "manual_review") {
    if (!state.reconsiderationDue) return { state, claimed: false };
    return {
      state: {
        ...state,
        attemptCount: 1,
        status: "processing" as const,
        leaseExpired: false,
        reconsiderationDue: false,
      },
      claimed: true,
    };
  }

  if (state.status === "processing" && !state.leaseExpired) {
    return { state, claimed: false };
  }

  if (state.attemptCount >= AUTH_EMAIL_SYNC_MAX_ATTEMPTS) {
    return {
      state: {
        ...state,
        status: "manual_review" as const,
        leaseExpired: false,
        reconsiderationDue: false,
        lastErrorCode: "WORKER_ATTEMPTS_EXHAUSTED",
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
  assert.match(migration, /last_retry_exhausted_generation bigint/);
  assert.match(migration, /last_retry_exhausted_at timestamptz/);
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
    migration.match(/create function public\.enqueue_auth_email_sync_from_auth_user\(\)[\s\S]*?\$\$;/)?.[0] ?? "",
    /customers|stripe/i
  );
});

test("the synchronous trigger rollback contract requires a real pre-live database test", () => {
  const triggerFunction =
    migration.match(
      /create function public\.enqueue_auth_email_sync_from_auth_user\(\)[\s\S]*?\$\$;/
    )?.[0] ?? "";
  assert.match(triggerFunction, /insert into public\.auth_email_sync_jobs/);
  assert.doesNotMatch(triggerFunction, /exception\s+when|customers|stripe/i);
  assert.match(identityHandbook, /synchroon onderdeel van dezelfde\s+Auth-databasetransactie/);
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
    "ensure_auth_email_reconciliation",
    "claim_auth_email_sync_jobs",
    "is_auth_email_sync_lease_current",
    "establish_customer_mapping",
    "replace_customer_mapping_if_current",
    "sync_auth_email_local_if_current",
    "complete_auth_email_sync_verification",
    "complete_auth_email_sync_job",
    "fail_auth_email_sync_job",
  ];

  for (const name of functions) {
    const start = migration.indexOf(`create function public.${name}`);
    const next = migration.indexOf("create function public.", start + 1);
    const source = migration.slice(start, next === -1 ? migration.length : next);
    assert.notEqual(start, -1, `${name} must exist`);
    assert.match(source, /security definer/);
    assert.match(source, /set search_path = ''/);
    assert.match(source, /auth\.jwt\(\) ->> 'role'/);
    assert.match(source, /caller_role is distinct from 'service_role'/);
    assert.match(source, /errcode = '42501'/);
    assert.match(source, /owner to postgres/);
    assert.match(source, /from public, anon, authenticated/);
    assert.match(source, /to service_role/);
  }
});

test("claiming is bounded, concurrent-safe, and recovers expired leases", () => {
  assert.match(migration, /for update skip locked/);
  assert.match(migration, /limit least\(greatest\(p_limit, 1\), 50\)/);
  assert.match(migration, /j\.status = 'processing'[\s\S]*?j\.lease_expires_at <= pg_catalog\.now\(\)/);
  assert.match(migration, /pg_catalog\.gen_random_uuid\(\)/);
  assert.match(migration, /greatest\(p_lease_seconds, 30\)/);
  assert.match(
    migration,
    new RegExp(
      `with exhausted_candidates as \\(\\s*select j\\.user_id[\\s\\S]*?where j\\.attempt_count >= ${AUTH_EMAIL_SYNC_MAX_ATTEMPTS}[\\s\\S]*?for update skip locked[\\s\\S]*?limit least\\(greatest\\(p_limit, 1\\), 50\\)[\\s\\S]*?status = 'manual_review'[\\s\\S]*?last_error_code = 'WORKER_ATTEMPTS_EXHAUSTED'`
    )
  );
  assert.match(
    migration,
    new RegExp(
      `from public\\.auth_email_sync_jobs j[\\s\\S]*?j\\.attempt_count < ${AUTH_EMAIL_SYNC_MAX_ATTEMPTS}[\\s\\S]*?for update skip locked`
    )
  );
});

test("local customer synchronization and its generation marker are one fenced transaction", () => {
  const start = migration.indexOf(
    "create function public.sync_auth_email_local_if_current"
  );
  const end = migration.indexOf(
    "create function public.complete_auth_email_sync_verification",
    start
  );
  const source = migration.slice(start, end);

  assert.ok(start >= 0 && end > start);
  assert.match(source, /p_generation bigint/);
  assert.match(source, /p_lease_token uuid/);
  assert.doesNotMatch(source, /p_email|p_new_email/);
  assert.match(source, /from public\.auth_email_sync_jobs j[\s\S]*?for update/);
  assert.match(source, /j\.generation = p_generation/);
  assert.match(source, /j\.lease_token = p_lease_token/);
  assert.match(source, /j\.lease_expires_at > pg_catalog\.now\(\)/);
  assert.match(source, /select u\.email[\s\S]*?from auth\.users u/);
  assert.match(source, /update public\.customers c[\s\S]*?set email = canonical_email/);
  assert.match(source, /local_synced_generation = p_generation/);
});

test("completed mapped jobs are periodically verified without generation storms", () => {
  const claimStart = migration.indexOf(
    "create function public.claim_auth_email_sync_jobs"
  );
  const claimEnd = migration.indexOf(
    "create function public.is_auth_email_sync_lease_current",
    claimStart
  );
  const claim = migration.slice(claimStart, claimEnd);
  const ensureStart = migration.indexOf(
    "create function public.ensure_auth_email_reconciliation"
  );
  const ensureEnd = migration.indexOf(
    "create function public.claim_auth_email_sync_jobs",
    ensureStart
  );
  const ensure = migration.slice(ensureStart, ensureEnd);

  assert.match(migration, /work_kind text not null default 'sync'/);
  assert.match(claim, /j\.work_kind = 'verify'/);
  assert.match(claim, /j\.work_kind = 'verify' and j\.status = 'completed'/);
  assert.match(claim, /or j\.status = 'manual_review'/);
  assert.match(claim, /for update skip locked/);
  assert.match(ensure, /for update/);
  assert.match(ensure, /current_job\.generation > p_observed_generation/);
  assert.match(ensure, /current_job\.status in \('pending', 'processing', 'retryable_failed'\)/);
  assert.match(ensure, /request_generation = null/);
  assert.match(ensure, /generation = j\.generation \+ 1/);
});

test("repeated lease expiry escalates but remains eligible for bounded reconsideration", () => {
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
  assert.equal(exhausted.state.lastErrorCode, "WORKER_ATTEMPTS_EXHAUSTED");

  const beforeDue = claimAfterLeaseExpiry(exhausted.state);
  assert.equal(beforeDue.claimed, false);

  const reconsidered = claimAfterLeaseExpiry({
    ...exhausted.state,
    reconsiderationDue: true,
  });
  assert.equal(reconsidered.claimed, true);
  assert.equal(reconsidered.state.status, "processing");
  assert.equal(reconsidered.state.attemptCount, 1);
  assert.equal(
    reconsidered.state.lastErrorCode,
    "WORKER_ATTEMPTS_EXHAUSTED"
  );
});

test("manual-review sync work is periodically reclaimable without losing escalation evidence", () => {
  const claimStart = migration.indexOf(
    "create function public.claim_auth_email_sync_jobs"
  );
  const claimEnd = migration.indexOf(
    "create function public.is_auth_email_sync_lease_current",
    claimStart
  );
  const claim = migration.slice(claimStart, claimEnd);
  const failStart = migration.indexOf(
    "create function public.fail_auth_email_sync_job"
  );
  const failSource = migration.slice(failStart);

  assert.match(claim, /or j\.status = 'manual_review'/);
  assert.match(claim, /j\.next_attempt_at <= pg_catalog\.now\(\)/);
  assert.match(claim, /when c\.previous_status = 'manual_review'[\s\S]*?then 1/);
  assert.doesNotMatch(
    claim,
    /set[\s\S]*?last_error_code = null/
  );
  assert.match(claim, /last_retry_exhausted_generation = j\.generation/);
  assert.match(claim, /last_retry_exhausted_at = pg_catalog\.now\(\)/);
  assert.match(
    failSource,
    /else pg_catalog\.now\(\) \+ pg_catalog\.make_interval\(secs => 86400\)/
  );
  assert.match(
    failSource,
    /when p_error_code ~ '_RETRY_EXHAUSTED\$' then j\.generation/
  );
  assert.doesNotMatch(
    failSource,
    /last_retry_exhausted_(?:generation|at) = null/
  );
});

test("exhausted-job maintenance is deterministic, bounded, and skip-locked", () => {
  const claimStart = migration.indexOf(
    "create function public.claim_auth_email_sync_jobs"
  );
  const claimEnd = migration.indexOf(
    "create function public.is_auth_email_sync_lease_current",
    claimStart
  );
  const claim = migration.slice(claimStart, claimEnd);
  const maintenance = claim.match(
    /with exhausted_candidates as \([\s\S]*?where j\.user_id = c\.user_id;/
  )?.[0] ?? "";

  assert.match(maintenance, /order by j\.next_attempt_at, j\.updated_at, j\.user_id/);
  assert.match(maintenance, /for update skip locked/);
  assert.match(maintenance, /limit least\(greatest\(p_limit, 1\), 50\)/);
  assert.match(maintenance, /from exhausted_candidates c/);
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
    "sync_auth_email_local_if_current",
    "complete_auth_email_sync_verification",
    "complete_auth_email_sync_job",
    "fail_auth_email_sync_job",
  ]) {
    const start = migration.indexOf(`create function public.${name}`);
    const next = migration.indexOf("create function public.", start + 1);
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
    /insert into public\.auth_email_sync_jobs \(user_id\)\s+select c\.user_id\s+from public\.customers c\s+join auth\.users u on u\.id = c\.user_id\s+where c\.user_id is not null\s+and c\.stripe_customer_id is not null\s+and c\.stripe_customer_id ~ '\^cus_\[A-Za-z0-9\]\+\$'\s+on conflict \(user_id\) do nothing;/
  );
});

test("late valid mappings reopen completed no-local work exactly once", () => {
  const state: MappingState = {
    rows: [],
    generation: 1,
    requestGeneration: null,
  };
  const established = establishMapping(state, "user-a", "cus_A");
  assert.equal(established.result, "established");
  assert.equal(established.state.generation, 2);
  assert.equal(established.state.requestGeneration, null);

  const replay = establishMapping(established.state, "user-a", "cus_A");
  assert.equal(replay.result, "existing");
  assert.equal(replay.state.generation, 2);
});

test("concurrent route and webhook establishment converges without a generation storm", () => {
  const state: MappingState = { rows: [], generation: 0, requestGeneration: null };
  const route = establishMapping(state, "user-a", "cus_A");
  const webhook = establishMapping(route.state, "user-a", "cus_A");
  assert.equal(route.result, "established");
  assert.equal(webhook.result, "existing");
  assert.equal(webhook.state.generation, 1);
  assert.equal(webhook.state.rows.length, 1);
});

test("incomplete placeholders and user rows can become valid but conflicts fail closed", () => {
  const placeholder: MappingState = {
    rows: [{ id: "placeholder", userId: null, stripeCustomerId: "cus_A" }],
    generation: 0,
    requestGeneration: null,
  };
  assert.equal(establishMapping(placeholder, "user-a", "cus_A").state.generation, 1);

  const incompleteUser: MappingState = {
    rows: [{ id: "user-row", userId: "user-b", stripeCustomerId: null }],
    generation: 0,
    requestGeneration: null,
  };
  assert.equal(establishMapping(incompleteUser, "user-b", "cus_B").state.generation, 1);

  assert.throws(() => establishMapping(incompleteUser, "user-b", "cus_C"), /conflict/);
  assert.throws(() => establishMapping(placeholder, "user-c", "cus_A"), /conflict/);
});

test("authorized CAS replacement advances once and stale S1 cannot replace S2", () => {
  const state: MappingState = {
    rows: [{ id: "row", userId: "user-a", stripeCustomerId: "cus_S1" }],
    generation: 1,
    requestGeneration: null,
  };
  const replaced = replaceMapping(state, "user-a", "cus_S1", "cus_S2");
  assert.equal(replaced.generation, 2);
  assert.equal(replaced.rows[0].stripeCustomerId, "cus_S2");
  assert.throws(() => establishMapping(replaced, "user-a", "cus_S1"), /conflict/);
  assert.equal(replaced.rows[0].stripeCustomerId, "cus_S2");
});

test("mapping trigger binds only genuine unresolved canonical-change generations", () => {
  const base: MappingState = { rows: [], generation: 4, requestGeneration: null };
  const row: MappingRow = { id: "row", userId: "user-a", stripeCustomerId: "cus_A" };
  assert.equal(mappingTransition(base, null, row, 9).requestGeneration, 9);
  assert.equal(mappingTransition(base, null, row, null).requestGeneration, null);

  const triggerStart = migration.indexOf("create function public.enqueue_auth_email_sync_from_customer_mapping");
  const triggerEnd = migration.indexOf("create function public.establish_customer_mapping", triggerStart);
  const source = migration.slice(triggerStart, triggerEnd);
  assert.match(source, /canonical_changed_at is not null/);
  assert.match(source, /canonical_changed_generation = r\.generation/);
  assert.match(source, /'requesting'[\s\S]*?'confirmation_pending'[\s\S]*?'status_unknown'[\s\S]*?'canonical_changed'/);
  assert.match(source, /request_generation = active_request_generation/);
});

test("mapping RPCs and trigger are service-role hardened and accept no email", () => {
  for (const [name, signature] of [
    ["establish_customer_mapping", "uuid, text"],
    ["replace_customer_mapping_if_current", "uuid, text, text"],
  ] as const) {
    const start = migration.indexOf(`create function public.${name}`);
    const end = migration.indexOf("create function public.", start + 1);
    const source = migration.slice(start, end);
    assert.doesNotMatch(source, /p_email|p_new_email|canonical_email/);
    assert.match(source, /security definer/);
    assert.match(source, /set search_path = ''/);
    assert.match(source, /auth\.jwt\(\) ->> 'role'/);
    assert.match(source, /caller_role is distinct from 'service_role'/);
    assert.match(source, /from auth\.users u where u\.id = p_user_id/);
    assert.match(source, new RegExp(`alter function public\\.${name}\\(${signature}\\)\\s+owner to postgres`));
    assert.match(source, /from public, anon, authenticated/);
    assert.match(source, /to service_role/);
  }

  assert.match(migration, /after insert or update of user_id, stripe_customer_id\s+on public\.customers/);
  assert.match(migration, /revoke all\s+on function public\.enqueue_auth_email_sync_from_customer_mapping\(\)\s+from public, anon, authenticated, service_role/);
});

test("mapping, Auth trigger, and local worker use a common per-user lock order", () => {
  for (const name of [
    "enqueue_auth_email_sync_from_auth_user",
    "enqueue_auth_email_sync_from_customer_mapping",
    "establish_customer_mapping",
    "replace_customer_mapping_if_current",
    "sync_auth_email_local_if_current",
  ]) {
    const start = migration.indexOf(`create function public.${name}`);
    const end = migration.indexOf("create function public.", start + 1);
    const source = migration.slice(start, end);
    assert.match(source, /pg_advisory_xact_lock/);
    assert.match(source, /customer-user:/);
  }
});

test("mapping transaction and reconciliation obligation remain atomically coupled", () => {
  const triggerStart = migration.indexOf("create function public.enqueue_auth_email_sync_from_customer_mapping");
  const triggerEnd = migration.indexOf("create function public.establish_customer_mapping", triggerStart);
  const triggerSource = migration.slice(triggerStart, triggerEnd);
  assert.match(triggerSource, /insert into public\.auth_email_sync_jobs/);
  assert.doesNotMatch(triggerSource, /exception\s+when/);
  assert.match(identityHandbook, /Dezelfde databasetransactie opent via een\s+mappingtrigger/);
  assert.match(identityHandbook, /no_local_billing_relation/);

  const before: MappingState = { rows: [], generation: 7, requestGeneration: null };
  const rolledBack = establishInTransaction(before, "user-a", "cus_A", true);
  assert.deepEqual(rolledBack, before);
  const committed = establishInTransaction(before, "user-a", "cus_A", false);
  assert.equal(committed.rows.length, 1);
  assert.equal(committed.generation, 8);
});

test("real mapping transitions supersede active leases and exhausted work", () => {
  const start = migration.indexOf("create function public.enqueue_auth_email_sync_from_customer_mapping");
  const end = migration.indexOf("create function public.establish_customer_mapping", start);
  const source = migration.slice(start, end);
  assert.match(source, /generation = public\.auth_email_sync_jobs\.generation \+ 1/);
  assert.match(source, /status = 'pending'/);
  assert.match(source, /work_kind = 'sync'/);
  assert.match(source, /attempt_count = 0/);
  assert.match(source, /lease_token = null/);
  assert.match(source, /lease_expires_at = null/);
  assert.match(source, /completion_reason = null/);
  assert.match(source, /last_error_code = null/);
});

test("customer mapping installation fails closed without exact uniqueness and collisions", () => {
  const preconditions = migration.match(/do \$preconditions\$[\s\S]*?\$preconditions\$;/)?.[0] ?? "";
  assert.match(preconditions, /c\.column_name = 'user_id'[\s\S]*?c\.data_type = 'uuid'/);
  assert.match(preconditions, /c\.column_name = 'stripe_customer_id'[\s\S]*?c\.data_type in \('text', 'character varying'\)/);
  assert.match(preconditions, /i\.indisunique/);
  assert.equal((preconditions.match(/and i\.indisvalid/g) ?? []).length, 2);
  assert.equal((preconditions.match(/and i\.indisready/g) ?? []).length, 2);
  assert.equal((preconditions.match(/and i\.indislive/g) ?? []).length, 2);
  assert.equal((preconditions.match(/and i\.indimmediate/g) ?? []).length, 2);
  assert.equal((preconditions.match(/and not i\.indnullsnotdistinct/g) ?? []).length, 2);
  assert.match(preconditions, /i\.indpred is null/);
  assert.match(preconditions, /i\.indexprs is null/);
  assert.match(preconditions, /i\.indnkeyatts = 1/);
  assert.doesNotMatch(preconditions, /i\.indnatts = 1/);
  assert.doesNotMatch(preconditions, /join pg_catalog\.pg_constraint/);
  assert.match(preconditions, /Required unique customer mapping constraints are missing/);
  for (const name of [
    "establish_customer_mapping",
    "replace_customer_mapping_if_current",
    "enqueue_auth_email_sync_from_customer_mapping",
  ]) {
    assert.match(preconditions, new RegExp(`'${name}'`));
  }
  assert.match(preconditions, /enqueue_auth_email_sync_after_customer_mapping/);
});

test("identity uniqueness accepts valid enforcing standalone and INCLUDE indexes", () => {
  const valid: IdentityIndexCandidate = {
    targetColumn: "user_id",
    unique: true,
    valid: true,
    ready: true,
    live: true,
    immediate: true,
    nullsDistinct: true,
    partial: false,
    expression: false,
    keyColumnCount: 1,
    includeColumnCount: 0,
  };

  assert.equal(acceptsIdentityIndex(valid, "user_id"), true);
  assert.equal(acceptsIdentityIndex({
    ...valid,
    targetColumn: "stripe_customer_id",
  }, "stripe_customer_id"), true);
  assert.equal(acceptsIdentityIndex({ ...valid, includeColumnCount: 2 }, "user_id"), true);
});

test("identity uniqueness rejects invalid, non-ready, non-live, or deferred indexes", () => {
  const valid: IdentityIndexCandidate = {
    targetColumn: "user_id",
    unique: true,
    valid: true,
    ready: true,
    live: true,
    immediate: true,
    nullsDistinct: true,
    partial: false,
    expression: false,
    keyColumnCount: 1,
    includeColumnCount: 0,
  };

  for (const rejected of [
    { ...valid, valid: false },
    { ...valid, ready: false },
    { ...valid, live: false },
    { ...valid, immediate: false },
  ]) {
    assert.equal(acceptsIdentityIndex(rejected, "user_id"), false);
  }
});

test("identity uniqueness rejects partial, expression, composite, wrong-column, and non-unique substitutes", () => {
  const valid: IdentityIndexCandidate = {
    targetColumn: "user_id",
    unique: true,
    valid: true,
    ready: true,
    live: true,
    immediate: true,
    nullsDistinct: true,
    partial: false,
    expression: false,
    keyColumnCount: 1,
    includeColumnCount: 0,
  };

  for (const rejected of [
    { ...valid, partial: true },
    { ...valid, expression: true },
    { ...valid, keyColumnCount: 2 },
    { ...valid, targetColumn: "email" as const },
    { ...valid, unique: false },
    { ...valid, nullsDistinct: false },
  ]) {
    assert.equal(acceptsIdentityIndex(rejected, "user_id"), false);
  }
});

test("failed identity preconditions precede every IR-05 installation and historical seed", () => {
  const preconditionsEnd = migration.indexOf("$preconditions$;");
  for (const marker of [
    "create function public.enqueue_auth_email_sync_from_customer_mapping",
    "create function public.establish_customer_mapping",
    "create function public.replace_customer_mapping_if_current",
    "-- Seed only complete historical mappings",
  ]) {
    assert.ok(preconditionsEnd >= 0 && migration.indexOf(marker) > preconditionsEnd);
  }
  assert.match(migration, /^--[\s\S]*?\nbegin;/);
  assert.match(migration, /\ncommit;\s*$/);
});

test("error persistence accepts only sanitized non-PII codes", () => {
  assert.match(
    migration,
    /p_error_code !~ '\^\[A-Z0-9_\]\{1,64\}\$'/
  );
  assert.doesNotMatch(migration, /last_error_message|error_detail|provider_payload/);
});

test("migration is transactional, collision-safe, null-safe, and avoids qualified SQL special forms", () => {
  assert.match(migration, /^--[\s\S]*?\nbegin;/);
  assert.match(migration, /do \$preconditions\$[\s\S]*?Unexpected protected function collision/);
  assert.match(migration, /Unexpected protected relation collision/);
  assert.match(migration, /caller_role is distinct from 'service_role'/);
  assert.doesNotMatch(migration, /pg_catalog\.(?:least|greatest|coalesce)\s*\(/);
  assert.match(migration, /set search_path = ''/);
  assert.match(migration, /\ncommit;\s*$/);
});

test("request state is email-free and bound to the canonical trigger generation", () => {
  const requestTable = migration.match(/create table public\.auth_email_change_requests \([\s\S]*?\n\);/)?.[0] ?? "";
  assert.doesNotMatch(requestTable, /old_email|new_email|destination_email|password|token/i);
  assert.match(migration, /then 'canonical_changed'/);
  assert.match(migration, /request_generation = excluded\.request_generation/);
  assert.match(migration, /j\.request_generation = r\.generation/);
  assert.match(migration, /get_own_auth_email_change_state/);
  assert.doesNotMatch(migration, /acknowledge_auth_email_change_reauthentication/);
  assert.doesNotMatch(requestTable, /reauthenticated|reauthenticated_at/);
  assert.match(requestTable, /reservation_expires_at timestamptz/);
  assert.match(requestTable, /provider_mutation_started_at timestamptz/);
});

test("pre-provider reservations expire narrowly and reclaim with fresh fencing", () => {
  const g1 = reserveRequest(null, 100)!;
  assert.equal(g1.generation, 1);
  assert.equal(reserveRequest(g1, 399), null);
  const g2 = reserveRequest(g1, 400)!;
  assert.equal(g2.generation, 2);
  assert.notEqual(g2.correlationId, g1.correlationId);
  assert.equal(reserveRequest(g2, 400), null);
  assert.equal(releaseBeforeProvider(g2, { generation: 1, correlationId: g1.correlationId }).changed, false);
  assert.equal(markProviderMutationStarted(g2, { generation: 1, correlationId: g1.correlationId }, 401).changed, false);

  const started = markProviderMutationStarted(g1, { generation: 1, correlationId: g1.correlationId }, 200).request;
  assert.equal(reserveRequest(started, 1000), null);
  assert.equal(releaseBeforeProvider(started, { generation: 1, correlationId: g1.correlationId }).changed, false);

  const canonical = { ...g1, canonicalChangedAt: 250, canonicalChangedGeneration: 1 };
  assert.equal(reserveRequest(canonical, 1000), null);
  assert.equal(releaseBeforeProvider(canonical, { generation: 1, correlationId: g1.correlationId }).request.status, "manual_review");
});

test("own-state recovery is server-derived only for expired unstarted unbound requesting", () => {
  const expired = reserveRequest(null, 100)!;
  assert.equal(preProviderRecoveryAvailable(expired, 400), true);
  assert.equal(preProviderRecoveryAvailable(expired, 399), false);
  assert.equal(preProviderRecoveryAvailable({ ...expired, providerMutationStartedAt: 200 }, 400), false);
  assert.equal(preProviderRecoveryAvailable({ ...expired, canonicalChangedGeneration: 1 }, 400), false);
  for (const status of ["status_unknown", "confirmation_pending", "manual_review", "request_failed", "completed"] as const) {
    assert.equal(preProviderRecoveryAvailable({ ...expired, status }, 400), false, status);
  }

  const ownStateStart = migration.indexOf("create function public.get_own_auth_email_change_state");
  const ownStateEnd = migration.indexOf("create function public.enforce_auth_email_change_session_boundary");
  const ownState = migration.slice(ownStateStart, ownStateEnd);
  assert.match(ownState, /pre_provider_recovery_available boolean/);
  assert.match(ownState, /request_record\.status = 'requesting'[\s\S]*?reservation_expires_at <= now\(\)[\s\S]*?provider_mutation_started_at is null[\s\S]*?canonical_changed_generation is null/);
  assert.doesNotMatch(ownState, /p_(?:recovery|expired|started)|correlation_id|old_email|new_email/);

  const boundaryStart = migration.indexOf("create function public.enforce_auth_email_change_session_boundary");
  const boundary = migration.slice(boundaryStart);
  assert.match(boundary, /request_status in \([\s\S]*?'requesting'[\s\S]*?'status_unknown'[\s\S]*?'manual_review'/);
  assert.doesNotMatch(boundary, /pre_provider_recovery_available/);
});

test("migration fences release, marker, reclamation, and all post-marker transitions", () => {
  const beginStart = migration.indexOf("create function public.begin_auth_email_change_request");
  const releaseStart = migration.indexOf("create function public.release_auth_email_change_before_provider");
  const markerStart = migration.indexOf("create function public.mark_auth_email_change_provider_mutation_started");
  const acceptStart = migration.indexOf("create function public.accept_auth_email_change_request");
  const begin = migration.slice(beginStart, releaseStart);
  const release = migration.slice(releaseStart, markerStart);
  const marker = migration.slice(markerStart, acceptStart);

  assert.match(begin, /interval '5 minutes'/);
  assert.match(begin, /status = 'requesting'[\s\S]*?provider_mutation_started_at is null[\s\S]*?canonical_changed_generation is null[\s\S]*?reservation_expires_at <= now\(\)/);
  assert.match(begin, /generation = public\.auth_email_change_requests\.generation \+ 1/);
  assert.match(begin, /correlation_id = pg_catalog\.gen_random_uuid\(\)/);
  for (const source of [release, marker]) {
    assert.match(source, /r\.generation = p_generation/);
    assert.match(source, /r\.correlation_id = p_correlation_id/);
    assert.match(source, /r\.status = 'requesting'/);
    assert.match(source, /security definer/);
    assert.match(source, /set search_path = ''/);
    assert.match(source, /caller_role is distinct from 'service_role'/);
    assert.match(source, /owner to postgres/);
    assert.match(source, /from public, anon, authenticated/);
    assert.match(source, /to service_role/);
  }
  assert.match(release, /r\.provider_mutation_started_at is null/);
  assert.match(release, /status = 'manual_review'/);
  assert.match(marker, /provider_mutation_started_at = coalesce\(r\.provider_mutation_started_at, now\(\)\)/);
  assert.match(marker, /r\.canonical_changed_generation is null/);

  for (const name of ["accept_auth_email_change_request", "fail_auth_email_change_request", "mark_auth_email_change_status_unknown"]) {
    const start = migration.indexOf(`create function public.${name}`);
    const end = migration.indexOf("create function public.", start + 1);
    assert.match(migration.slice(start, end), /provider_mutation_started_at is not null|mutation_started_at is null/);
  }
});

test("early canonical observation converges monotonically after late accept or ambiguity", () => {
  const initial: RaceRequest = {
    generation: 4,
    correlationId: "request-4",
    status: "requesting",
    canonicalChangedAt: 100,
    canonicalChangedGeneration: null,
  };
  const observed = observeCanonicalChange(initial, 200);
  assert.equal(observed.boundGeneration, 4);
  assert.equal(observed.request.status, "requesting");
  assert.equal(observed.request.canonicalChangedGeneration, 4);
  assert.equal(
    applyProviderTransition(observed.request, {
      generation: 4, correlationId: "request-4",
    }, "accept").request.status,
    "canonical_changed"
  );
  assert.equal(
    applyProviderTransition(observed.request, {
      generation: 4, correlationId: "request-4",
    }, "unknown").request.status,
    "canonical_changed"
  );
  assert.equal(
    applyProviderTransition(observed.request, {
      generation: 4, correlationId: "request-4",
    }, "accept", true).request.status,
    "completed"
  );
});

test("generation and correlation CAS prevent stale handlers from mutating a replacement", () => {
  const replacement: RaceRequest = {
    generation: 5,
    correlationId: "request-5",
    status: "requesting",
    canonicalChangedAt: 200,
    canonicalChangedGeneration: null,
  };
  for (const expected of [
    { generation: 4, correlationId: "request-4" },
    { generation: 5, correlationId: "request-4" },
  ]) {
    const result = applyProviderTransition(replacement, expected, "accept");
    assert.equal(result.changed, false);
    assert.deepEqual(result.request, replacement);
  }
});

test("normal, unrelated, and failed canonical-change paths remain fail closed", () => {
  const pending: RaceRequest = {
    generation: 6,
    correlationId: "request-6",
    status: "confirmation_pending",
    canonicalChangedAt: 200,
    canonicalChangedGeneration: null,
  };
  assert.equal(observeCanonicalChange(pending, 300).request.status, "canonical_changed");

  const unrelated = observeCanonicalChange(null, 300);
  assert.equal(unrelated.boundGeneration, null);
  assert.equal(unrelated.request.status, "manual_review");

  const requesting = observeCanonicalChange({ ...pending, status: "requesting" }, 300);
  assert.equal(
    applyProviderTransition(requesting.request, {
      generation: 6, correlationId: "request-6",
    }, "fail").request.status,
    "manual_review"
  );
});

test("migration keeps the security epoch durable and binds transitions explicitly", () => {
  const beginStart = migration.indexOf("create function public.begin_auth_email_change_request");
  const acceptStart = migration.indexOf("create function public.accept_auth_email_change_request");
  const beginSource = migration.slice(beginStart, acceptStart);
  const triggerStart = migration.indexOf("create function public.enqueue_auth_email_sync_from_auth_user");
  const triggerEnd = migration.indexOf("alter function public.enqueue_auth_email_sync_from_auth_user", triggerStart);
  const triggerSource = migration.slice(triggerStart, triggerEnd);

  assert.match(beginSource, /returns table \(generation bigint, correlation_id uuid\)/);
  assert.match(beginSource, /canonical_changed_generation = null/);
  assert.doesNotMatch(beginSource, /canonical_changed_at = null/);
  for (const name of [
    "accept_auth_email_change_request",
    "fail_auth_email_change_request",
    "mark_auth_email_change_status_unknown",
  ]) {
    const start = migration.indexOf(`create function public.${name}`);
    const end = migration.indexOf("create function public.", start + 1);
    const source = migration.slice(start, end);
    assert.match(source, /p_generation bigint/);
    assert.match(source, /p_correlation_id uuid/);
    assert.match(source, /r\.generation = p_generation/);
    assert.match(source, /r\.correlation_id = p_correlation_id/);
  }
  assert.match(triggerSource, /canonical_changed_generation/);
  assert.match(triggerSource, /active_request_generation/);
  assert.match(triggerSource, /'requesting', 'confirmation_pending', 'status_unknown'/);
  assert.match(triggerSource, /old\.email is distinct from new\.email/);
});

test("current-session clearance uses server-owned session and password AMR evidence", () => {
  const start = migration.indexOf(
    "create function public.is_current_auth_email_change_session_cleared"
  );
  const end = migration.indexOf(
    "create function public.get_own_auth_email_change_state",
    start
  );
  const source = migration.slice(start, end);

  assert.ok(start >= 0 && end > start);
  assert.match(source, /claim ->> 'session_id'/);
  assert.match(source, /session_id_text !~\*/);
  assert.match(source, /from auth\.sessions session_record/);
  assert.match(source, /session_record\.user_id = caller_id/);
  assert.match(source, /session_record\.created_at > p_canonical_changed_at/);
  assert.match(source, /from auth\.mfa_amr_claims amr_record/);
  assert.match(source, /amr_record\.session_id = session_record\.id/);
  assert.match(source, /amr_record\.authentication_method = 'password'/);
  assert.match(source, /amr_record\.updated_at > p_canonical_changed_at/);
  assert.doesNotMatch(source, /\biat\b|last_sign_in_at/);
});

test("old, refreshed, malformed, missing, and cross-user sessions fail closed", () => {
  const userId = "11111111-1111-4111-8111-111111111111";
  const sessionId = "22222222-2222-4222-8222-222222222222";
  const changedAt = 200;

  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId,
    sessionUserId: userId,
    sessionCreatedAt: 100,
    passwordAmrAt: 100,
  }), false);
  // A refreshed token may have a new iat, but the server-owned session times
  // remain unchanged and therefore still fail.
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId,
    sessionUserId: userId,
    sessionCreatedAt: 100,
    passwordAmrAt: 100,
  }), false);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId: null,
  }), false);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId: "malformed",
    sessionUserId: userId,
    sessionCreatedAt: 300,
    passwordAmrAt: 300,
  }), false);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId,
    sessionUserId: "33333333-3333-4333-8333-333333333333",
    sessionCreatedAt: 300,
    passwordAmrAt: 300,
  }), false);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId,
    sessionUserId: userId,
    sessionCreatedAt: 300,
  }), false);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, {
    sessionId,
    sessionUserId: userId,
    sessionCreatedAt: 300,
    passwordAmrAt: 200,
  }), false);
});

test("only each genuinely new post-change password session clears itself", () => {
  const userId = "11111111-1111-4111-8111-111111111111";
  const changedAt = 200;
  const freshA = {
    sessionId: "22222222-2222-4222-8222-222222222222",
    sessionUserId: userId,
    sessionCreatedAt: 201,
    passwordAmrAt: 201,
  };
  const staleB = {
    sessionId: "33333333-3333-4333-8333-333333333333",
    sessionUserId: userId,
    sessionCreatedAt: 100,
    passwordAmrAt: 100,
  };

  assert.equal(clearsEmailChangeBoundary(userId, changedAt, freshA), true);
  assert.equal(clearsEmailChangeBoundary(userId, changedAt, staleB), false);
});

test("downstream sync completion cannot grant authentication clearance", () => {
  const start = migration.indexOf(
    "create function public.complete_auth_email_sync_job"
  );
  const end = migration.indexOf(
    "create function public.fail_auth_email_sync_job",
    start
  );
  const source = migration.slice(start, end);

  assert.match(source, /set status = 'completed'/);
  assert.match(source, /r\.status = 'canonical_changed'/);
  assert.doesNotMatch(source, /reauthenticated|reauthenticated_at/);
  assert.doesNotMatch(source, /canonical_changed_at\s*=\s*null/);
  assert.doesNotMatch(source, /is_current_auth_email_change_session_cleared/);
});

test("PostgREST pre-request enforcement covers Data API and RPC with one read-only exception", () => {
  const start = migration.indexOf(
    "create function public.enforce_auth_email_change_session_boundary"
  );
  const end = migration.indexOf(
    "create table public.auth_email_sync_jobs",
    start
  );
  const source = migration.slice(start, end);

  assert.match(source, /current_setting\('request\.path', true\)/);
  assert.match(source, /request_path = '\/rpc\/get_own_auth_email_change_state'/);
  assert.doesNotMatch(source, /request_path = 'rpc\/get_own_auth_email_change_state'/);
  assert.match(source, /EMAIL_CHANGE_REAUTH_REQUIRED/);
  assert.match(source, /AUTH_STATE_UNAVAILABLE/);
  assert.match(migration, /pgrst\.db_pre_request = %L/);
  assert.match(migration, /public\.enforce_auth_email_change_session_boundary/);
  assert.match(migration, /notify pgrst, 'reload config'/);
  assert.match(migration, /left join pg_catalog\.pg_roles role_record/);
  assert.match(migration, /role_record\.rolname = 'authenticator'/);
  assert.match(migration, /setting\.setrole = 0[\s\S]*?setting\.setdatabase =/);
  assert.match(migration, /Unexpected existing PostgREST pre-request configuration/);
});

test("PostgREST pre-request errors use the complete bounded PGRST JSON contract", () => {
  const start = migration.indexOf(
    "create function public.enforce_auth_email_change_session_boundary"
  );
  const end = migration.indexOf(
    "create table public.auth_email_sync_jobs",
    start
  );
  const source = migration.slice(start, end);

  assert.equal((source.match(/raise sqlstate 'PGRST'/g) ?? []).length, 4);
  assert.equal((source.match(/'details', null/g) ?? []).length, 4);
  assert.equal((source.match(/'hint', null/g) ?? []).length, 4);
  assert.equal(
    (source.match(/'headers', pg_catalog\.json_build_object\(\)/g) ?? []).length,
    4
  );
  assert.equal(
    (source.match(/'code', 'EMAIL_CHANGE_REAUTH_REQUIRED'/g) ?? []).length,
    2
  );
  assert.equal(
    (source.match(/'code', 'AUTH_STATE_UNAVAILABLE'/g) ?? []).length,
    2
  );
  assert.equal((source.match(/'status', 409/g) ?? []).length, 2);
  assert.equal((source.match(/'status', 503/g) ?? []).length, 2);
  assert.doesNotMatch(source, /'status_text'/);
});
