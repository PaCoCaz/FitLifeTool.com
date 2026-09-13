import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { mock } from "node:test";
import { NextRequest } from "next/server";
import {
  AUTH_CONTEXT_COOKIE,
  parseAuthContextMarker,
  serializeAuthContextMarker,
} from "./sessionLifecycle.ts";

test("Phase 06 proxy uses bounded auth context only for expiry UX", async () => {
  const source = await read("proxy.ts");
  assert.match(source, /__Host-flt-auth-context|AUTH_CONTEXT_COOKIE/);
  assert.match(source, /buildSessionExpiredLoginPath/);
  assert.match(source, /RESOLUTION_FAILURE/);
  assert.doesNotMatch(source, /marker.*(?:userId|role|email)/i);
  assert.match(source, /markerAction = \{ value: "", remove: true \}/);
  const onboarding = await read("app/components/auth/OnboardingFlow.tsx");
  assert.match(onboarding, /getClientAuthRecovery/);
  assert.doesNotMatch(onboarding, /response\.status === 401[^]*router\.replace\("\/"\)/);
});
import { AuthSessionMissingError } from "@supabase/auth-js";
import { createPostLoginHandler } from "../../api/auth/post-login/route.ts";
import type { ServerAuthClient } from "./serverAuthState.ts";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

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

type AuthClientMode = "complete" | "incomplete" | "anonymous" | "failure";

function createAuthClient(mode: AuthClientMode): ServerAuthClient {
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
            : { id: "active-goal" },
      error: null,
    });
    return builder;
  }

  return {
    auth: {
      getUser: async () => {
        if (mode === "anonymous") {
          return {
            data: { user: null },
            error: new AuthSessionMissingError(),
          };
        }
        if (mode === "failure") {
          return {
            data: { user: null },
            error: new Error("private provider failure"),
          };
        }
        return {
          data: { user: { id: "verified-user" } },
          error: null,
        };
      },
    },
    from: (table: string) => query(table) as ReturnType<ServerAuthClient["from"]>,
  };
}

const endpointUrl = "https://fitlifetool.test/api/auth/post-login";

function endpointRequest(
  body = "{}",
  headers: Record<string, string> = {
    origin: "https://fitlifetool.test",
    "content-type": "application/json",
  }
) {
  return new Request(endpointUrl, { method: "POST", headers, body });
}

async function responsePayload(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

function assertSecurityHeaders(response: Response) {
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("vary"), "Cookie");
}

