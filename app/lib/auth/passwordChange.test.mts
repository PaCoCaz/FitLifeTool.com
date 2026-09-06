import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildPasswordChangedLoginPath,
  createDefaultFreshPasswordChangeClient,
  createPasswordChangeAction,
  createPasswordChangeHandler,
  parsePasswordChangeRequest,
  resolvePasswordChangeAvailability,
  type PasswordChangeFreshClient,
  type PasswordChangeNormalClient,
} from "./passwordChange.ts";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const validInput = {
  currentPassword: " current password ",
  newPassword: " new password ",
  confirmation: " new password ",
};

function assurance(currentLevel: "aal1" | "aal2" | null = "aal1", nextLevel: "aal1" | "aal2" | null = "aal1") {
  return { currentLevel, nextLevel, currentAuthenticationMethods: [{ method: "password", timestamp: 1 }] };
}

function normalClient(options: {
  userId?: string | null;
  email?: string | null;
  userError?: unknown;
  claimsError?: unknown;
  sub?: unknown;
  amr?: unknown;
  omitAmr?: boolean;
  aal?: ReturnType<typeof assurance> | null;
  aalError?: unknown;
} = {}): PasswordChangeNormalClient {
  const userId = options.userId === undefined ? USER_A : options.userId;
  const claims: { sub: unknown; amr?: unknown } = { sub: options.sub ?? USER_A };
  if (!options.omitAmr) {
    claims.amr = Object.hasOwn(options, "amr")
      ? options.amr
      : [{ method: "password", timestamp: 1 }];
  }
  return {
    auth: {
      getUser: async () => ({
        data: { user: userId ? { id: userId, email: options.email === undefined ? "server@example.test" : options.email } : null },
        error: options.userError ?? null,
      }),
      getClaims: async () => ({
        data: options.claimsError ? null : { claims },
        error: options.claimsError ?? null,
      }),
      mfa: {
        getAuthenticatorAssuranceLevel: async () => ({ data: options.aal === undefined ? assurance() : options.aal, error: options.aalError ?? null }),
      },
    },
  };
}

function freshClient(options: {
  signInError?: unknown;
  signInThrows?: boolean;
  freshUserId?: string | null;
  sessionUserId?: string | null;
  aal?: ReturnType<typeof assurance> | null;
  aalError?: unknown;
  updateError?: unknown;
  updateThrows?: boolean;
  updateUserId?: string | null;
  globalError?: unknown;
} = {}) {
  const calls = { signIn: [] as unknown[], update: [] as unknown[], signOut: [] as unknown[], aal: 0 };
  let releaseUpdate: (() => void) | null = null;
  let waitForUpdate: Promise<void> | null = null;
  const value: PasswordChangeFreshClient = {
    auth: {
      signInWithPassword: async (input) => {
        calls.signIn.push(input);
        if (options.signInThrows) throw new Error("private sign-in transport");
        const freshUserId = options.freshUserId === undefined ? USER_A : options.freshUserId;
        const sessionUserId = options.sessionUserId === undefined ? USER_A : options.sessionUserId;
        return {
          data: {
            user: freshUserId ? { id: freshUserId } : null,
            session: sessionUserId ? { user: { id: sessionUserId } } : null,
          },
          error: options.signInError ?? null,
        };
      },
      mfa: {
        getAuthenticatorAssuranceLevel: async () => {
          calls.aal += 1;
          return { data: options.aal === undefined ? assurance() : options.aal, error: options.aalError ?? null };
        },
      },
      updateUser: async (input) => {
        calls.update.push(input);
        if (waitForUpdate) await waitForUpdate;
        if (options.updateThrows) throw new Error("private update transport");
        const userId = options.updateUserId === undefined ? USER_A : options.updateUserId;
        return { data: { user: userId ? { id: userId } : null }, error: options.updateError ?? null };
      },
      signOut: async (input) => {
        calls.signOut.push(input);
        return { error: input.scope === "global" ? options.globalError ?? null : null };
      },
    },
  };
  return {
    value,
    calls,
    holdUpdate() {
      waitForUpdate = new Promise<void>((resolve) => { releaseUpdate = resolve; });
    },
    releaseUpdate() { releaseUpdate?.(); },
  };
}

