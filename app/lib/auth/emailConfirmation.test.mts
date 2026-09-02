import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AuthSessionMissingError } from "@supabase/auth-js";
import { AuthRetryableFetchError } from "@supabase/supabase-js";
import { createEmailConfirmationHandler } from "../../auth/confirm/route.ts";
import { createResendConfirmationHandler } from "../../api/auth/resend-confirmation/route.ts";
import {
  buildEmailConfirmationRedirectUrl,
  EMAIL_CONFIRMATION_COOLDOWN_SECONDS,
  getEmailConfirmationCooldownDeadline,
  getEmailConfirmationCooldownSeconds,
  normalizeConfirmationResendResult,
  parseEmailConfirmationRequest,
  resolveEmailConfirmationLanguage,
  resolveEmailConfirmationPresentationState,
} from "./emailConfirmation.ts";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

test("confirmation locale and presentation state use closed allowlists", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    assert.equal(resolveEmailConfirmationLanguage(language), language);
  }
  for (const value of [undefined, null, "", "NL", "es", 1]) {
    assert.equal(resolveEmailConfirmationLanguage(value), "en");
  }
  assert.equal(resolveEmailConfirmationPresentationState("unavailable"), "unavailable");
  for (const value of ["invalid", "provider_error", undefined, null]) {
    assert.equal(resolveEmailConfirmationPresentationState(value), "invalid");
  }
});

test("trusted confirmation redirects are canonical for every locale", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    assert.equal(
      buildEmailConfirmationRedirectUrl(
        "https://fitlifetool.test/unsafe?next=/dashboard#token",
        language
      ),
      `https://fitlifetool.test/auth/confirm?lang=${language}`
    );
  }
  assert.equal(
    buildEmailConfirmationRedirectUrl("http://localhost:3000/old", "unsafe"),
    "http://localhost:3000/auth/confirm?lang=en"
  );
  assert.throws(() => buildEmailConfirmationRedirectUrl("not a url", "en"));
  assert.throws(() => buildEmailConfirmationRedirectUrl("javascript:alert(1)", "en"));
  assert.throws(() =>
    buildEmailConfirmationRedirectUrl("https://user:pass@example.test", "en")
  );
});

test("confirmation parser accepts exactly code or signup token hash", () => {
  assert.deepEqual(
    parseEmailConfirmationRequest(new URLSearchParams("code=abc&lang=fr")),
    { credential: { kind: "code", code: "abc" }, language: "fr" }
  );
  assert.deepEqual(
    parseEmailConfirmationRequest(
      new URLSearchParams("token_hash=hash&type=signup&lang=pl")
    ),
    {
      credential: { kind: "token_hash", tokenHash: "hash" },
      language: "pl",
    }
  );
});

test("confirmation parser rejects malformed, mixed, duplicate, and extended shapes", () => {
  for (const query of [
    "",
    "code=",
    "code=a&code=b",
    "token_hash=",
    "token_hash=hash",
    "token_hash=hash&type=recovery",
    "token_hash=hash&type=signup&type=signup",
    "code=abc&token_hash=hash&type=signup",
    "code=abc&type=signup",
    "code=abc&next=/dashboard",
    "code=abc&returnTo=/settings",
    "code=abc&unexpected=true",
  ]) {
    assert.equal(
      parseEmailConfirmationRequest(new URLSearchParams(query)).credential,
      null,
      query
    );
  }

  assert.deepEqual(
    parseEmailConfirmationRequest(
      new URLSearchParams("code=abc&lang=nl&lang=de")
    ),
    { credential: { kind: "code", code: "abc" }, language: "en" }
  );
});

test("resend normalization is neutral except for stable infrastructure failures", () => {
  assert.equal(normalizeConfirmationResendResult(null), "accepted");
  for (const code of [
    "user_not_found",
    "email_exists",
    "over_email_send_rate_limit",
    "over_request_rate_limit",
    "unknown_provider_result",
  ]) {
    assert.equal(normalizeConfirmationResendResult({ code }), "accepted");
  }
  for (const code of [
    "request_timeout",
    "hook_timeout",
    "hook_timeout_after_retry",
  ]) {
    assert.equal(normalizeConfirmationResendResult({ code }), "unavailable");
  }
});

test("cooldown is exactly sixty seconds and expires deterministically", () => {
  assert.equal(EMAIL_CONFIRMATION_COOLDOWN_SECONDS, 60);
  const deadline = getEmailConfirmationCooldownDeadline(10_000);
  assert.equal(deadline, 70_000);
  assert.equal(getEmailConfirmationCooldownSeconds(deadline, 10_000), 60);
  assert.equal(getEmailConfirmationCooldownSeconds(deadline, 69_001), 1);
  assert.equal(getEmailConfirmationCooldownSeconds(deadline, 70_000), 0);
});

type AuthMode = "complete" | "incomplete" | "anonymous" | "failure";