test("proxy consumes the shared server state and preserves safe anonymous deep links", async () => {
  const source = await read("proxy.ts");

  assert.match(source, /resolveServerAuthState\(supabase\)/);
  assert.match(source, /kind === "ANONYMOUS"/);
  assert.match(source, /getSafeProtectedReturnTo/);
  assert.match(source, /new URL\("\/login"/);
  assert.match(source, /searchParams\.set\("returnTo", returnTo\)/);
  assert.match(source, /requestedLanguage \?\? "en"/);
});

test("proxy enforces incomplete and complete auth-entry behavior", async () => {
  const source = await read("proxy.ts");

  assert.match(source, /AUTHENTICATED_ONBOARDING_INCOMPLETE/);
  assert.match(source, /return isOnboarding \? next\(\) : redirect\("\/onboarding"\)/);
  assert.match(source, /isOnboarding \|\| authorizationPathname === "\/register"/);
  assert.match(source, /return redirect\("\/dashboard"\)/);
  assert.match(source, /authorizationPathname === "\/login"/);
  assert.match(source, /resolvePostLoginDestination/);
  const registerGuard = source.slice(
    source.indexOf('if (isOnboarding || authorizationPathname === "/register")'),
    source.indexOf('if (authorizationPathname === "/login")')
  );
  assert.doesNotMatch(registerGuard, /returnTo/);
});

test("Handbook role authorization remains separate and follows onboarding", async () => {
  const source = await read("proxy.ts");
  const incompleteGate = source.indexOf("AUTHENTICATED_ONBOARDING_INCOMPLETE");
  const roleGate = source.indexOf("// role check");

  assert.ok(incompleteGate >= 0 && roleGate > incompleteGate);
  assert.match(source, /isRouteWithin\(authorizationPathname, "\/handbook"\)/);
  assert.match(source, /select\("role"\)/);
});

test("authenticated profile locale is forwarded without metadata authority", async () => {
  const [proxySource, resolverSource] = await Promise.all([
    read("proxy.ts"),
    read("app/lib/auth/serverAuthState.ts"),
  ]);

  assert.match(proxySource, /requestHeaders\.set\("x-interface-locale", authState\.interfaceLanguage\)/);
  assert.match(resolverSource, /asAppLanguage\(profile\?\.language\)/);
  assert.doesNotMatch(resolverSource, /user_metadata|app_metadata|getSession|getClaims/);
});

test("all auth responses preserve queued Supabase cookie writes", async () => {
  const source = await read("proxy.ts");

  assert.match(source, /const pendingCookies: PendingAuthCookie\[\] = \[\]/);
  assert.match(source, /request\.cookies\.set\(name, value\)/);
  assert.match(source, /pendingCookies\.push\(\{ name, value, options \}\)/);
  assert.match(source, /applyPendingAuthCookies\(response, pendingCookies\)/);
  assert.match(source, /finalize\(NextResponse\.redirect/);
  assert.match(source, /finalize\(\s*NextResponse\.json/);
});

test("Phase 06 proxy behavior preserves cookies and consumes expiry context", async () => {
  let mode: AuthClientMode = "complete";
  let emailChangeRpcData: unknown = [];
  let localSignOutCalls = 0;
  let applicationQueryCalls = 0;
  const moduleMock = mock.module("@supabase/ssr", {
    namedExports: {
      createServerClient(_url: string, _key: string, options: {
        cookies: { setAll(values: Array<{ name: string; value: string; options?: Record<string, unknown> }>): void };
      }) {
        const client = createAuthClient(mode);
        const originalFrom = client.from;
        client.from = (table: string) => {
          applicationQueryCalls += 1;
          return originalFrom(table);
        };
        Object.assign(client, {
          rpc: async () => ({ data: emailChangeRpcData, error: null }),
        });
        Object.assign(client.auth, {
          signOut: async () => {
            localSignOutCalls += 1;
            return { error: null };
          },
        });
        const originalGetUser = client.auth.getUser;
        client.auth.getUser = async () => {
          options.cookies.setAll([{ name: "sb-refresh", value: "refreshed", options: { path: "/", httpOnly: true } }]);
          return originalGetUser();
        };
        return client;
      },
    },
  });

  try {
    const { proxy } = await import("../../../proxy.ts?phase06-behavior");
    const request = (path: string, marker?: string, method = "GET") => new NextRequest(
      `https://fitlifetool.test${path}`,
      { method, ...(marker ? { headers: { cookie: `${AUTH_CONTEXT_COOKIE}=${marker}` } } : {}) }
    );

    mode = "complete";
    const authenticated = await proxy(request("/dashboard"));
    assert.equal(authenticated.status, 200);
    assert.equal(authenticated.cookies.get("sb-refresh")?.value, "refreshed");
    assert.deepEqual(
      parseAuthContextMarker(authenticated.cookies.get(AUTH_CONTEXT_COOKIE)?.value),
      { version: 1, onboarding: "complete", locale: "nl" }
    );

    emailChangeRpcData = [{
      status: "requesting",
      generation: 1,
      requires_reauthentication: true,
      pre_provider_recovery_available: true,
    }];
    applicationQueryCalls = 0;
    assert.equal((await proxy(request("/settings"))).status, 200);
    assert.equal((await proxy(request("/api/auth/change-email", undefined, "POST"))).status, 200);
    assert.equal(applicationQueryCalls, 0);
    assert.equal((await proxy(request("/dashboard"))).status, 307);
    assert.equal(applicationQueryCalls, 2);

    emailChangeRpcData = [{
      status: "requesting",
      generation: 1,
      requires_reauthentication: true,
      pre_provider_recovery_available: false,
    }];
    assert.equal((await proxy(request("/settings", undefined, "POST"))).status, 307);
    assert.equal((await proxy(request("/api/auth/change-email"))).status, 409);

    emailChangeRpcData = [{
      status: "requesting",
      generation: 1,
      requires_reauthentication: true,
    }];
    assert.equal((await proxy(request("/settings"))).status, 503);

    localSignOutCalls = 0;
    emailChangeRpcData = [{
      status: "completed",
      generation: 2,
      requires_reauthentication: true,
      pre_provider_recovery_available: false,
    }];
    const blockedPage = await proxy(request("/dashboard"));
    const blockedPageLocation = new URL(blockedPage.headers.get("location")!);
    assert.equal(blockedPage.status, 307);
    assert.equal(blockedPageLocation.pathname, "/login");
    assert.equal(blockedPageLocation.searchParams.get("auth_notice"), "email_changed");
    assert.equal(localSignOutCalls, 1);

    const blockedOnboarding = await proxy(request("/onboarding"));
    assert.equal(blockedOnboarding.status, 307);
    assert.equal(new URL(blockedOnboarding.headers.get("location")!).pathname, "/login");
    assert.equal(localSignOutCalls, 2);

    const blockedApi = await proxy(request("/api/profile/subscription"));
    assert.equal(blockedApi.status, 409);
    assert.deepEqual(await responsePayload(blockedApi), {
      code: "EMAIL_CHANGE_REAUTH_REQUIRED",
    });
    assert.equal(localSignOutCalls, 2);
    emailChangeRpcData = [];

    mode = "anonymous";
    const completeMarker = serializeAuthContextMarker("complete", "fr");
    const expiredComplete = await proxy(request("/settings?tab=security", completeMarker));
    const completeLocation = new URL(expiredComplete.headers.get("location")!);
    assert.equal(expiredComplete.status, 307);
    assert.equal(completeLocation.pathname, "/login");
    assert.equal(completeLocation.searchParams.get("lang"), "fr");
    assert.equal(completeLocation.searchParams.get("auth_notice"), "session_expired");
    assert.equal(completeLocation.searchParams.get("returnTo"), "/settings?tab=security");
    assert.equal(expiredComplete.cookies.get("sb-refresh")?.value, "refreshed");
    assert.equal(expiredComplete.cookies.get(AUTH_CONTEXT_COOKIE)?.value, "");
    assert.equal(expiredComplete.cookies.get(AUTH_CONTEXT_COOKIE)?.maxAge, 0);

    const afterConsumption = await proxy(request("/settings?tab=security"));
    const ordinaryLocation = new URL(afterConsumption.headers.get("location")!);
    assert.equal(ordinaryLocation.pathname, "/login");
    assert.equal(ordinaryLocation.searchParams.get("auth_notice"), null);

    const incompleteMarker = serializeAuthContextMarker("incomplete", "de");
    const expiredIncomplete = await proxy(request("/onboarding", incompleteMarker));
    const incompleteLocation = new URL(expiredIncomplete.headers.get("location")!);
    assert.equal(incompleteLocation.searchParams.get("lang"), "de");
    assert.equal(incompleteLocation.searchParams.get("auth_notice"), "session_expired");
    assert.equal(incompleteLocation.searchParams.get("returnTo"), null);
    assert.equal(expiredIncomplete.cookies.get(AUTH_CONTEXT_COOKIE)?.value, "");

    const malformed = await proxy(request("/dashboard", encodeURIComponent('{"version":2,"onboarding":"complete","locale":"en"}')));
    const malformedLocation = new URL(malformed.headers.get("location")!);
    assert.equal(malformedLocation.searchParams.get("auth_notice"), null);
    assert.equal(malformed.cookies.get(AUTH_CONTEXT_COOKIE)?.value, "");

    const tamperedPostLogin = createPostLoginHandler(async () => createAuthClient("incomplete"));
    const postLoginResponse = await tamperedPostLogin(endpointRequest(JSON.stringify({ returnTo: "/settings" })));
    assert.deepEqual(await responsePayload(postLoginResponse), { destination: "/onboarding" });
  } finally {
    moduleMock.restore();
  }
});

test("post-login API is same-origin, closed-input, no-store, and generic", async () => {
  const [source, destinationSource] = await Promise.all([
    read("app/api/auth/post-login/route.ts"),
    read("app/lib/auth/postLoginDestination.ts"),
  ]);

  assert.match(source, /export const POST = createPostLoginHandler\(createClient, enforceEmailChangeGuard\)/);
  assert.match(source, /request\.headers\.get\("origin"\) !== requestOrigin/);
  assert.match(source, /key !== "returnTo"/);
  assert.match(source, /resolveServerAuthState\(supabase\)/);
  assert.match(source, /resolvePostLoginDestination\(state, body\.returnTo\)/);
  assert.match(source, /private, no-store/);
  assert.match(source, /Vary: "Cookie"/);
  assert.match(source, /AUTHENTICATION_REQUIRED/);
  assert.match(destinationSource, /AUTH_STATE_UNAVAILABLE/);
  assert.doesNotMatch(source, /\.message|console\./);
});

test("post-login endpoint returns a safe destination for a complete user", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("complete"));
  const response = await handler(endpointRequest(JSON.stringify({
    returnTo: "/settings?tab=security",
  })));

  assert.equal(response.status, 200);
  assert.deepEqual(await responsePayload(response), {
    destination: "/settings?tab=security",
  });
  assertSecurityHeaders(response);
});

test("post-login dynamically enforces only the current Email Change session", async () => {
  const blocked = createPostLoginHandler(
    async () => createAuthClient("complete"),
    async () => "pending"
  );
  const unavailable = createPostLoginHandler(
    async () => createAuthClient("complete"),
    async () => "unavailable"
  );

  const blockedResponse = await blocked(endpointRequest());
  assert.equal(blockedResponse.status, 409);
  assert.deepEqual(await responsePayload(blockedResponse), {
    code: "EMAIL_CHANGE_REAUTH_REQUIRED",
  });

  const unavailableResponse = await unavailable(endpointRequest());
  assert.equal(unavailableResponse.status, 503);
  assert.deepEqual(await responsePayload(unavailableResponse), {
    code: "AUTH_STATE_UNAVAILABLE",
  });
});

test("post-login endpoint forces incomplete users to onboarding", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("incomplete"));
  const response = await handler(endpointRequest(JSON.stringify({
    returnTo: "/handbook/doc-l3-0001",
  })));

  assert.equal(response.status, 200);
  assert.deepEqual(await responsePayload(response), { destination: "/onboarding" });
  assertSecurityHeaders(response);
});

