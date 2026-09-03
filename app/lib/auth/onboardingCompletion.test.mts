import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ONBOARDING_ACTIVITY_LEVELS,
  ONBOARDING_GOALS,
  asOnboardingCompletionRpcStatus,
  createOnboardingCompletionHandler,
  parseOnboardingCompletionInput,
  rpcStatusFailure,
  type OnboardingCompletionClient,
} from "./onboardingCompletion.ts";

const endpoint = "https://fitlifetool.test/api/onboarding/complete";
const completeProfile = {
  country_code: "NL",
  food_region: "NL",
  gender: "female",
  birthdate: "1990-01-01",
  height_cm: 170,
  weight_kg: 65,
  calculation_sex: "female",
  activity_level: "moderate",
  language: "en",
};

function request(
  body: unknown = { activityLevel: "moderate", goal: "MAINTAIN" },
  headers: Record<string, string> = {
    origin: "https://fitlifetool.test",
    "content-type": "application/json",
  }
) {
  return new Request(endpoint, {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

type ClientOptions = {
  authenticated?: boolean;
  rpcStatus?: unknown;
  rpcError?: unknown;
  rpcThrows?: boolean;
  complete?: boolean;
};

function client(options: ClientOptions = {}) {
  const rpcCalls: unknown[][] = [];
  const authenticated = options.authenticated ?? true;
  const complete = options.complete ?? true;

  function query(table: string) {
    const builder: Record<string, (...args: unknown[]) => unknown> = {};
    for (const operation of ["select", "eq", "is", "order", "limit"]) {
      builder[operation] = () => builder;
    }
    builder.maybeSingle = async () => ({
      data:
        table === "profiles"
          ? complete
            ? completeProfile
            : { ...completeProfile, activity_level: null }
          : complete
            ? { id: "goal" }
            : null,
      error: null,
    });
    return builder;
  }

  const value = {
    auth: {
      getUser: async () => ({
        data: { user: authenticated ? { id: "verified-user" } : null },
        error: null,
      }),
    },
    from: (table: string) => query(table),
    rpc: async (...args: unknown[]) => {
      rpcCalls.push(args);
      if (options.rpcThrows) throw new Error("private database detail");
      return {
        data: options.rpcStatus ?? "COMPLETED",
        error: options.rpcError ?? null,
      };
    },
  };

  return {
    value: value as unknown as OnboardingCompletionClient,
    rpcCalls,
  };
}

const resolveCompleteState = async () => ({
  kind: "AUTHENTICATED_ONBOARDING_COMPLETE" as const,
});

test("completion input uses exact activity and onboarding goal allowlists", () => {
  for (const activityLevel of ONBOARDING_ACTIVITY_LEVELS) {
    for (const goal of ONBOARDING_GOALS) {
      assert.deepEqual(parseOnboardingCompletionInput({ activityLevel, goal }), {
        activityLevel,
        goal,
      });
    }
  }

  for (const value of [
    null,
    {},
    { activityLevel: "MODERATE", goal: "MAINTAIN" },
    { activityLevel: "moderate", goal: "HOLIDAY" },
    { activityLevel: "moderate", goal: "MAINTAIN", userId: "other" },
  ]) {
    assert.equal(parseOnboardingCompletionInput(value), null);
  }
});

test("RPC statuses have a closed FitLifeTool-owned contract", () => {
  assert.equal(asOnboardingCompletionRpcStatus("COMPLETED"), "COMPLETED");
  assert.equal(asOnboardingCompletionRpcStatus("provider detail"), null);
  assert.deepEqual(rpcStatusFailure("INVALID_INPUT"), {
    code: "ONBOARDING_INPUT_INVALID",
    status: 422,
  });
  assert.deepEqual(rpcStatusFailure("PREREQUISITE_INCOMPLETE"), {
    code: "ONBOARDING_PREREQUISITES_INCOMPLETE",
    status: 422,
  });
  assert.deepEqual(rpcStatusFailure("STATE_CONFLICT"), {
    code: "ONBOARDING_STATE_CONFLICT",
    status: 409,
  });
  assert.equal(rpcStatusFailure("COMPLETED"), null);
});

test("completion endpoint is same-origin, JSON-only and closed-input", async () => {
  const { value } = client();
  const handler = createOnboardingCompletionHandler(
    async () => value,
    resolveCompleteState
  );
  const badOrigin = await handler(request(undefined, {
    origin: "https://attacker.test",
    "content-type": "application/json",
  }));
  const badType = await handler(request("{}", {
    origin: "https://fitlifetool.test",
    "content-type": "text/plain",
  }));
  const extraField = await handler(request({
    activityLevel: "moderate",
    goal: "MAINTAIN",
    userId: "attacker-selected-user",
  }));

  assert.equal(badOrigin.status, 403);
  assert.equal(badType.status, 400);
  assert.equal(extraField.status, 422);
});

test("completion endpoint authenticates before an identity-free RPC call", async () => {
  const authenticated = client();
  const handler = createOnboardingCompletionHandler(
    async () => authenticated.value,
    resolveCompleteState
  );
  const response = await handler(request());

  assert.equal(response.status, 200);
  assert.deepEqual(authenticated.rpcCalls, [[
    "complete_user_onboarding",
    { p_activity_level: "moderate", p_goal: "MAINTAIN" },
  ]]);
  assert.doesNotMatch(JSON.stringify(authenticated.rpcCalls), /userId|user_id|returnTo/);

  const anonymous = client({ authenticated: false });
  const anonymousResponse = await createOnboardingCompletionHandler(
    async () => anonymous.value,
    resolveCompleteState
  )(request());
  assert.equal(anonymousResponse.status, 401);
  assert.equal(anonymous.rpcCalls.length, 0);
});

test("known RPC outcomes map to stable responses", async () => {
  const cases = [
    ["INVALID_INPUT", 422, "ONBOARDING_INPUT_INVALID"],
    ["PREREQUISITE_INCOMPLETE", 422, "ONBOARDING_PREREQUISITES_INCOMPLETE"],
    ["STATE_CONFLICT", 409, "ONBOARDING_STATE_CONFLICT"],
  ] as const;

  for (const [rpcStatus, status, code] of cases) {
    const current = client({ rpcStatus });
    const response = await createOnboardingCompletionHandler(
      async () => current.value,
      resolveCompleteState
    )(request());
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { code });
  }
});

test("success requires an authoritative complete state and always targets dashboard", async () => {
  for (const rpcStatus of ["COMPLETED", "ALREADY_COMPLETE"]) {
    const current = client({ rpcStatus });
    const response = await createOnboardingCompletionHandler(
      async () => current.value,
      resolveCompleteState
    )(request());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: rpcStatus === "COMPLETED" ? "completed" : "already_complete",
      destination: "/dashboard",
    });
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }

  const incomplete = client({ complete: false });
  const response = await createOnboardingCompletionHandler(
    async () => incomplete.value,
    async () => ({ kind: "AUTHENTICATED_ONBOARDING_INCOMPLETE" })
  )(request());
  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), { code: "ONBOARDING_STATE_CONFLICT" });
});

test("unknown, returned and thrown failures never leak provider details", async () => {
  for (const options of [
    { rpcStatus: "PRIVATE_STATUS" },
    { rpcError: { message: "private constraint name" } },
    { rpcThrows: true },
  ]) {
    const current = client(options);
    const response = await createOnboardingCompletionHandler(
      async () => current.value,
      resolveCompleteState
    )(request());
    const payload = JSON.stringify(await response.json());
    assert.equal(response.status, 503);
    assert.deepEqual(JSON.parse(payload), {
      code: "ONBOARDING_COMPLETION_UNAVAILABLE",
    });
    assert.doesNotMatch(payload, /private|constraint|provider|database/i);
  }
});

test("client finalization uses only the server completion boundary", async () => {
  const source = await readFile(
    new URL("../../components/auth/OnboardingFinalStep.tsx", import.meta.url),
    "utf8"
  );
  const submit = source.slice(source.indexOf("async function handleFinish"));
  assert.match(submit, /fetch\("\/api\/onboarding\/complete"/);
  assert.doesNotMatch(submit, /from\("profiles"\).*update|from\("user_goal_periods"\).*insert|recalculate_user_targets/s);
  assert.doesNotMatch(submit, /\.message|returnTo/);
});
