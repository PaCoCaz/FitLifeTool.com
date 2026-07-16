// app/lib/stripe/entitlementRules.test.mts

import assert from "node:assert/strict";
import test from "node:test";

import {
  chooseHighestPlan,
  selectEntitlementPlan,
  selectEntitlementSubscription,
} from "./entitlementRules.ts";

test("no subscription returns free plan", () => {
  assert.equal(
    selectEntitlementPlan([]),
    "free"
  );

  assert.deepEqual(
    selectEntitlementSubscription([]),
    {
      planId: "free",
      subscriptionId: null,
      status: null,
      currentPeriodEnd: null,
    }
  );
});

test("unknown prices or plans do not grant paid entitlements", () => {
  assert.equal(
    selectEntitlementPlan([
      {
        status: "active",
        planIds: [null, "unknown"],
      },
    ]),
    "free"
  );
});

test("active premium subscription grants premium", () => {
  assert.deepEqual(
    selectEntitlementSubscription([
      {
        id: "sub_premium",
        status: "active",
        planIds: ["premium"],
        currentPeriodEnd: "2026-08-01",
      },
    ]),
    {
      planId: "premium",
      subscriptionId: "sub_premium",
      status: "active",
      currentPeriodEnd: "2026-08-01",
    }
  );
});

test("premium, pro and coach resolve by central priority", () => {
  assert.equal(chooseHighestPlan(["premium"]), "premium");
  assert.equal(chooseHighestPlan(["pro"]), "pro");
  assert.equal(chooseHighestPlan(["coach"]), "coach");
});

test("multiple active subscriptions choose the highest plan", () => {
  assert.equal(
    selectEntitlementPlan([
      {
        status: "active",
        planIds: ["premium"],
      },
      {
        status: "trialing",
        planIds: ["coach"],
      },
      {
        status: "active",
        planIds: ["pro"],
      },
    ]),
    "coach"
  );
});

test("canceled subscriptions do not grant paid entitlements", () => {
  assert.equal(
    selectEntitlementPlan([
      {
        status: "canceled",
        planIds: ["coach"],
      },
    ]),
    "free"
  );
});

test("subscription details ignore old canceled status and date for free", () => {
  assert.deepEqual(
    selectEntitlementSubscription([
      {
        id: "sub_canceled",
        status: "canceled",
        planIds: ["coach"],
        currentPeriodEnd: "2026-12-01",
      },
    ]),
    {
      planId: "free",
      subscriptionId: null,
      status: null,
      currentPeriodEnd: null,
    }
  );
});

test("subscription details choose the same highest plan as entitlement sync", () => {
  const subscriptions = [
    {
      id: "sub_premium",
      status: "active",
      planIds: ["premium"],
      currentPeriodEnd: "2026-08-01",
    },
    {
      id: "sub_pro",
      status: "active",
      planIds: ["pro"],
      currentPeriodEnd: "2026-09-01",
    },
  ];

  assert.equal(
    selectEntitlementPlan(subscriptions),
    "pro"
  );

  assert.deepEqual(
    selectEntitlementSubscription(subscriptions),
    {
      planId: "pro",
      subscriptionId: "sub_pro",
      status: "active",
      currentPeriodEnd: "2026-09-01",
    }
  );
});

test("active subscriptions with cancel_at_period_end keep access", () => {
  assert.equal(
    selectEntitlementPlan([
      {
        status: "active",
        planIds: ["premium"],
        cancelAtPeriodEnd: true,
      },
    ]),
    "premium"
  );
});