test("post-login endpoint reports anonymous and resolution failure generically", async () => {
  const anonymousHandler = createPostLoginHandler(
    async () => createAuthClient("anonymous")
  );
  const failureHandler = createPostLoginHandler(
    async () => createAuthClient("failure")
  );
  const anonymousResponse = await anonymousHandler(endpointRequest());
  const failureResponse = await failureHandler(endpointRequest());

  assert.equal(anonymousResponse.status, 401);
  assert.deepEqual(await responsePayload(anonymousResponse), {
    code: "AUTHENTICATION_REQUIRED",
  });
  assertSecurityHeaders(anonymousResponse);
  assert.equal(failureResponse.status, 503);
  assert.deepEqual(await responsePayload(failureResponse), {
    code: "AUTH_STATE_UNAVAILABLE",
  });
  assertSecurityHeaders(failureResponse);
});

test("post-login endpoint closes server client initialization failures", async () => {
  const handler = createPostLoginHandler(async () => {
    throw new Error("private Supabase initialization detail");
  });
  const response = await handler(endpointRequest());
  const payload = await responsePayload(response);

  assert.equal(response.status, 503);
  assert.deepEqual(payload, { code: "AUTH_STATE_UNAVAILABLE" });
  assert.doesNotMatch(JSON.stringify(payload), /Supabase|initialization|private/i);
  assertSecurityHeaders(response);
});