function confirmationClient(
  mode: AuthMode,
  verificationError: unknown | null,
  calls: string[]
) {
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
  function query(table: string) {
    const builder: Record<string, (...args: unknown[]) => unknown> = {};
    for (const operation of ["select", "eq", "is", "order", "limit"]) {
      builder[operation] = () => builder;
    }
    builder.maybeSingle = async () => ({
      data:
        table === "profiles"
          ? mode === "incomplete"
            ? null
            : completeProfile
          : mode === "incomplete"
            ? null
            : { id: "goal" },
      error: null,
    });
    return builder;
  }

  return {
    auth: {
      exchangeCodeForSession: async (code: string) => {
        calls.push(`code:${code}`);
        return { error: verificationError };
      },
      verifyOtp: async ({ token_hash }: { token_hash: string }) => {
        calls.push(`token:${token_hash}`);
        return { error: verificationError };
      },
      getUser: async () => {
        calls.push("getUser");
        if (mode === "anonymous") {
          return {
            data: { user: null },
            error: new AuthSessionMissingError(),
          };
        }
        if (mode === "failure") {
          return { data: { user: null }, error: new Error("private") };
        }
        return { data: { user: { id: "verified-user" } }, error: null };
      },
    },
    from: (table: string) => query(table),
  };
}

async function confirmationDestination(
  mode: AuthMode,
  verificationError: unknown | null,
  query = "code=credential&lang=fr"
) {
  const calls: string[] = [];
  const client = confirmationClient(mode, verificationError, calls);
  const handler = createEmailConfirmationHandler(
    async () => client as never
  );
  const response = await handler(
    new Request(`https://fitlifetool.test/auth/confirm?${query}`)
  );
  return {
    calls,
    response,
    location: new URL(response.headers.get("location")!),
  };
}

test("successful confirmation uses server-owned onboarding state", async () => {
  const incomplete = await confirmationDestination("incomplete", null);
  const complete = await confirmationDestination("complete", null);
  const anonymous = await confirmationDestination("anonymous", null);
  const failure = await confirmationDestination("failure", null);

  assert.equal(incomplete.location.pathname, "/onboarding");
  assert.equal(complete.location.pathname, "/dashboard");
  assert.equal(anonymous.location.pathname, "/auth/confirmation");
  assert.equal(anonymous.location.searchParams.get("state"), "unavailable");
  assert.equal(failure.location.searchParams.get("state"), "unavailable");
  assert.deepEqual(incomplete.calls.slice(0, 2), ["code:credential", "getUser"]);
  assert.equal(incomplete.response.headers.get("cache-control"), "private, no-store");
  assert.equal(incomplete.response.headers.get("vary"), "Cookie");
});

test("failed confirmation trusts only an existing server-owned session", async () => {
  const providerError = new Error("private provider detail");
  const incomplete = await confirmationDestination("incomplete", providerError);
  const complete = await confirmationDestination("complete", providerError);
  const anonymous = await confirmationDestination("anonymous", providerError);
  const failure = await confirmationDestination("failure", providerError);

  assert.equal(incomplete.location.pathname, "/onboarding");
  assert.equal(complete.location.pathname, "/dashboard");
  assert.equal(anonymous.location.searchParams.get("state"), "invalid");
  assert.equal(failure.location.searchParams.get("state"), "unavailable");
  for (const result of [incomplete, complete, anonymous, failure]) {
    assert.doesNotMatch(result.location.toString(), /private|provider|credential/);
  }
});

test("token hash uses the same client context and credentials never reach redirects", async () => {
  const result = await confirmationDestination(
    "incomplete",
    null,
    "token_hash=secret-hash&type=signup&lang=de"
  );
  assert.deepEqual(result.calls.slice(0, 2), ["token:secret-hash", "getUser"]);
  assert.equal(result.location.pathname, "/onboarding");
  assert.doesNotMatch(result.location.toString(), /secret-hash|token_hash|returnTo|next/);
});

test("malformed confirmation never initializes a provider client", async () => {
  let clientCalls = 0;
  const handler = createEmailConfirmationHandler(async () => {
    clientCalls += 1;
    throw new Error("must not run");
  });
  const response = await handler(
    new Request("https://fitlifetool.test/auth/confirm?code=a&next=/dashboard&lang=nl")
  );
  const location = new URL(response.headers.get("location")!);

  assert.equal(clientCalls, 0);
  assert.equal(location.pathname, "/auth/confirmation");
  assert.deepEqual(Object.fromEntries(location.searchParams), {
    lang: "nl",
    state: "invalid",
  });
});

