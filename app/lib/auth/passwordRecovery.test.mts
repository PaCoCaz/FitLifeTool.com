import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AuthRetryableFetchError } from "@supabase/supabase-js";
import {
  buildPasswordResetLoginPath,
  buildRecoveryRedirectUrl,
  completePasswordRecoveryApplicationCleanup,
  createPasswordRecoveryHandler,
  getPasswordRecoveryCooldownDeadline,
  getPasswordRecoveryCooldownSeconds,
  initializePasswordRecoveryLocation,
  parsePasswordRecoveryLink,
  parsePasswordRecoveryRequestBody,
  PASSWORD_RECOVERY_COOLDOWN_SECONDS,
  PASSWORD_RECOVERY_TOKEN_MAX_LENGTH,
  resolvePasswordRecoveryLanguage,
} from "./passwordRecovery.ts";
import { createPasswordRecoveryAction } from "./passwordRecoveryClient.ts";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://fitlifetool.test/api/auth/forgot-password", {
    method: "POST",
    headers: {
      Origin: "https://fitlifetool.test",
      "Content-Type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function handler(providerError: unknown | null = null) {
  const calls: unknown[] = [];
  return {
    calls,
    run: createPasswordRecoveryHandler({
      configuration: () => ({
        supabaseUrl: "https://project.supabase.test",
        anonKey: "public-key",
        siteUrl: "https://fitlifetool.test",
      }),
      createAnonClient: (...arguments_) => {
        calls.push(arguments_);
        return {
          auth: {
            resetPasswordForEmail: async (...input) => {
              calls.push(input);
              return { error: providerError };
            },
          },
        };
      },
    }),
  };
}

test("recovery uses the canonical five-locale authority with English fallback", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    assert.equal(resolvePasswordRecoveryLanguage(language), language);
  }
  for (const value of [undefined, null, "", "NL", "es", 1]) {
    assert.equal(resolvePasswordRecoveryLanguage(value), "en");
  }
});

test("trusted redirects and post-reset login contain only locked state", () => {
  assert.equal(
    buildRecoveryRedirectUrl("https://fitlifetool.test/path?returnTo=/dashboard#x", "fr"),
    "https://fitlifetool.test/reset-password?lang=fr"
  );
  assert.equal(
    buildPasswordResetLoginPath("nl"),
    "/login?lang=nl&auth_notice=password_reset"
  );
  assert.throws(() => buildRecoveryRedirectUrl("javascript:alert(1)", "en"));
});

test("request body is exact, trimmed without lowercasing, and bounded", () => {
  assert.deepEqual(
    parsePasswordRecoveryRequestBody({ email: " Person@Example.TEST ", language: "pl" }),
    { email: "Person@Example.TEST", language: "pl" }
  );
  assert.deepEqual(
    parsePasswordRecoveryRequestBody({ email: "person@example.test", language: "unsafe" }),
    { email: "person@example.test", language: "en" }
  );
  for (const value of [
    null,
    [],
    {},
    { email: 1 },
    { email: "invalid" },
    { email: "person@example.test", language: 1 },
    { email: `${"a".repeat(243)}@example.test` },
    { email: "person@example.test", extra: true },
  ]) assert.equal(parsePasswordRecoveryRequestBody(value), null);
});

test("forgot-password endpoint enforces Origin, JSON, schema, and email", async () => {
  const { run } = handler();
  const responses = await Promise.all([
    run(request({ email: "person@example.test" }, { Origin: "" })),
    run(request({ email: "person@example.test" }, { Origin: "https://attacker.test" })),
    run(request({}, { "Content-Type": "text/plain" })),
    run(request("{")),
    run(request({ email: "bad" })),
    run(request({ email: "person@example.test", userId: "caller" })),
  ]);
  assert.deepEqual(responses.map((response) => response.status), [403, 403, 400, 400, 400, 400]);
  assert.deepEqual(await responses[0].json(), { code: "ORIGIN_NOT_ALLOWED" });
  for (const response of responses.slice(2)) {
    assert.deepEqual(await response.json(), { code: "INVALID_REQUEST" });
  }
});

test("accepted request uses a nonpersistent anonymous client and trusted locale", async () => {
  const { calls, run } = handler();
  const response = await run(request({ email: " Person@Example.TEST ", language: "de" }));
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { code: "RECOVERY_REQUEST_ACCEPTED" });
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("vary"), "Origin");
  assert.deepEqual(calls[0], [
    "https://project.supabase.test",
    "public-key",
    { auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false } },
  ]);
  assert.deepEqual(calls[1], [
    "Person@Example.TEST",
    { redirectTo: "https://fitlifetool.test/reset-password?lang=de" },
  ]);
});

