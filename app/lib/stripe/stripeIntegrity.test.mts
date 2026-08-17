import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CustomerMappingError,
  ensureCustomerMapping,
  getCheckoutSessionUserId,
  getStripeCustomerUserId,
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
  const updatedEmails: Array<{
    customerId: string;
    email: string;
  }> = [];

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

    async updateEmail(customerId, email) {
      updatedEmails.push({ customerId, email });
    },
  };

  return {
    store,
    rows,
    inserted,
    updatedEmails,
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
    },
  ]);
});

test("an existing correct mapping is retained and email remains non-authoritative", async () => {
  const state = createMappingStore([
    {
      id: "local-a",
      user_id: USER_A,
      stripe_customer_id: "cus_existingA",
    },
  ]);

  const customer = await ensureCustomerMapping(
    state.store,
    {
      userId: USER_A,
      stripeCustomerId: "cus_existingA",
      email: " billing@example.test ",
    }
  );

  assert.equal(customer.id, "local-a");
  assert.equal(state.inserted.length, 0);
  assert.deepEqual(state.updatedEmails, [
    {
      customerId: "local-a",
      email: "billing@example.test",
    },
  ]);
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
  const [customerHandler, subscriptionHandler] =
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