const resendUrl = "https://fitlifetool.test/api/auth/resend-confirmation";
function resendRequest(
  body: unknown,
  headers: Record<string, string> = {
    origin: "https://fitlifetool.test",
    "content-type": "application/json",
  }
) {
  return new Request(resendUrl, {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function resendHandler(error: unknown | null = null) {
  const calls: unknown[] = [];
  const handler = createResendConfirmationHandler({
    configuration: () => ({
      supabaseUrl: "https://project.supabase.test",
      anonKey: "public-anon-key",
      siteUrl: "https://fitlifetool.test/untrusted?next=x#fragment",
    }),
    createAnonClient: (...arguments_) => {
      calls.push(arguments_);
      return {
        auth: {
          resend: async (input) => {
            calls.push(input);
            return { error };
          },
        },
      };
    },
  });
  return { calls, handler };
}

test("resend endpoint uses a non-persistent anon client and trusted redirect", async () => {
  const { calls, handler } = resendHandler();
  const response = await handler(
    resendRequest({ email: " person@example.test ", language: "pl" })
  );

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), {
    code: "CONFIRMATION_RESEND_ACCEPTED",
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(calls[0], [
    "https://project.supabase.test",
    "public-anon-key",
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  ]);
  assert.deepEqual(calls[1], {
    type: "signup",
    email: "person@example.test",
    options: {
      emailRedirectTo: "https://fitlifetool.test/auth/confirm?lang=pl",
    },
  });
});

test("resend endpoint keeps account and rate outcomes indistinguishable", async () => {
  for (const error of [
    null,
    { code: "user_not_found", message: "private" },
    { code: "email_exists", message: "private" },
    { code: "over_email_send_rate_limit", message: "private" },
  ]) {
    const { handler } = resendHandler(error);
    const response = await handler(
      resendRequest({ email: "person@example.test", language: "nl" })
    );
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), {
      code: "CONFIRMATION_RESEND_ACCEPTED",
    });
  }
});

test("resend endpoint reports only generic infrastructure unavailability", async () => {
  const { handler } = resendHandler({
    code: "request_timeout",
    message: "private provider detail",
  });
  const response = await handler(
    resendRequest({ email: "person@example.test", language: "en" })
  );
  const payload = await response.json();

  assert.equal(response.status, 503);
  assert.deepEqual(payload, { code: "CONFIRMATION_RESEND_UNAVAILABLE" });
  assert.doesNotMatch(JSON.stringify(payload), /private|provider|timeout/i);
});

test("resend endpoint treats returned retryable transport failures as unavailable", async () => {
  const { handler } = resendHandler(
    new AuthRetryableFetchError("private transport detail", 503)
  );
  const response = await handler(
    resendRequest({ email: "person@example.test", language: "en" })
  );
  const payload = await response.json();

  assert.equal(response.status, 503);
  assert.deepEqual(payload, { code: "CONFIRMATION_RESEND_UNAVAILABLE" });
  assert.doesNotMatch(JSON.stringify(payload), /private|transport|503/i);
});

test("resend endpoint closes thrown execution and missing configuration failures", async () => {
  const thrownHandler = createResendConfirmationHandler({
    configuration: () => ({
      supabaseUrl: "https://project.supabase.test",
      anonKey: "public-anon-key",
      siteUrl: "https://fitlifetool.test",
    }),
    createAnonClient: () => ({
      auth: {
        resend: async () => {
          throw new Error("private network detail");
        },
      },
    }),
  });
  const missingConfigHandler = createResendConfirmationHandler({
    configuration: () => ({}),
    createAnonClient: () => assert.fail("client must not be created"),
  });

  for (const handler of [thrownHandler, missingConfigHandler]) {
    const response = await handler(
      resendRequest({ email: "person@example.test", language: "en" })
    );
    const payload = await response.json();
    assert.equal(response.status, 503);
    assert.deepEqual(payload, { code: "CONFIRMATION_RESEND_UNAVAILABLE" });
    assert.doesNotMatch(JSON.stringify(payload), /private|network|config/i);
  }
});

test("resend endpoint rejects cross-origin, malformed, and extended requests", async () => {
  const { handler } = resendHandler();
  const responses = await Promise.all([
    handler(
      resendRequest(
        { email: "person@example.test", language: "en" },
        { origin: "https://attacker.test", "content-type": "application/json" }
      )
    ),
    handler(resendRequest("{")),
    handler(resendRequest({ email: "bad", language: "en" })),
    handler(
      resendRequest({
        email: "person@example.test",
        language: "en",
        userId: "caller-owned",
      })
    ),
  ]);

  assert.deepEqual(
    responses.map((response) => response.status),
    [403, 400, 400, 400]
  );
  assert.deepEqual(await responses[0].json(), { code: "ORIGIN_NOT_ALLOWED" });
  for (const response of responses.slice(1)) {
    assert.deepEqual(await response.json(), { code: "INVALID_REQUEST" });
  }
});

test("04D runtime boundaries contain no lookup, service role, or sensitive logging", async () => {
  const [api, callback, panel] = await Promise.all([
    read("app/api/auth/resend-confirmation/route.ts"),
    read("app/auth/confirm/route.ts"),
    read("app/components/auth/EmailConfirmationPanel.tsx"),
  ]);
  assert.doesNotMatch(api, /service_role|SUPABASE_SERVICE|\.from\(|admin\.|console\./);
  assert.doesNotMatch(callback, /\.message|console\.|returnTo|searchParams\.set\("(?:code|token_hash|type)"/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage|console\./);
  assert.match(panel, /EMAIL_CONFIRMATION_COOLDOWN_SECONDS/);
  assert.match(panel, /return \(\) => window\.clearTimeout\(timer\)/);
});
