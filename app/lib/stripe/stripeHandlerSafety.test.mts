import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://project.supabase.test";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";

const { handleCheckoutSession } = await import(
  "./handlers/handleCheckoutSession.ts"
);
const { handleCustomer } = await import(
  "./handlers/handleCustomer.ts"
);

type CapturedWrite = Record<string, unknown>;

function getConsoleArguments(source: string) {
  return [...source.matchAll(
    /console\.(?:log|error)\(([\s\S]*?)\);/g
  )].map((match) => match[1]);
}

function createCustomerWriter(
  error: unknown = null,
  mappingResult: "established" | "existing" | "conflict" = "established"
) {
  const writes: CapturedWrite[] = [];

  return {
    writes,
    client: {
      async rpc(functionName: string, values: CapturedWrite) {
        assert.equal(functionName, "establish_customer_mapping");
        writes.push(values);
        return { data: mappingResult, error };
      },
      from(table: string) {
        assert.equal(table, "customers");
        return {
          async upsert(values: CapturedWrite) {
            writes.push(values);
            return { error };
          },
        };
      },
    },
  };
}

test("checkout customer_details email is never persisted", async () => {
  const state = createCustomerWriter();

  await handleCheckoutSession({
    data: {
      object: {
        customer: "cus_checkout",
        client_reference_id: "user_checkout",
        customer_details: {
          email: "provider-details@example.test",
        },
      },
    },
  }, state.client);

  assert.deepEqual(state.writes, [{
    p_stripe_customer_id: "cus_checkout",
    p_user_id: "user_checkout",
  }]);
  assert.equal("email" in state.writes[0], false);
});

test("checkout customer_email fallback is never persisted", async () => {
  const state = createCustomerWriter();

  await handleCheckoutSession({
    data: {
      object: {
        customer: "cus_fallback",
        client_reference_id: "user_fallback",
        customer_email: "provider-fallback@example.test",
      },
    },
  }, state.client);

  assert.deepEqual(state.writes, [{
    p_stripe_customer_id: "cus_fallback",
    p_user_id: "user_fallback",
  }]);
});

test("customer events provision only the Stripe customer identifier", async () => {
  for (const email of ["provider@example.test", null]) {
    const state = createCustomerWriter();

    await handleCustomer({
      data: {
        object: {
          id: "cus_event",
          email,
        },
      },
    }, state.client);

    assert.deepEqual(state.writes, [{
      stripe_customer_id: "cus_event",
    }]);
    assert.equal("email" in state.writes[0], false);
  }
});

test("required customer write failures propagate from both handlers", async () => {
  const databaseError = {
    code: "DATABASE_WRITE_FAILED",
    message: "private database detail",
  };

  await assert.rejects(
    handleCheckoutSession({
      data: {
        object: {
          customer: "cus_checkout",
          client_reference_id: "user_checkout",
        },
      },
    }, createCustomerWriter(databaseError).client),
    (error) => error === databaseError
  );

  await assert.rejects(
    handleCustomer({
      data: { object: { id: "cus_event" } },
    }, createCustomerWriter(databaseError).client),
    (error) => error === databaseError
  );
});

test("checkout mapping establishment accepts exact replay and rejects bounded conflicts", async () => {
  const replay = createCustomerWriter(null, "existing");
  await handleCheckoutSession({
    data: {
      object: {
        customer: "cus_checkout",
        client_reference_id: "user_checkout",
      },
    },
  }, replay.client);
  assert.equal(replay.writes.length, 1);

  await assert.rejects(
    handleCheckoutSession({
      data: {
        object: {
          customer: "cus_stale",
          client_reference_id: "user_checkout",
        },
      },
    }, createCustomerWriter(null, "conflict").client),
    /Customer mapping establishment failed/
  );
});

test("corrected Stripe paths contain only bounded logging", async () => {
  const root = new URL("../../../", import.meta.url);
  const checkoutHandler = await readFile(
    new URL("app/lib/stripe/handlers/handleCheckoutSession.ts", root),
    "utf8"
  );
  const customerHandler = await readFile(
    new URL("app/lib/stripe/handlers/handleCustomer.ts", root),
    "utf8"
  );
  const webhook = await readFile(
    new URL("app/lib/stripe/webhook.ts", root),
    "utf8"
  );
  const webhookRoute = await readFile(
    new URL("app/api/stripe/webhook/route.ts", root),
    "utf8"
  );
  const changePlan = await readFile(
    new URL("app/api/stripe/change-plan/route.ts", root),
    "utf8"
  );
  const checkoutRoute = await readFile(
    new URL("app/api/stripe/checkout/route.ts", root),
    "utf8"
  );

  assert.doesNotMatch(checkoutHandler, /console\.|customer_details|customer_email|\bemail\b/);
  assert.doesNotMatch(customerHandler, /console\.|customer\.email|\bemail\b/);
  assert.doesNotMatch(webhook, /SUBSCRIPTION EVENT DATA/);
  assert.doesNotMatch(webhookRoute, /catch\s*\(\s*err/);
  assert.doesNotMatch(changePlan, /console\.(?:log|error)/);
  assert.match(checkoutRoute, /"establish_customer_mapping"/);
  assert.match(checkoutRoute, /CUSTOMER_MAPPING_ESTABLISHMENT_FAILED/);
  assert.match(checkoutRoute, /stripe\.checkout\.sessions\.create/);
  assert.ok(
    checkoutRoute.indexOf("CUSTOMER_MAPPING_ESTABLISHMENT_FAILED") <
      checkoutRoute.indexOf("stripe.checkout.sessions.create")
  );
  assert.doesNotMatch(checkoutRoute, /console\.error\((?!"STRIPE_CHECKOUT_FAILED")/);

  const consoleArguments = [
    ...getConsoleArguments(webhook),
    ...getConsoleArguments(webhookRoute),
  ];
  for (const argumentsSource of consoleArguments) {
    assert.doesNotMatch(argumentsSource, /\berr\b|event\.data\.object/);
  }

  for (const sensitiveField of [
    "email",
    "customer_details",
    "customer_email",
    "address",
    "phone",
    "metadata",
  ]) {
    for (const argumentsSource of consoleArguments) {
      assert.doesNotMatch(argumentsSource, new RegExp(sensitiveField));
    }
  }
});

test("Email Change synchronization preserves Auth to customer to Stripe authority", async () => {
  const root = new URL("../../../", import.meta.url);
  const worker = await readFile(new URL("app/lib/auth/emailSync.ts", root), "utf8");
  assert.match(worker, /getConfirmedAuthIdentity\(job\.user_id\)/);
  assert.match(worker, /sync_auth_email_local_if_current/);
  assert.match(worker, /updateStripeCustomerEmail/);
  assert.match(worker, /STRIPE_SYNC_READBACK_FAILED/);
  assert.match(worker, /establish_customer_mapping|sync_auth_email_local_if_current/);
  assert.doesNotMatch(worker, /updateUser\(|auth\.admin\.updateUser/);
});
