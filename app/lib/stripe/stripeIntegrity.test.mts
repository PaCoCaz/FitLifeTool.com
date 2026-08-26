import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import {
  CustomerMappingError,
  ensureCustomerMapping,
  getCheckoutSessionUserId,
  getStripeCustomerUserId,
  stripeCustomerEmailNeedsReconciliation,
  type CustomerMappingInput,
  type CustomerMappingStore,
  type LocalCustomerMapping,
} from "./customerMapping.ts";
import {
  ChangePlanError,
  changePlanForUser,
  type ChangePlanDependencies,
} from "./changePlan.ts";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const projectRoot = new URL("../../../", import.meta.url);

function createMappingStore(
  initialRows: LocalCustomerMapping[] = []
) {
  const rows = [...initialRows];
  const inserted: CustomerMappingInput[] = [];
  const reconciliationRequests: string[] = [];

  const store: CustomerMappingStore = {
    async findByStripeCustomerId(stripeCustomerId) {
      return rows.find(
        (row) =>
          row.stripe_customer_id === stripeCustomerId
      ) ?? null;
    },

    async findByUserId(userId) {
      return rows.find(
        (row) => row.user_id === userId
      ) ?? null;
    },

    async insert(input) {
      inserted.push(input);

      const row = {
        id: `local-${rows.length + 1}`,
        user_id: input.userId,
        stripe_customer_id: input.stripeCustomerId,
      };

      rows.push(row);
      return row;
    },

    async requestEmailReconciliation(userId) {
      reconciliationRequests.push(userId);
    },
  };

  return {
    store,
    rows,
    inserted,
    reconciliationRequests,
  };
}

test("valid Stripe metadata creates one unambiguous local customer mapping", async () => {
  const state = createMappingStore();
  const userId = getStripeCustomerUserId({
    id: "cus_validA",
    metadata: {
      user_id: USER_A,
    },
  });

  const customer = await ensureCustomerMapping(
    state.store,
    {
      userId,
      stripeCustomerId: "cus_validA",
    }
  );

  assert.equal(customer.user_id, USER_A);
  assert.equal(
    customer.stripe_customer_id,
    "cus_validA"
  );
  assert.equal(state.inserted.length, 1);
  assert.deepEqual(state.reconciliationRequests, [USER_A]);
});

test("mapping input discards a caller-supplied Stripe email before persistence", async () => {
  const state = createMappingStore();
  await ensureCustomerMapping(state.store, {
    userId: USER_A,
    stripeCustomerId: "cus_validA",
    email: "stripe-owned@example.test",
  } as CustomerMappingInput & { email: string });

  assert.deepEqual(state.inserted, [
    { userId: USER_A, stripeCustomerId: "cus_validA" },
  ]);
  assert.equal("email" in state.inserted[0], false);
});

test("customer email reconciliation is driven only by validated user metadata", () => {
  assert.equal(
    stripeCustomerEmailNeedsReconciliation({
      customer: {
        id: "cus_validA",
        email: "stripe@example.test",
        metadata: { user_id: USER_A },
      },
      expectedUserId: USER_A,
      confirmedAuthEmail: "auth@example.test",
    }),
    true
  );
  assert.equal(
    stripeCustomerEmailNeedsReconciliation({
      customer: {
        id: "cus_validA",
        email: "auth@example.test",
        metadata: { user_id: USER_A },
      },
      expectedUserId: USER_A,
      confirmedAuthEmail: "auth@example.test",
    }),
    false
  );
  assert.throws(
    () =>
      stripeCustomerEmailNeedsReconciliation({
        customer: {
          id: "cus_validA",
          email: "auth@example.test",
          metadata: { user_id: USER_B },
        },
        expectedUserId: USER_A,
        confirmedAuthEmail: "auth@example.test",
      }),
    (error) =>
      error instanceof CustomerMappingError &&
      error.code === "CUSTOMER_MAPPING_CONFLICT"
  );
});

test("missing Stripe user metadata fails closed without inserting a customer", async () => {
  const state = createMappingStore();

  assert.throws(
    () =>
      getStripeCustomerUserId({
        id: "cus_missingMetadata",
        metadata: {},
      }),
    (error) =>
      error instanceof CustomerMappingError &&
      error.code === "MISSING_STRIPE_USER_ID"
  );

  assert.equal(state.inserted.length, 0);
});

