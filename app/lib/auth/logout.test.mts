import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { createLogoutHandler, type LogoutClient } from "./logout.ts";
import { serializeAuthContextMarker } from "./sessionLifecycle.ts";
import { readFile } from "node:fs/promises";

const endpoint = "https://fitlifetool.test/auth/logout";
function request(body: unknown = { language: "nl" }, headers = { origin: "https://fitlifetool.test", "content-type": "application/json" }) { return new Request(endpoint, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) }); }
function client(options: { signOutError?: unknown; signOutThrows?: boolean; user?: unknown; readError?: unknown; readThrows?: boolean } = {}) {
  const calls: unknown[] = [];
  return { calls, value: { auth: { signOut: async (input: unknown) => { calls.push(input); if (options.signOutThrows) throw new Error("provider secret"); return { error: options.signOutError ?? null }; }, getUser: async () => { if (options.readThrows) throw new Error("network"); return { data: { user: options.user ?? null }, error: options.readError ?? null }; } } } as LogoutClient };
}
async function run(options: Parameters<typeof client>[0] = {}, body?: unknown, headers?: Record<string,string>) { const current = client(options); let cleared = 0; const handler = createLogoutHandler(async () => current.value, () => serializeAuthContextMarker("complete", "fr"), () => { cleared += 1; }); const response = await handler(request(body, headers as never)); return { current, cleared, response, json: await response.json() }; }

test("logout validates same origin, JSON and a closed locale body", async () => {
  assert.equal((await run({}, {}, { origin: "https://evil.test", "content-type": "application/json" })).response.status, 403);
  assert.equal((await run({}, {}, { "content-type": "application/json" } as never)).response.status, 403);
  assert.equal((await run({}, "{}", { origin: "https://fitlifetool.test", "content-type": "text/plain" })).response.status, 400);
  assert.equal((await run({}, "{", { origin: "https://fitlifetool.test", "content-type": "application/json" })).response.status, 400);
  assert.equal((await run({}, { language: "en", returnTo: "/dashboard" })).response.status, 400);
  assert.equal((await run({}, { language: "es" })).response.status, 400);
});

test("logout is local-scope and succeeds only after terminal anonymous readback", async () => {
  for (const options of [{}, { signOutError: new Error("private") }, { signOutThrows: true }]) {
    const result = await run(options, { language: "pl" });
    assert.deepEqual(result.current.calls, [{ scope: "local" }]);
    assert.equal(result.response.status, 200);
    assert.deepEqual(result.json, { code: "LOGOUT_COMPLETED", destination: "/pl" });
    assert.equal(result.cleared, 1);
    assert.equal(result.response.headers.get("cache-control"), "private, no-store");
  }
  const markerFallback = await run({}, {});
  assert.deepEqual(markerFallback.json, { code: "LOGOUT_COMPLETED", destination: "/fr" });
});

test("unresolved logout fails closed, retains marker and leaks no provider detail", async () => {
  for (const options of [{ signOutError: new Error("private"), user: { id: "still" } }, { signOutThrows: true, readError: new Error("network") }, { readThrows: true }]) {
    const result = await run(options);
    assert.equal(result.response.status, 503);
    assert.equal(result.cleared, 0);
    assert.doesNotMatch(JSON.stringify(result.json), /private|network|provider|still/);
  }
});

test("route and active UI delegate to the canonical server-owned logout", async () => {
  const root = new URL("../../../", import.meta.url);
  const route = await readFile(new URL("app/auth/logout/route.ts", root), "utf8");
  const avatar = await readFile(new URL("app/components/layout/AvatarMenu.tsx", root), "utf8");
  const onboarding = await readFile(new URL("app/onboarding/page.tsx", root), "utf8");
  assert.match(route, /createLogoutHandler/);
  assert.match(avatar, /<LogoutControl/);
  assert.match(onboarding, /<LogoutControl/);
  assert.doesNotMatch(avatar + onboarding, /supabase\.auth\.signOut/);
});

test("logout route preserves auth-cookie mutations and deletes marker only on terminal success", async () => {
  const values = new Map<string, string>([["__Host-flt-auth-context", serializeAuthContextMarker("complete", "nl")]]);
  const writes: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];
  const cookieStore = {
    get(name: string) { const value = values.get(name); return value == null ? undefined : { name, value }; },
    set(name: string, value: string, options?: Record<string, unknown>) {
      values.set(name, value);
      writes.push({ name, value, options });
    },
  };
  let terminalUser: unknown | null = null;
  const headersMock = mock.module("next/headers", { namedExports: { cookies: async () => cookieStore } });
  const clientMock = mock.module("@/lib/supabaseServer", {
    namedExports: {
      createClient: async () => ({
        auth: {
          signOut: async () => {
            cookieStore.set("sb-auth", "", { path: "/", maxAge: 0 });
            return { error: null };
          },
          getUser: async () => ({ data: { user: terminalUser }, error: null }),
        },
      }),
    },
  });

  try {
    const { POST } = await import("../../auth/logout/route.ts?phase06-cookie-behavior");
    const success = await POST(request({ language: "nl" }));
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { code: "LOGOUT_COMPLETED", destination: "/nl" });
    assert.ok(writes.some((write) => write.name === "sb-auth" && write.options?.maxAge === 0));
    assert.ok(writes.some((write) => write.name === "__Host-flt-auth-context" && write.value === "" && write.options?.maxAge === 0));

    writes.length = 0;
    values.set("__Host-flt-auth-context", serializeAuthContextMarker("complete", "nl"));
    terminalUser = { id: "still-authenticated" };
    const unresolved = await POST(request({ language: "nl" }));
    assert.equal(unresolved.status, 503);
    assert.deepEqual(await unresolved.json(), { code: "LOGOUT_UNAVAILABLE" });
    assert.equal(writes.some((write) => write.name === "__Host-flt-auth-context"), false);
  } finally {
    clientMock.restore();
    headersMock.restore();
  }
});
