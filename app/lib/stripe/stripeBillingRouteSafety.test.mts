import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

test("checkout customer creation is provider-idempotent before mapping", async () => {
  const source = await read("app/api/stripe/checkout/route.ts");
  assert.match(source, /idempotencyKey: .*fitlifetool-customer-/);
  assert.ok(
    source.indexOf("idempotencyKey") <
      source.indexOf('"establish_customer_mapping"')
  );
});

test("direct subscription routes require exactly one subscription", async () => {
  for (const path of [
    "app/api/stripe/change-plan/route.ts",
    "app/api/stripe/portal-update/route.ts",
  ]) {
    const source = await read(path);
    assert.match(source, /subscriptions\?\.length !== 1/);
    assert.match(source, /status: 409/);
  }
});

test("invoice events use the current provider subscription snapshot", async () => {
  const source = await read("app/lib/stripe/handlers/handleInvoice.ts");
  assert.match(source, /retrieveSubscription/);
  assert.match(source, /snapshotIsCurrent: true/);
  assert.doesNotMatch(source, /invoice\.paid[\s\S]*status\s*=\s*"active"/);
});