test("post-login endpoint rejects missing and invalid origins", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("complete"));
  for (const headers of [
    { "content-type": "application/json" },
    {
      origin: "https://attacker.test",
      "content-type": "application/json",
    },
  ]) {
    const response = await handler(endpointRequest("{}", headers));
    assert.equal(response.status, 403);
    assert.deepEqual(await responsePayload(response), {
      code: "ORIGIN_NOT_ALLOWED",
    });
    assertSecurityHeaders(response);
  }
});

test("post-login endpoint rejects invalid content and malformed JSON", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("complete"));
  const invalidType = await handler(endpointRequest("{}", {
    origin: "https://fitlifetool.test",
    "content-type": "text/plain",
  }));
  const malformed = await handler(endpointRequest("{"));

  for (const response of [invalidType, malformed]) {
    assert.equal(response.status, 400);
    assert.deepEqual(await responsePayload(response), { code: "INVALID_REQUEST" });
    assertSecurityHeaders(response);
  }
});

test("post-login endpoint rejects unknown body fields", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("complete"));
  const response = await handler(endpointRequest(JSON.stringify({
    returnTo: "/settings",
    userId: "caller-controlled",
  })));

  assert.equal(response.status, 400);
  assert.deepEqual(await responsePayload(response), { code: "INVALID_REQUEST" });
  assertSecurityHeaders(response);
});