test("account and provider policy outcomes remain publicly indistinguishable", async () => {
  for (const providerError of [
    null,
    { code: "user_not_found", message: "private address state" },
    { code: "over_email_send_rate_limit", message: "private provider limit" },
  ]) {
    const response = await handler(providerError).run(
      request({ email: "person@example.test", language: "en" })
    );
    assert.equal(response.status, 202);
    const payload = await response.json();
    assert.deepEqual(payload, { code: "RECOVERY_REQUEST_ACCEPTED" });
    assert.doesNotMatch(JSON.stringify(payload), /private|provider|limit|address/i);
  }
});

test("transport, thrown, and configuration failures expose only unavailable", async () => {
  const retryable = handler(new AuthRetryableFetchError("private transport", 503));
  const thrown = createPasswordRecoveryHandler({
    configuration: () => ({ supabaseUrl: "url", anonKey: "key", siteUrl: "https://fitlifetool.test" }),
    createAnonClient: () => ({ auth: { resetPasswordForEmail: async () => { throw new Error("private"); } } }),
  });
  const missing = createPasswordRecoveryHandler({
    configuration: () => ({}),
    createAnonClient: () => assert.fail("client must not be created"),
  });
  for (const run of [retryable.run, thrown, missing]) {
    const response = await run(request({ email: "person@example.test", language: "en" }));
    const payload = await response.json();
    assert.equal(response.status, 503);
    assert.deepEqual(payload, { code: "RECOVERY_REQUEST_UNAVAILABLE" });
    assert.doesNotMatch(JSON.stringify(payload), /private|transport|config/i);
  }
});

test("strict link parser accepts only one safe token_hash and recovery type", () => {
  const valid = parsePasswordRecoveryLink(
    new URL("https://fitlifetool.test/reset-password?lang=fr&token_hash=Abc_123-def&type=recovery")
  );
  assert.deepEqual(valid, {
    valid: true,
    language: "fr",
    tokenHash: "Abc_123-def",
    sanitizedPath: "/reset-password?lang=fr",
  });

  const invalidQueries = [
    "lang=en&type=recovery",
    "lang=en&token_hash=&type=recovery",
    "lang=en&token_hash=a&token_hash=b&type=recovery",
    "lang=en&token_hash=a",
    "lang=en&token_hash=a&type=recovery&type=recovery",
    "lang=en&token_hash=a&type=signup",
    "lang=en&token_hash=a&type=recovery&code=x",
    "lang=en&token_hash=a&type=recovery&next=/dashboard",
    "lang=en&lang=nl&token_hash=a&type=recovery",
    "lang=en&token_hash=a%20b&type=recovery",
    "lang=en&token_hash=a%00b&type=recovery",
    `lang=en&token_hash=${"a".repeat(PASSWORD_RECOVERY_TOKEN_MAX_LENGTH + 1)}&type=recovery`,
  ];
  for (const query of invalidQueries) {
    assert.equal(parsePasswordRecoveryLink(new URL(`https://fitlifetool.test/reset-password?${query}`)).valid, false);
  }
  assert.equal(
    parsePasswordRecoveryLink(new URL("https://fitlifetool.test/reset-password?lang=en&token_hash=a&type=recovery#fragment")).valid,
    false
  );
});

test("browser location is sanitized before any isolated provider action", async () => {
  const events: string[] = [];
  const parsed = initializePasswordRecoveryLocation(
    "https://fitlifetool.test/reset-password?lang=en&token_hash=safe_token&type=recovery",
    (path) => events.push(`sanitize:${path}`)
  );
  assert.equal(parsed.valid, true);
  if (!parsed.valid) return;

  const action = createPasswordRecoveryAction(
    { supabaseUrl: "https://project.supabase.test", anonKey: "public-key" },
    () => ({
      auth: {
        verifyOtp: async () => {
          events.push("verify");
          return { error: null };
        },
        updateUser: async () => {
          events.push("update");
          return { error: null };
        },
        signOut: async ({ scope }) => {
          events.push(`signout:${scope}`);
          return { error: null };
        },
      },
    })
  );
  await action.execute(parsed.tokenHash, "1234567890");
  assert.deepEqual(events, [
    "sanitize:/reset-password?lang=en",
    "verify",
    "update",
    "signout:global",
  ]);
  assert.equal(parsed.tokenHash, "safe_token");
});