function request(body: unknown, overrides: { method?: string; origin?: string; contentType?: string } = {}) {
  return new Request("https://fitlifetool.test/api/auth/change-password", {
    method: overrides.method ?? "POST",
    headers: {
      Origin: overrides.origin === undefined ? "https://fitlifetool.test" : overrides.origin,
      "Content-Type": overrides.contentType ?? "application/json",
    },
    body: overrides.method === "GET" ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

function handler(options: { normal?: PasswordChangeNormalClient; fresh?: ReturnType<typeof freshClient> } = {}) {
  const fresh = options.fresh ?? freshClient();
  const factoryCalls: unknown[] = [];
  const run = createPasswordChangeHandler({
    configuration: () => ({ supabaseUrl: "https://project.supabase.test", anonKey: "public-anon-key" }),
    createNormalClient: async () => options.normal ?? normalClient(),
    createFreshClient: (...args) => { factoryCalls.push(args); return fresh.value; },
  });
  return { run, fresh, factoryCalls };
}

test("request parser is closed and preserves password bytes", () => {
  assert.deepEqual(parsePasswordChangeRequest(validInput), validInput);
  for (const invalid of [null, [], {}, { ...validInput, email: "x" }, { ...validInput, currentPassword: 1 }, { currentPassword: "x", newPassword: "x" }]) {
    assert.equal(parsePasswordChangeRequest(invalid), null);
  }
});

test("handler enforces POST, same origin, JSON, exact schema and security headers", async () => {
  const run = handler().run;
  const responses = await Promise.all([
    run(request(validInput, { method: "GET" })),
    run(request(validInput, { origin: "" })),
    run(request(validInput, { origin: "https://evil.test" })),
    run(request(validInput, { contentType: "text/plain" })),
    run(request("{")),
    run(request({ ...validInput, userId: USER_A })),
  ]);
  assert.deepEqual(responses.map((response) => response.status), [400, 403, 403, 400, 400, 400]);
  for (const response of responses) {
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("vary"), "Origin, Cookie");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  }
});

test("normal eligibility requires verified matching password-only AMR and AAL1/AAL1", async () => {
  assert.equal((await resolvePasswordChangeAvailability(normalClient())).available, true);
  assert.equal((await resolvePasswordChangeAvailability(normalClient({ amr: ["password"] }))).available, true);
  for (const client of [
    normalClient({ userId: null }),
    normalClient({ email: null }),
    normalClient({ sub: USER_B }),
    normalClient({ omitAmr: true }),
    normalClient({ amr: undefined }),
    normalClient({ amr: [] }),
    normalClient({ amr: ["oauth"] }),
    normalClient({ amr: ["otp"] }),
    normalClient({ amr: ["magiclink"] }),
    normalClient({ amr: ["password", "oauth"] }),
    normalClient({ amr: [{ method: "password" }] }),
    normalClient({ amr: [{ method: "password", timestamp: "1" }] }),
    normalClient({ aal: assurance("aal2", "aal2") }),
    normalClient({ aal: assurance("aal1", "aal2") }),
    normalClient({ aal: null }),
  ]) assert.equal((await resolvePasswordChangeAvailability(client)).available, false);
  assert.deepEqual(await resolvePasswordChangeAvailability(normalClient({ claimsError: new Error("private") })), { available: false, code: "AUTH_STATE_UNAVAILABLE" });
});

test("fresh auth uses server email and unchanged current password on a nonpersistent isolated client", async () => {
  const current = handler();
  const response = await current.run(request(validInput));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { code: "PASSWORD_CHANGE_COMPLETED" });
  assert.deepEqual(current.factoryCalls[0], [
    "https://project.supabase.test",
    "public-anon-key",
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  ]);
  assert.deepEqual(current.fresh.calls.signIn, [{ email: "server@example.test", password: " current password " }]);
  assert.deepEqual(current.fresh.calls.update, [{ password: " new password ", current_password: " current password " }]);
  assert.deepEqual(current.fresh.calls.signOut, [{ scope: "global" }]);
});

test("canonical validation runs before fresh auth without trimming or duplicate policy", async () => {
  const tooShort = handler();
  const shortResponse = await tooShort.run(request({ currentPassword: "current", newPassword: " 1234567 ", confirmation: " 1234567 " }));
  assert.equal(shortResponse.status, 422);
  assert.equal(tooShort.fresh.calls.signIn.length, 0);
  const mismatch = handler();
  assert.equal((await mismatch.run(request({ currentPassword: "current", newPassword: "1234567890", confirmation: "1234567891" }))).status, 422);
  assert.equal(mismatch.fresh.calls.signIn.length, 0);
});

test("wrong current password, identity mismatch and fresh AAL fail before mutation", async () => {
  for (const [fresh, expected] of [
    [freshClient({ signInError: { code: "invalid_credentials", message: "private" } }), "PASSWORD_CHANGE_REAUTH_FAILED"],
    [freshClient({ freshUserId: USER_B }), "PASSWORD_CHANGE_NOT_AVAILABLE"],
    [freshClient({ sessionUserId: USER_B }), "PASSWORD_CHANGE_NOT_AVAILABLE"],
    [freshClient({ aal: assurance("aal1", "aal2") }), "PASSWORD_CHANGE_NOT_AVAILABLE"],
  ] as const) {
    const current = handler({ fresh });
    const response = await current.run(request(validInput));
    assert.deepEqual(await response.json(), { code: expected });
    assert.equal(fresh.calls.update.length, 0);
  }
});

test("returned update failures normalize without provider text", async () => {
  for (const [error, code, status] of [
    [{ code: "weak_password", message: "private policy" }, "PASSWORD_VALIDATION_FAILED", 422],
    [{ code: "same_password", message: "private same" }, "PASSWORD_VALIDATION_FAILED", 422],
    [{ code: "reauthentication_not_valid", message: "private nonce" }, "PASSWORD_CHANGE_REAUTH_FAILED", 403],
    [{ code: "insufficient_aal", message: "private assurance" }, "PASSWORD_CHANGE_NOT_AVAILABLE", 403],
    [{ code: "unexpected_failure", message: "private provider" }, "PASSWORD_CHANGE_STATUS_UNKNOWN", 409],
  ] as const) {
    const current = handler({ fresh: freshClient({ updateError: error }) });
    const response = await current.run(request(validInput));
    const json = await response.json();
    assert.equal(response.status, status);
    assert.deepEqual(json, { code });
    assert.doesNotMatch(JSON.stringify(json), /private|provider|policy|nonce/);
  }
});

test("only allowlisted returned update failures are definitive", async () => {
  for (const error of [
    { code: "request_timeout", message: "private timeout" },
    { code: "hook_timeout", message: "private hook" },
    { code: "unexpected_failure", message: "private provider" },
    { status: 504, message: "private gateway" },
    { message: "private missing code" },
  ]) {
    const fresh = freshClient({ updateError: error });
    const action = createPasswordChangeAction(
      fresh.value,
      { userId: USER_A, email: "server@example.test" },
      validInput
    );
    assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
    assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
    assert.equal(fresh.calls.update.length, 1);
  }
});

test("isolated SDK transport maps gateway and sanitized transport failures to status unknown", async () => {
  const rawTransportDetail = "SYNTHETIC_RAW_PASSWORD_TRANSPORT_DETAIL";

  for (const failure of ["gateway", "transport"] as const) {
    let updateCalls = 0;
    const consoleOutput: string[] = [];
    const originalConsoleError = console.error;
    const client = createDefaultFreshPasswordChangeClient(
      "https://local-password-change.invalid",
      "synthetic-anon-key",
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
      async (input, init) => {
        const url = String(input);
        if (url.includes("/token")) {
          return Response.json({
            access_token: "synthetic-access-token",
            refresh_token: "synthetic-refresh-token",
            token_type: "bearer",
            expires_in: 3600,
            user: { id: USER_A, email: "server@example.test", factors: [] },
          });
        }
        if (init?.method === "PUT") {
          updateCalls += 1;
          if (failure === "transport") throw new Error(rawTransportDetail);
          return new Response("gateway unavailable", { status: 504 });
        }
        return new Response(null, { status: 204 });
      }
    );
    client.auth.mfa.getAuthenticatorAssuranceLevel = async () => ({
      data: assurance(),
      error: null,
    });
    console.error = (...values: unknown[]) => {
      consoleOutput.push(values.map(String).join(" "));
    };
    try {
      const action = createPasswordChangeAction(
        client,
        { userId: USER_A, email: "server@example.test" },
        validInput
      );
      assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
      assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
    } finally {
      console.error = originalConsoleError;
    }
    assert.equal(updateCalls, 1);
    assert.equal(consoleOutput.some((entry) => entry.includes(rawTransportDetail)), false);
  }
});

test("mutation lock permits at most one update per action under concurrency", async () => {
  const fresh = freshClient();
  fresh.holdUpdate();
  const action = createPasswordChangeAction(fresh.value, { userId: USER_A, email: "server@example.test" }, validInput);
  const first = action();
  await new Promise((resolve) => setImmediate(resolve));
  const second = await action();
  assert.equal(second, "PASSWORD_CHANGE_STATUS_UNKNOWN");
  assert.equal(fresh.calls.update.length, 1);
  fresh.releaseUpdate();
  assert.equal(await first, "PASSWORD_CHANGE_COMPLETED");
  assert.equal(fresh.calls.update.length, 1);
});

test("thrown update is ambiguous, never retried, and success cleanup failure is partial", async () => {
  const ambiguous = freshClient({ updateThrows: true });
  const action = createPasswordChangeAction(ambiguous.value, { userId: USER_A, email: "server@example.test" }, validInput);
  assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
  assert.equal(await action(), "PASSWORD_CHANGE_STATUS_UNKNOWN");
  assert.equal(ambiguous.calls.update.length, 1);

  const partial = freshClient({ globalError: { code: "request_timeout", message: "private" } });
  assert.equal(
    await createPasswordChangeAction(partial.value, { userId: USER_A, email: "server@example.test" }, validInput)(),
    "PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED"
  );
  assert.equal(partial.calls.update.length, 1);
  assert.deepEqual(partial.calls.signOut, [{ scope: "global" }]);
});

test("password change destination is locale-aware, closed and has no returnTo", () => {
  assert.equal(buildPasswordChangedLoginPath("fr"), "/login?lang=fr&auth_notice=password_changed");
  assert.equal(buildPasswordChangedLoginPath("unsafe"), "/login?lang=en&auth_notice=password_changed");
  assert.doesNotMatch(buildPasswordChangedLoginPath("nl"), /returnTo/);
});

test("implementation contains no logging, service role, message matching, or request identity", async () => {
  const source = await readFile(new URL("./passwordChange.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /console\.|service[_-]?role|\.message\s*[=)]|body\.(?:email|userId|profileId|identityId|returnTo)/i);
});
