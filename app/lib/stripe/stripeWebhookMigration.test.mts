import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL(
  "../../../supabase/migrations/20261017100000_harden_stripe_webhook_transactionality.sql",
  import.meta.url
), "utf8");

test("migration is atomic and installs durable webhook state", () => {
  assert.match(sql, /^begin;/);
  assert.match(sql, /commit;\s*$/);
  for (const value of [
    "processing", "completed", "retryable", "manual_review",
    "attempt_count", "processing_generation", "lease_token",
    "lease_expires_at", "next_retry_at", "payload_sha256",
  ]) assert.match(sql, new RegExp(value));
});

test("migration exposes claim, recovery, failure and atomic apply contracts", () => {
  for (const fn of [
    "claim_stripe_webhook_event",
    "claim_recoverable_stripe_webhook_event",
    "fail_stripe_webhook_event",
    "complete_stripe_webhook_event",
    "apply_stripe_subscription_snapshot",
    "apply_stripe_product_snapshot",
    "apply_stripe_price_snapshot",
    "apply_stripe_customer_snapshot",
    "apply_stripe_checkout_mapping",
    "reconcile_stripe_customer_entitlements",
  ]) assert.match(sql, new RegExp("create function public\\." + fn + "\\("));
  assert.match(sql, /for update skip locked/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /hashtextextended\('stripe_event:' \|\| p_event_id,0\)/);
  assert.match(sql, /nextval\('public\.stripe_webhook_processing_generation_seq'\)/);
});

test("snapshot freshness is fenced beyond claim generation", () => {
  assert.match(sql, /p_snapshot_is_current/);
  assert.match(sql, /last_stripe_event_created_at/);
  assert.match(sql, /last_stripe_event_id/);
  assert.match(sql, />\(p_stripe_event_created_at,p_event_id\)/);
  assert.match(sql, /last_webhook_generation>p_generation/);
});

test("security functions are definer-only with empty search paths", () => {
  assert.equal(
    (sql.match(/security definer set search_path=''/g) ?? []).length,
    10
  );
  assert.match(sql, /revoke all on table public\.stripe_events from public,anon,authenticated/);
  assert.match(sql, /grant execute on function %s to service_role/);
  assert.doesNotMatch(sql, /raw_payload|event_payload|customer_email/);
});

test("migration fails closed on schema and mapping prerequisites", () => {
  assert.match(sql, /Required Stripe relation is missing/);
  assert.match(sql, /Canonical customer uniqueness is missing/);
  assert.match(sql, /Required customer mapping function is missing/);
});