test("post-login endpoint falls back from unsafe complete-user returnTo", async () => {
  const handler = createPostLoginHandler(async () => createAuthClient("complete"));
  for (const returnTo of [
    "https://attacker.test",
    "//attacker.test",
    "/dashboard%2fadmin",
  ]) {
    const response = await handler(endpointRequest(JSON.stringify({ returnTo })));
    assert.equal(response.status, 200);
    assert.deepEqual(await responsePayload(response), { destination: "/dashboard" });
    assertSecurityHeaders(response);
  }
});

test("LoginForm delegates destination resolution and validates the server response", async () => {
  const source = await read("app/components/auth/LoginForm.tsx");

  assert.match(source, /fetch\("\/api\/auth\/post-login"/);
  assert.match(source, /JSON\.stringify\(returnTo \? \{ returnTo \} : \{\}\)/);
  assert.match(source, /isAllowedPostLoginDestination\(destination\)/);
  assert.match(source, /window\.location\.assign\(destination\)/);
  assert.doesNotMatch(source, /window\.location\.assign\("\/dashboard"\)/);
  assert.doesNotMatch(source, /signInError\.message|console\./);
});

test("onboarding state uses authenticated RLS through the shared resolver", async () => {
  const source = await read("app/api/onboarding/state/route.ts");

  assert.match(source, /createClient\(\)/);
  assert.match(source, /resolveServerAuthState\(await createClient\(\)\)/);
  assert.match(source, /state\.onboardingStep/);
  assert.match(source, /state\.profile/);
  assert.doesNotMatch(source, /createSupabaseServer|SUPABASE_SERVICE_ROLE_KEY|admin\.from/);
});

test("registration and the public auth modal remain unchanged integration consumers", async () => {
  const [registration, modal, publicProvider] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/components/auth/RegisterModal.tsx"),
    read("app/components/public/PublicAuthModalProvider.tsx"),
  ]);

  assert.match(registration, /auth\.signUp/);
  assert.match(modal, /<LoginForm/);
  assert.match(modal, /<RegisterStep/);
  assert.match(publicProvider, /<RegisterModal/);
  assert.match(registration, /className="mt-2 w-full rounded border/);
});

test("proxy and post-login enforce durable Email Change reauthentication state", async () => {
  const [proxy, postLogin, login, migration] = await Promise.all([
    read("proxy.ts"), read("app/api/auth/post-login/route.ts"), read("app/components/auth/LoginForm.tsx"),
    read("supabase/migrations/20260908100000_add_auth_email_change_flow.sql"),
  ]);
  assert.match(proxy, /get_own_auth_email_change_state/);
  assert.match(proxy, /readOwnEmailChangeSessionState/);
  assert.match(proxy, /isProtected \|\| isOnboarding \|\| isProtectedApi/);
  assert.match(proxy, /apiFailure\("EMAIL_CHANGE_REAUTH_REQUIRED", 409\)/);
  assert.match(proxy, /signOut\(\{ scope: "local" \}\)/);
  assert.match(postLogin, /readOwnEmailChangeSessionState/);
  assert.doesNotMatch(postLogin, /acknowledge_auth_email_change_reauthentication/);
  assert.match(postLogin, /EMAIL_CHANGE_REAUTH_REQUIRED/);
  assert.match(login, /fetch\("\/auth\/logout"/);
  assert.match(login, /notifyClientSessionEvent\("logout"\)/);
  const begin = migration.slice(
    migration.indexOf("create function public.begin_auth_email_change_request"),
    migration.indexOf("create function public.accept_auth_email_change_request")
  );
  assert.doesNotMatch(begin, /canonical_changed_at = null/);
  assert.match(begin, /canonical_changed_generation = null/);
  assert.match(
    migration,
    /request_status = 'request_failed' and change_epoch is null/
  );
});
