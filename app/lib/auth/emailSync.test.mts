import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  AUTH_EMAIL_SYNC_MAX_ATTEMPTS,
  processAuthEmailSyncJob,
  type AuthEmailSyncJob,
  type EmailSyncDependencies,
} from "./emailSync.ts";

const USER = "11111111-1111-4111-8111-111111111111";
const job: AuthEmailSyncJob = { user_id: USER, generation: 2, lease_token: "lease", attempt_count: 1 };
const projectRoot = new URL("../../../", import.meta.url);

function dependencies(overrides: Partial<EmailSyncDependencies> = {}) {
  const calls = { authReads: 0, local: 0, stripe: 0, stripeReads: 0, completed: [] as string[], failed: [] as Array<[string, boolean]>, reconciled: 0 };
  const base: EmailSyncDependencies = {
    async getConfirmedAuthIdentity() { calls.authReads += 1; return { id: USER, email: "confirmed@example.test" }; },
    async getCustomerMapping() { return { id: "local", user_id: USER, stripe_customer_id: "cus_valid" }; },
    async findStripeCustomerIdsByUserId() { return []; },
    async updateLocalCustomerEmail() { calls.local += 1; return true; },
    async getStripeCustomer() { calls.stripeReads += 1; return { id: "cus_valid", deleted: false, email: "old@example.test", metadataUserId: USER }; },
    async updateStripeCustomerEmail() { calls.stripe += 1; },
    async isLeaseCurrent() { return true; },
    async markLocalSynced() { return true; },
    async complete(_job, reason) { calls.completed.push(reason); return true; },
    async fail(_job, code, retryable) { calls.failed.push([code, retryable]); return true; },
    async requestReconciliation() { calls.reconciled += 1; },
    ...overrides,
  };
  return { base, calls };
}

test("confirmed Auth email is the only value written locally and to the matching Stripe customer", async () => {
  const state = dependencies();
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(state.calls.local, 1);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an already-equal Stripe email completes without an update call", async () => {
  const state = dependencies({
    async getStripeCustomer() {
      state.calls.stripeReads += 1;
      return { id: "cus_valid", deleted: false, email: "confirmed@example.test", metadataUserId: USER };
    },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(state.calls.stripe, 0);
  assert.equal(state.calls.stripeReads, 1);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an ambiguous Stripe timeout with a matching readback is treated as success", async () => {
  let reads = 0;
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return {
        id: "cus_valid",
        deleted: false,
        email: reads === 1 ? "old@example.test" : "confirmed@example.test",
        metadataUserId: USER,
      };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("timeout after provider acceptance");
    },
  });

  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed");
  assert.equal(reads, 2);
  assert.equal(state.calls.authReads, 3);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, []);
  assert.deepEqual(state.calls.completed, ["synced"]);
});

test("an ambiguous Stripe timeout with a mismatching readback remains retryable", async () => {
  let reads = 0;
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return { id: "cus_valid", deleted: false, email: "old@example.test", metadataUserId: USER };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("timeout without provider acceptance");
    },
  });

  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.equal(reads, 2);
  assert.equal(state.calls.authReads, 3);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, [["STRIPE_SYNC_FAILED", true]]);
});

test("the maximum attempt moves repeated Stripe failure to terminal manual review", async () => {
  let reads = 0;
  const exhaustedJob = {
    ...job,
    attempt_count: AUTH_EMAIL_SYNC_MAX_ATTEMPTS,
  };
  const state = dependencies({
    async getStripeCustomer() {
      reads += 1;
      return { id: "cus_valid", deleted: false, email: "old@example.test", metadataUserId: USER };
    },
    async updateStripeCustomerEmail() {
      state.calls.stripe += 1;
      throw new Error("persistent provider failure");
    },
  });

  assert.equal(
    await processAuthEmailSyncJob(state.base, exhaustedJob),
    "manual_review"
  );
  assert.equal(reads, 2);
  assert.equal(state.calls.stripe, 1);
  assert.deepEqual(state.calls.failed, [
    ["STRIPE_SYNC_FAILED_RETRY_EXHAUSTED", false],
  ]);
});

test("absence of a local customer is a completed no-billing relation", async () => {
  const state = dependencies({ async getCustomerMapping() { return null; } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "completed_no_mapping");
  assert.equal(state.calls.stripe, 0);
  assert.deepEqual(state.calls.completed, ["no_local_billing_relation"]);
});

test("a Stripe customer without its required local mapping is sent to manual review", async () => {
  const state = dependencies({
    async getCustomerMapping() { return null; },
    async findStripeCustomerIdsByUserId() { return ["cus_orphan"]; },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "manual_review");
  assert.deepEqual(state.calls.failed, [["ORPHAN_STRIPE_MAPPING", false]]);
  assert.deepEqual(state.calls.completed, []);
});

test("an unavailable orphan-mapping check retries instead of assuming no billing relation", async () => {
  const state = dependencies({
    async getCustomerMapping() { return null; },
    async findStripeCustomerIdsByUserId() { throw new Error("provider unavailable"); },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.deepEqual(state.calls.failed, [["STRIPE_MAPPING_SEARCH_FAILED", true]]);
  assert.deepEqual(state.calls.completed, []);
});

test("an inconsistent local or Stripe mapping fails closed for manual review", async () => {
  const local = dependencies({ async getCustomerMapping() { return { id: "local", user_id: "other", stripe_customer_id: "cus_valid" }; } });
  assert.equal(await processAuthEmailSyncJob(local.base, job), "manual_review");
  assert.deepEqual(local.calls.failed, [["MAPPING_INTEGRITY_FAILED", false]]);

  const stripe = dependencies({ async getStripeCustomer() { return { id: "cus_valid", deleted: false, email: null, metadataUserId: "other" }; } });
  assert.equal(await processAuthEmailSyncJob(stripe.base, job), "manual_review");
  assert.deepEqual(stripe.calls.failed, [["STRIPE_IDENTITY_MISMATCH", false]]);
});

test("transient failures are retryable and never expose provider payloads", async () => {
  const state = dependencies({ async updateStripeCustomerEmail() { throw new Error("secret provider payload"); } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "retryable_failed");
  assert.deepEqual(state.calls.failed, [["STRIPE_SYNC_FAILED", true]]);
});

test("a newer confirmed Auth identity prevents stale Stripe writes", async () => {
  let reads = 0;
  const state = dependencies({
    async getConfirmedAuthIdentity() {
      reads += 1;
      return { id: USER, email: reads === 1 ? "first@example.test" : "newer@example.test" };
    },
  });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "stale_generation");
  assert.equal(state.calls.stripe, 0);
  assert.equal(state.calls.reconciled, 1);
});

test("expired or replaced leases stop processing before downstream mutation", async () => {
  const state = dependencies({ async isLeaseCurrent() { return false; } });
  assert.equal(await processAuthEmailSyncJob(state.base, job), "stale");
  assert.equal(state.calls.local, 0);
  assert.equal(state.calls.stripe, 0);
});

test("cron endpoint is secret-protected and Vercel schedule composes as one explicit job", async () => {
  const [route, configuration] = await Promise.all([
    readFile(new URL("app/api/cron/auth-email-sync/route.ts", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
  ]);
  assert.match(route, /process\.env\.CRON_SECRET/);
  assert.match(route, /authorization/);
  assert.doesNotMatch(route, /console\.(log|error)|last_error_code/);
  assert.deepEqual(JSON.parse(configuration), {
    $schema: "https://openapi.vercel.sh/vercel.json",
    crons: [{ path: "/api/cron/auth-email-sync", schedule: "0 3 * * *" }],
  });
});