test("conflicting Stripe and Supabase identities never overwrite existing billing mappings", async () => {
  const state = createMappingStore([
    {
      id: "local-a",
      user_id: USER_A,
      stripe_customer_id: "cus_existingA",
      email: "confirmed@example.test",
    },
  ]);

  await assert.rejects(
    ensureCustomerMapping(state.store, {
      userId: USER_B,
      stripeCustomerId: "cus_existingA",
    }),
    (error) =>
      error instanceof CustomerMappingError &&
      error.code === "CUSTOMER_MAPPING_CONFLICT"
  );

  assert.equal(state.inserted.length, 0);
  assert.deepEqual(state.rows, [
    {
      id: "local-a",
      user_id: USER_A,
      stripe_customer_id: "cus_existingA",
      email: "confirmed@example.test",
    },
  ]);
});

test("an existing correct mapping is retained without a Stripe-owned local email write", async () => {
  const state = createMappingStore([
    {
      id: "local-a",
      user_id: USER_A,
      stripe_customer_id: "cus_existingA",
      email: "confirmed@example.test",
    },
  ]);

  const customer = await ensureCustomerMapping(
    state.store,
    {
      userId: USER_A,
      stripeCustomerId: "cus_existingA",
    }
  );

  assert.equal(customer.id, "local-a");
  assert.equal(state.inserted.length, 0);
  assert.deepEqual(state.reconciliationRequests, []);
});

test("a mapping without derived email is recovered through the canonical reconciliation layer", async () => {
  const state = createMappingStore([
    {
      id: "local-a",
      user_id: USER_A,
      stripe_customer_id: "cus_existingA",
      email: null,
    },
  ]);

  await ensureCustomerMapping(state.store, {
    userId: USER_A,
    stripeCustomerId: "cus_existingA",
  });

  assert.deepEqual(state.reconciliationRequests, [USER_A]);
});

test("a 23505 webhook race re-reads and safely reuses only the exact mapping", async () => {
  const rows: LocalCustomerMapping[] = [];
  const reads = { byStripe: 0, byUser: 0 };
  const reconciliationRequests: string[] = [];
  const rawUniqueViolation = {
    code: "23505",
    message: "raw database provider payload",
  };
  const store: CustomerMappingStore = {
    async findByStripeCustomerId(stripeCustomerId) {
      reads.byStripe += 1;
      return rows.find((row) => row.stripe_customer_id === stripeCustomerId) ?? null;
    },
    async findByUserId(userId) {
      reads.byUser += 1;
      return rows.find((row) => row.user_id === userId) ?? null;
    },
    async insert(input) {
      rows.push({
        id: "local-race",
        user_id: input.userId,
        stripe_customer_id: input.stripeCustomerId,
        email: null,
      });
      throw rawUniqueViolation;
    },
    async requestEmailReconciliation(userId) {
      reconciliationRequests.push(userId);
    },
  };

  const mapping = await ensureCustomerMapping(store, {
    userId: USER_A,
    stripeCustomerId: "cus_raceA",
  });

  assert.deepEqual(mapping, rows[0]);
  assert.deepEqual(reads, { byStripe: 2, byUser: 2 });
  assert.deepEqual(reconciliationRequests, []);
  assert.equal("email" in rawUniqueViolation, false);
});

test("a 23505 webhook race with a conflicting identity fails closed", async () => {
  const rows: LocalCustomerMapping[] = [];
  const rawUniqueViolation = {
    code: "23505",
    message: "raw database provider payload",
  };
  const store: CustomerMappingStore = {
    async findByStripeCustomerId(stripeCustomerId) {
      return rows.find((row) => row.stripe_customer_id === stripeCustomerId) ?? null;
    },
    async findByUserId(userId) {
      return rows.find((row) => row.user_id === userId) ?? null;
    },
    async insert(input) {
      rows.push({
        id: "local-other-user",
        user_id: USER_B,
        stripe_customer_id: input.stripeCustomerId,
        email: "other@example.test",
      });
      throw rawUniqueViolation;
    },
    async requestEmailReconciliation() {
      assert.fail("a conflicting race must not request reconciliation");
    },
  };

  await assert.rejects(
    ensureCustomerMapping(store, {
      userId: USER_A,
      stripeCustomerId: "cus_raceConflict",
    }),
    (error) =>
      error instanceof CustomerMappingError &&
      error.code === "CUSTOMER_MAPPING_CONFLICT" &&
      !error.message.includes(rawUniqueViolation.message)
  );
});