test("terminal cleanup uses Phase-06 request shape before event, clearing, and navigation", async () => {
  const events: string[] = [];
  const action = createPasswordRecoveryAction(
    { supabaseUrl: "https://project.supabase.test", anonKey: "public-key" },
    () => ({
      auth: {
        verifyOtp: async () => ({ error: null }),
        updateUser: async () => ({ error: null }),
        signOut: async ({ scope }) => {
          events.push(`isolated-signout:${scope}`);
          return { error: null };
        },
      },
    })
  );
  assert.equal(
    await action.execute("token", "1234567890"),
    "PASSWORD_RESET_COMPLETED"
  );
  const result = await completePasswordRecoveryApplicationCleanup("fr", {
    requestLogout: async (endpoint, init) => {
      events.push(`request:${endpoint}`);
      assert.deepEqual(init, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "fr" }),
      });
      return {
        ok: true,
        json: async () => {
          events.push("logout-terminal");
          return { code: "LOGOUT_COMPLETED" };
        },
      };
    },
    notifyLogout: () => events.push("event:logout"),
    clearSensitiveState: () => events.push("clear-sensitive"),
    navigate: (destination) => events.push(`navigate:${destination}`),
  });

  assert.equal(result, "completed");
  assert.deepEqual(events, [
    "isolated-signout:global",
    "request:/auth/logout",
    "logout-terminal",
    "event:logout",
    "clear-sensitive",
    "navigate:/login?lang=fr&auth_notice=password_reset",
  ]);
});

test("nonterminal logout never publishes, clears, or navigates as completed", async () => {
  const events: string[] = [];
  const result = await completePasswordRecoveryApplicationCleanup("nl", {
    requestLogout: async () => ({
      ok: false,
      json: async () => ({ code: "LOGOUT_UNAVAILABLE" }),
    }),
    notifyLogout: () => events.push("event"),
    clearSensitiveState: () => events.push("clear"),
    navigate: () => events.push("navigate"),
  });
  assert.equal(result, "cleanup_required");
  assert.deepEqual(events, []);
});

test("invalid single locale falls back safely while duplicate locale invalidates link", () => {
  const fallback = parsePasswordRecoveryLink(
    new URL("https://fitlifetool.test/reset-password?lang=es&token_hash=a&type=recovery")
  );
  assert.equal(fallback.valid, true);
  assert.equal(fallback.language, "en");
  assert.equal(fallback.sanitizedPath, "/reset-password?lang=en");
});

test("cooldown is exactly sixty seconds and reaches zero", () => {
  const now = 1_000;
  const deadline = getPasswordRecoveryCooldownDeadline(now);
  assert.equal(deadline, now + PASSWORD_RECOVERY_COOLDOWN_SECONDS * 1_000);
  assert.equal(getPasswordRecoveryCooldownSeconds(deadline, now), 60);
  assert.equal(getPasswordRecoveryCooldownSeconds(deadline, deadline + 1), 0);
});

test("recovery UI keeps credentials in memory, sanitizes first, and uses canonical validation", async () => {
  const [reset, helper, client, forgot, layout] = await Promise.all([
    read("app/reset-password/ResetPasswordClient.tsx"),
    read("app/lib/auth/passwordRecovery.ts"),
    read("app/lib/auth/passwordRecoveryClient.ts"),
    read("app/forgot-password/page.tsx"),
    read("app/reset-password/layout.tsx"),
  ]);
  assert.match(reset, /useLayoutEffect/);
  assert.match(reset, /initializePasswordRecoveryLocation/);
  assert.match(helper, /replacePath\(parsed\.sanitizedPath\)/);
  assert.match(reset, /tokenHash = useRef<string \| null>/);
  assert.match(reset, /executePasswordRecoverySubmission/);
  assert.match(client, /validatePassword\(input\.password\)/);
  assert.match(client, /validatePasswordConfirmation\(/);
  assert.match(reset, /<form[^>]*onSubmit=\{handleSubmit\}[^>]*noValidate/);
  assert.match(reset, /aria-invalid=/);
  assert.match(reset, /\.focus\(\)/);
  assert.doesNotMatch(reset, /supabaseClient|localStorage|sessionStorage|error\.message|"\/dashboard"|returnTo|length < 8/);
  assert.doesNotMatch(layout, /AppProviders/);
  assert.match(layout, /referrer: "no-referrer"/);
  assert.match(forgot, /requestInFlight\.current \|\| cooldownSeconds > 0/);
  assert.match(forgot, /PASSWORD_RECOVERY_COOLDOWN_SECONDS/);
  assert.doesNotMatch(forgot, /setInterval\([^)]*(?:fetch|handleSubmit)/s);
});

test("recovery sources contain no duplicate locale authority or sensitive logging", async () => {
  const [helper, client, route, reset] = await Promise.all([
    read("app/lib/auth/passwordRecovery.ts"),
    read("app/lib/auth/passwordRecoveryClient.ts"),
    read("app/api/auth/forgot-password/route.ts"),
    read("app/reset-password/ResetPasswordClient.tsx"),
  ]);
  const sources = [helper, client, route, reset].join("\n");
  assert.doesNotMatch(
    sources,
    /\bRecoveryLanguage\b|\bRECOVERY_LANGUAGES\b|\basRecoveryLanguage\b|\bresolveRecoveryLanguage\b/
  );
  assert.doesNotMatch(sources, /console\.|service_role|SUPABASE_SERVICE|custom token/i);
  assert.doesNotMatch(sources, /\.message/);
  assert.equal((client.match(/client\.auth\.updateUser\(/g) ?? []).length, 1);
});
