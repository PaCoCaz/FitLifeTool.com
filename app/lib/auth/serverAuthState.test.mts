import assert from "node:assert/strict";
import test from "node:test";
import { AuthSessionMissingError } from "@supabase/auth-js";
import {
  applyPendingAuthCookies,
  resolveServerAuthState,
  type ServerAuthClient,
} from "./serverAuthState.ts";

const completeProfile = {
  country_code: "NL",
  food_region: "NL",
  gender: "female",
  birthdate: "1990-01-01",
  height_cm: 170,
  weight_kg: 65,
  calculation_sex: "female",
  activity_level: "moderate",
  language: "nl",
};

type QueryResult = { data: unknown; error: unknown };
type ClientOptions = {
  user?: { id: string; user_metadata?: Record<string, unknown> } | null;
  authError?: unknown;
  authThrows?: boolean;
  profile?: QueryResult;
  goal?: QueryResult;
  queryThrows?: boolean;
};

function mockClient(options: ClientOptions = {}) {
  const calls: Array<{ table: string; operation: string; args: unknown[] }> = [];
  const user = options.user === undefined ? { id: "verified-user" } : options.user;

  function query(table: string, result: QueryResult) {
    const builder: Record<string, (...args: unknown[]) => unknown> = {};
    for (const operation of ["select", "eq", "is", "order", "limit"]) {
      builder[operation] = (...args: unknown[]) => {
        calls.push({ table, operation, args });
        return builder;
      };
    }
    builder.maybeSingle = async () => {
      calls.push({ table, operation: "maybeSingle", args: [] });
      if (options.queryThrows) throw new Error("sensitive database details");
      return result;
    };
    return builder;
  }

  const client = {
    auth: {
      getUser: async () => {
        if (options.authThrows) throw new Error("sensitive provider details");
        return {
          data: { user },
          error: options.authError ?? null,
        };
      },
    },
    from: (table: string) =>
      query(
        table,
        table === "profiles"
          ? options.profile ?? { data: completeProfile, error: null }
          : options.goal ?? { data: { id: "goal" }, error: null }
      ),
  };

  return { client: client as unknown as ServerAuthClient, calls };
}

test("missing sessions and an absent verified user resolve as anonymous", async () => {
  const missingSession = mockClient({
    user: null,
    authError: new AuthSessionMissingError(),
  });
  const absentUser = mockClient({ user: null });

  assert.equal((await resolveServerAuthState(missingSession.client)).kind, "ANONYMOUS");
  assert.equal((await resolveServerAuthState(absentUser.client)).kind, "ANONYMOUS");
  assert.equal(missingSession.calls.length, 0);
  assert.equal(absentUser.calls.length, 0);
});

test("non-session auth failures and thrown auth exceptions fail closed", async () => {
  const returned = await resolveServerAuthState(
    mockClient({ user: null, authError: new Error("provider detail") }).client
  );
  const thrown = await resolveServerAuthState(
    mockClient({ authThrows: true }).client
  );

  assert.deepEqual(
    { kind: returned.kind, stage: returned.kind === "RESOLUTION_FAILURE" ? returned.stage : null },
    { kind: "RESOLUTION_FAILURE", stage: "identity" }
  );
  assert.deepEqual(
    { kind: thrown.kind, stage: thrown.kind === "RESOLUTION_FAILURE" ? thrown.stage : null },
    { kind: "RESOLUTION_FAILURE", stage: "identity" }
  );
  assert.doesNotMatch(JSON.stringify([returned, thrown]), /provider detail/);
});

test("missing and partial profiles resolve every incomplete state", async () => {
  const cases = [
    { profile: null, goal: null, step: "profile" },
    { profile: { ...completeProfile, gender: null }, goal: null, step: "personal" },
    { profile: { ...completeProfile, height_cm: null }, goal: null, step: "body" },
    { profile: { ...completeProfile, activity_level: null }, goal: null, step: "final" },
    { profile: completeProfile, goal: null, step: "final" },
  ];

  for (const entry of cases) {
    const state = await resolveServerAuthState(
      mockClient({
        profile: { data: entry.profile, error: null },
        goal: { data: entry.goal, error: null },
      }).client
    );
    assert.equal(state.kind, "AUTHENTICATED_ONBOARDING_INCOMPLETE");
    assert.equal(state.onboardingStep, entry.step);
  }
});

test("a complete profile requires an active goal", async () => {
  const state = await resolveServerAuthState(mockClient().client);
  assert.equal(state.kind, "AUTHENTICATED_ONBOARDING_COMPLETE");
  assert.equal(state.onboardingStep, "complete");
  assert.equal(state.userId, "verified-user");
});

test("profile, active-goal, and unexpected query failures fail closed without raw errors", async () => {
  const profileFailure = await resolveServerAuthState(
    mockClient({ profile: { data: null, error: { message: "private profile error" } } }).client
  );
  const goalFailure = await resolveServerAuthState(
    mockClient({ goal: { data: null, error: { message: "private goal error" } } }).client
  );
  const thrown = await resolveServerAuthState(mockClient({ queryThrows: true }).client);

  assert.equal(profileFailure.kind, "RESOLUTION_FAILURE");
  assert.equal(profileFailure.kind === "RESOLUTION_FAILURE" && profileFailure.stage, "profile");
  assert.equal(goalFailure.kind === "RESOLUTION_FAILURE" && goalFailure.stage, "active_goal");
  assert.equal(thrown.kind === "RESOLUTION_FAILURE" && thrown.stage, "state");
  assert.doesNotMatch(JSON.stringify([profileFailure, goalFailure, thrown]), /private|sensitive/);
});

test("all profile and goal reads bind to the verified user id and ignore metadata", async () => {
  const { client, calls } = mockClient({
    user: {
      id: "server-verified-id",
      user_metadata: { id: "attacker-id", onboarding_complete: true, language: "pl" },
    },
  });
  const state = await resolveServerAuthState(client);
  const identityFilters = calls.filter((call) => call.operation === "eq");

  assert.equal(state.userId, "server-verified-id");
  assert.deepEqual(
    identityFilters.map((call) => call.args),
    [["id", "server-verified-id"], ["user_id", "server-verified-id"]]
  );
  assert.equal(state.interfaceLanguage, "nl");
});

test("only allowlisted profile languages become authenticated locale authority", async () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    const state = await resolveServerAuthState(
      mockClient({ profile: { data: { ...completeProfile, language }, error: null } }).client
    );
    assert.equal(state.profileLanguage, language);
    assert.equal(state.interfaceLanguage, language);
  }

  for (const language of [null, "es", "NL"]) {
    const state = await resolveServerAuthState(
      mockClient({ profile: { data: { ...completeProfile, language }, error: null } }).client
    );
    assert.equal(state.profileLanguage, null);
    assert.equal(state.interfaceLanguage, "en");
  }
});

test("pending refreshed cookies are applied with their original options", () => {
  const writes: unknown[][] = [];
  const response = {
    cookies: {
      set: (...args: unknown[]) => writes.push(args),
    },
  };
  const result = applyPendingAuthCookies(response, [
    { name: "access", value: "new-access", options: { httpOnly: true, path: "/" } },
    { name: "refresh", value: "new-refresh", options: { sameSite: "lax" } },
  ]);

  assert.equal(result, response);
  assert.deepEqual(writes, [
    ["access", "new-access", { httpOnly: true, path: "/" }],
    ["refresh", "new-refresh", { sameSite: "lax" }],
  ]);
});
