import { execFileSync } from "node:child_process";
import test from "node:test";

const appRoot = new URL("../../", import.meta.url).href;
const helperUrl = new URL("./supabaseServer.ts", import.meta.url).href;
const routeUrl = new URL("../../api/auth/change-email/route.ts", import.meta.url).href;

// Each subprocess has an empty credential environment. Only the session
// adapter is stubbed; the admin helper and API route are really imported.
function runWithoutCredentials(
  assertions: string,
  options: { signedIn?: boolean; withUrl?: boolean } = {}
) {
  const sessionModule = `export async function createClient() {
    return { auth: { async getUser() {
      return { data: { user: ${options.signedIn ? '{ id: "11111111-1111-4111-8111-111111111111" }' : "null"} }, error: null };
    } } };
  }`;
  const sessionUrl = "data:text/javascript," + encodeURIComponent(sessionModule);
  const loader = `export function resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/supabaseServer") {
      return { url: ${JSON.stringify(sessionUrl)}, shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(specifier.slice(2) + ".ts", ${JSON.stringify(appRoot)}).href, context);
    }
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    return nextResolve(specifier, context);
  }`;
  const code = `
    import assert from "node:assert/strict";
    import { register } from "node:module";
    register(${JSON.stringify("data:text/javascript," + encodeURIComponent(loader))}, ${JSON.stringify(import.meta.url)});
    // This URL is only a negative-test fixture, never build configuration.
    // Missing credentials must throw before any client/network operation.
    ${options.withUrl ? 'process.env.NEXT_PUBLIC_SUPABASE_URL = "https://configuration-test.example";' : ""}
    const helperUrl = ${JSON.stringify(helperUrl)};
    const routeUrl = ${JSON.stringify(routeUrl)};
    ${assertions}
  `;
  execFileSync(
    process.execPath,
    ["--experimental-strip-types", "--input-type=module", "--eval", code],
    { env: { NODE_ENV: "test" }, stdio: ["ignore", "pipe", "pipe"], timeout: 15000 }
  );
}

test("admin helper and email route import without Supabase configuration", () => {
  runWithoutCredentials(`
    const helper = await import(helperUrl);
    const route = await import(routeUrl);
    assert.equal(typeof helper.createSupabaseServer, "function");
    assert.equal(typeof route.GET, "function");
    assert.equal(typeof route.POST, "function");
  `);
});

test("admin client use without a URL fails closed", () => {
  runWithoutCredentials(`
    const { createSupabaseServer } = await import(helperUrl);
    assert.throws(() => createSupabaseServer(), { message: "Missing NEXT_PUBLIC_SUPABASE_URL" });
  `);
});

test("admin client use without a service-role key fails closed", () => {
  runWithoutCredentials(`
    const { createSupabaseServer } = await import(helperUrl);
    assert.throws(() => createSupabaseServer(), { message: "Missing SUPABASE_SERVICE_ROLE_KEY" });
  `, { withUrl: true });
});

test("unauthenticated email-status requests stay 401 without admin configuration", () => {
  runWithoutCredentials(`
    const { GET } = await import(routeUrl);
    const response = await GET();
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { ok: false, code: "UNAUTHENTICATED" });
  `);
});

test("authenticated email-status requests hide missing admin configuration behind 503", () => {
  runWithoutCredentials(`
    const { GET } = await import(routeUrl);
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { ok: false, code: "STATUS_UNAVAILABLE" });
  `, { signedIn: true, withUrl: true });
});
