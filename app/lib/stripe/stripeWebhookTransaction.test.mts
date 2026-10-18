import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const webhook = await readFile(new URL("app/lib/stripe/webhook.ts", root), "utf8");
const route = await readFile(new URL("app/api/stripe/webhook/route.ts", root), "utf8");

test("mode mismatch is rejected before event claim", () => {
  const modeCheck = webhook.indexOf(
    "event.livemode !== getConfiguredStripeLivemode()"
  );
  const claim = webhook.indexOf('"claim_stripe_webhook_event"');
  assert.ok(modeCheck >= 0);
  assert.ok(claim > modeCheck);
  assert.match(webhook, /\^\(sk\|rk\)_live_/);
  assert.match(webhook, /\^\(sk\|rk\)_test_/);
});

test("claim generation and token are forwarded to completion", () => {
  assert.match(webhook, /processing_generation/);
  assert.match(webhook, /completeStripeWebhookEvent/);
  assert.match(webhook, /p_generation: lease\.generation/);
  assert.match(webhook, /p_lease_token: lease\.leaseToken/);
});

test("completed duplicates do not dispatch a handler", () => {
  assert.match(
    webhook,
    /claim\.decision === "duplicate_completed"\) return "completed"/
  );
  assert.ok(
    webhook.indexOf('claim.decision === "duplicate_completed"') <
      webhook.indexOf("processClaimedStripeEvent(event")
  );
});

test("crash recovery can retrieve abandoned work independently", () => {
  assert.match(webhook, /"claim_recoverable_stripe_webhook_event"/);
  assert.match(webhook, /stripe\.events\.retrieve\(id\)/);
  assert.match(webhook, /event\.id !== recovery\.event_id/);
  assert.match(route, /await recoverOneStripeWebhookEvent\(\)/);
});

test("logging excludes event bodies and raw errors", () => {
  assert.doesNotMatch(webhook, /console\.(?:log|error)\([^)]*error/);
  assert.doesNotMatch(webhook, /console\.(?:log|error)\([^)]*event/);
  assert.doesNotMatch(route, /console\.(?:log|error)\([^)]*body/);
  assert.doesNotMatch(route, /catch\s*\(\s*(?:err|error)/);
});
