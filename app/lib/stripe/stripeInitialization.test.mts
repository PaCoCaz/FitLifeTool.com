import { execFileSync } from "node:child_process";
import test from "node:test";

const appRoot = new URL("../../", import.meta.url).href;

function withoutCredentials(assertions: string, unauthenticated = false) {
  const sessionUrl = "data:text/javascript," + encodeURIComponent(
    "export async function createSupabaseServerUser() { return { auth: { async getUser() { return { data: { user: null }, error: null }; } } }; }"
  );
  const loader = `export function resolve(specifier, context, nextResolve) {
    // Match Next's server-layer alias; application modules and credential checks remain real.
    if (specifier === "server-only") {
      return nextResolve("next/dist/compiled/server-only/empty.js", context);
    }
    if (${unauthenticated} && specifier === "@/lib/supabase/supabaseServerUser") {
      return { url: ${JSON.stringify(sessionUrl)}, shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(specifier.slice(2) + ".ts", ${JSON.stringify(appRoot)}).href, context);
    }
    if (specifier.startsWith(".") && context.parentURL?.startsWith(${JSON.stringify(appRoot)}) && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
      return nextResolve(new URL(specifier + ".ts", context.parentURL).href, context);
    }
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    if (specifier === "next/headers") return nextResolve("next/headers.js", context);
    return nextResolve(specifier, context);
  }`;
  const code = `
    import assert from "node:assert/strict";
    import { register } from "node:module";
    register(${JSON.stringify("data:text/javascript," + encodeURIComponent(loader))}, ${JSON.stringify(import.meta.url)});
    const appRoot = ${JSON.stringify(appRoot)};
    ${assertions}
  `;
  // No .env loader or inherited credentials: these tests cannot call Stripe.
  execFileSync(process.execPath,
    ["--experimental-strip-types", "--input-type=module", "--eval", code],
    { env: { NODE_ENV: "test" }, stdio: ["ignore", "pipe", "pipe"], timeout: 15000 }
  );
}

test("Stripe module and all affected API routes import without credentials", () => {
  withoutCredentials(`
    const { getStripe } = await import(new URL("lib/stripe/stripe.ts", appRoot));
    assert.equal(typeof getStripe, "function");
    for (const route of [
      "api/stripe/change-plan/route.ts", "api/stripe/checkout/route.ts",
      "api/stripe/portal/route.ts", "api/stripe/portal-update/route.ts",
      "api/stripe/webhook/route.ts", "api/cron/auth-email-sync/route.ts"
    ]) {
      const handlers = await import(new URL(route, appRoot));
      assert.equal(typeof (handlers.POST ?? handlers.GET), "function");
    }
  `);
});

test("runtime Stripe use fails closed without a key, including repeated attempts", () => {
  withoutCredentials(`
    const { getStripe } = await import(new URL("lib/stripe/stripe.ts", appRoot));
    for (let attempt = 0; attempt < 2; attempt++) {
      assert.throws(() => getStripe(), { message: "Missing STRIPE_SECRET_KEY" });
    }
  `);
});

test("change-plan keeps missing-price rejection independent of Stripe credentials", () => {
  withoutCredentials(`
    const { POST } = await import(new URL("api/stripe/change-plan/route.ts", appRoot));
    const response = await POST(new Request("https://fitlifetool.example/api/stripe/change-plan", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}"
    }));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Missing priceId" });
  `);
});

test("change-plan keeps authentication rejection before Stripe initialization", () => {
  withoutCredentials(`
    const { POST } = await import(new URL("api/stripe/change-plan/route.ts", appRoot));
    const response = await POST(new Request("https://fitlifetool.example/api/stripe/change-plan", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ priceId: "price_fixture" })
    }));
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "No user" });
  `, true);
});

test("webhook keeps rejecting missing signatures without initializing Stripe", () => {
  withoutCredentials(`
    const { POST } = await import(new URL("api/stripe/webhook/route.ts", appRoot));
    const response = await POST(new Request("https://fitlifetool.example/api/stripe/webhook", { method: "POST", body: "{}" }));
    assert.equal(response.status, 400);
    assert.equal(await response.text(), "Missing signature");
  `);
});

test("webhook signing-secret validation stays at runtime and fails closed", () => {
  withoutCredentials(`
    const { verifyStripeEvent } = await import(new URL("lib/stripe/webhook.ts", appRoot));
    assert.throws(() => verifyStripeEvent("{}", "invalid-signature"), { message: "Missing STRIPE_WEBHOOK_SECRET" });
  `);
});

test("cron authentication remains required before any client initialization", () => {
  withoutCredentials(`
    const { GET } = await import(new URL("api/cron/auth-email-sync/route.ts", appRoot));
    const response = await GET(new Request("https://fitlifetool.example/api/cron/auth-email-sync"));
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { ok: false });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  `);
});