test("checkout rejects inconsistent server-authored user references", () => {
  assert.throws(
    () =>
      getCheckoutSessionUserId({
        clientReferenceId: USER_A,
        metadataUserId: USER_B,
      }),
    (error) =>
      error instanceof CustomerMappingError &&
      error.code === "CUSTOMER_MAPPING_CONFLICT"
  );
});

test("webhook adapters require proven user identity before customer persistence", async () => {
  const [customerHandler, subscriptionHandler, webhookRoute] =
    await Promise.all([
      readFile(
        new URL(
          "app/lib/stripe/handlers/handleCustomer.ts",
          projectRoot
        ),
        "utf8"
      ),
      readFile(
        new URL(
          "app/lib/stripe/handlers/handleSubscription.ts",
          projectRoot
        ),
        "utf8"
      ),
      readFile(
        new URL("app/api/stripe/webhook/route.ts", projectRoot),
        "utf8"
      ),
    ]);

  assert.match(
    customerHandler,
    /getStripeCustomerUserId\(customer\)/
  );
  assert.match(
    customerHandler,
    /ensureSupabaseCustomerMapping\(supabase, \{[\s\S]*?userId,[\s\S]*?stripeCustomerId: customer\.id/
  );
  assert.match(
    subscriptionHandler,
    /resolveLocalCustomerMapping\(\{[\s\S]*?retrieveStripeCustomer/
  );
  assert.doesNotMatch(
    `${customerHandler}\n${subscriptionHandler}`,
    /\.insert\(\{\s*stripe_customer_id:/
  );
  assert.doesNotMatch(
    customerHandler,
    /ensureSupabaseCustomerMapping\(supabase, \{[\s\S]*?email:/
  );
  assert.match(customerHandler, /requestAuthEmailReconciliation/);
  assert.match(webhookRoute, /new Response\(\s*"Webhook error"/);
  assert.doesNotMatch(webhookRoute, /new Response\(\s*err|new Response\(\s*error/);
});

test("the customer mapping layer never writes customers.email directly", async () => {
  const source = await readFile(
    new URL("app/lib/stripe/customerMapping.ts", projectRoot),
    "utf8"
  );
  assert.doesNotMatch(source, /updateEmail/);
  assert.doesNotMatch(source, /\.update\(\{\s*email/);
  assert.match(source, /request_auth_email_reconciliation/);
});

test("the repository keeps the Auth-owned sync worker as the single local email writer", async () => {
  const appFiles = await readdir(new URL("app/", projectRoot), {
    recursive: true,
  });
  const writers: string[] = [];

  for (const relativePath of appFiles) {
    if (
      typeof relativePath !== "string" ||
      !/\.(?:ts|tsx)$/.test(relativePath) ||
      relativePath.endsWith(".test.mts") ||
      relativePath.includes("handbook/")
    ) {
      continue;
    }

    const source = await readFile(
      new URL(`app/${relativePath}`, projectRoot),
      "utf8"
    );
    if (
      /\.from\(["']customers["']\)[\s\S]{0,300}?\.update\(\{\s*email\s*:/.test(
        source
      )
    ) {
      writers.push(relativePath);
    }
  }

  assert.deepEqual(writers, ["lib/auth/emailSync.ts"]);
});

function createChangePlanDependencies(input?: {
  customer?: {
    id: string;
    stripeCustomerId: string;
  } | null;
  subscriptions?: Array<{ id: string }>;
  retrievedCustomerId?: string;
}) {
  const calls = {
    userIds: [] as string[],
    localCustomerIds: [] as string[],
    retrievedSubscriptionIds: [] as string[],
    updates: [] as Array<{
      subscriptionId: string;
      itemId: string;
      priceId: string;
    }>,
  };

  const customer = input?.customer === undefined
    ? {
        id: "local-customer-uuid",
        stripeCustomerId: "cus_ownerA",
      }
    : input.customer;
  const subscriptions = input?.subscriptions ?? [
    {
      id: "sub_ownerA",
    },
  ];

  const dependencies: ChangePlanDependencies = {
    async findCustomerByUserId(userId) {
      calls.userIds.push(userId);
      return customer;
    },

    async findChangeableSubscriptionsByCustomerId(
      localCustomerId
    ) {
      calls.localCustomerIds.push(localCustomerId);
      return subscriptions;
    },

    async retrieveStripeSubscription(subscriptionId) {
      calls.retrievedSubscriptionIds.push(subscriptionId);
      return {
        id: subscriptionId,
        customer:
          input?.retrievedCustomerId ?? "cus_ownerA",
        items: {
          data: [
            {
              id: "si_ownerA",
            },
          ],
        },
      };
    },

    async updateStripeSubscription(
      subscriptionId,
      update
    ) {
      calls.updates.push({
        subscriptionId,
        ...update,
      });
    },
  };

  return {
    dependencies,
    calls,
  };
}

test("change plan resolves ownership from user to local UUID before using Stripe ids", async () => {
  const state = createChangePlanDependencies();

  await changePlanForUser(state.dependencies, {
    userId: USER_A,
    priceId: "price_pro",
  });

  assert.deepEqual(state.calls.userIds, [USER_A]);
  assert.deepEqual(state.calls.localCustomerIds, [
    "local-customer-uuid",
  ]);
  assert.deepEqual(state.calls.retrievedSubscriptionIds, [
    "sub_ownerA",
  ]);
  assert.deepEqual(state.calls.updates, [
    {
      subscriptionId: "sub_ownerA",
      itemId: "si_ownerA",
      priceId: "price_pro",
    },
  ]);
});

test("change plan blocks a Stripe subscription belonging to another customer", async () => {
  const state = createChangePlanDependencies({
    retrievedCustomerId: "cus_otherUser",
  });

  await assert.rejects(
    changePlanForUser(state.dependencies, {
      userId: USER_A,
      priceId: "price_pro",
    }),
    (error) =>
      error instanceof ChangePlanError &&
      error.code === "STRIPE_CUSTOMER_MISMATCH"
  );

  assert.equal(state.calls.updates.length, 0);
});

test("change plan fails safely when customer or subscription is missing", async () => {
  const missingCustomer = createChangePlanDependencies({
    customer: null,
  });

  await assert.rejects(
    changePlanForUser(missingCustomer.dependencies, {
      userId: USER_A,
      priceId: "price_pro",
    }),
    (error) =>
      error instanceof ChangePlanError &&
      error.code === "CUSTOMER_NOT_FOUND"
  );

  const missingSubscription = createChangePlanDependencies({
    subscriptions: [],
  });

  await assert.rejects(
    changePlanForUser(missingSubscription.dependencies, {
      userId: USER_A,
      priceId: "price_pro",
    }),
    (error) =>
      error instanceof ChangePlanError &&
      error.code === "SUBSCRIPTION_NOT_FOUND"
  );
});

test("change plan rejects ambiguous local subscriptions without a Stripe mutation", async () => {
  const state = createChangePlanDependencies({
    subscriptions: [
      { id: "sub_first" },
      { id: "sub_second" },
    ],
  });

  await assert.rejects(
    changePlanForUser(state.dependencies, {
      userId: USER_A,
      priceId: "price_pro",
    }),
    (error) =>
      error instanceof ChangePlanError &&
      error.code === "AMBIGUOUS_SUBSCRIPTION"
  );

  assert.equal(state.calls.updates.length, 0);
});

test("change-plan route uses only the local customer UUID for its subscription FK lookup", async () => {
  const source = await readFile(
    new URL(
      "app/api/stripe/change-plan/route.ts",
      projectRoot
    ),
    "utf8"
  );

  assert.match(
    source,
    /\.eq\("customer_id", localCustomerId\)/
  );
  assert.doesNotMatch(
    source,
    /\.eq\(\s*"customer_id",\s*customer\.stripe_customer_id/
  );
  assert.match(
    source,
    /userId: user\.id/
  );
});
