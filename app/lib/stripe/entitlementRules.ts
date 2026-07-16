// app/lib/stripe/entitlementRules.ts

export const PAID_ENTITLEMENT_STATUSES = [
  "active",
  "trialing",
] as const;

const PLAN_PRIORITY: Record<string, number> = {
  free: 0,
  premium: 1,
  pro: 2,
  coach: 3,
};

export type SubscriptionEntitlementInput = {
  id?: string | null;
  status: string | null;
  planIds: Array<string | null | undefined>;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
};

export type SelectedEntitlement = {
  planId: string;
  subscriptionId: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
};

export function hasPaidEntitlementStatus(
  status: string | null | undefined
) {
  return status === "active" || status === "trialing";
}

export function getPlanPriority(
  planId: string | null | undefined
) {
  if (!planId) return 0;
  return PLAN_PRIORITY[planId] ?? 0;
}

export function chooseHighestPlan(
  planIds: Array<string | null | undefined>
) {
  let highestPlan = "free";

  for (const planId of planIds) {
    if (
      getPlanPriority(planId) >
      getPlanPriority(highestPlan)
    ) {
      highestPlan = planId ?? highestPlan;
    }
  }

  return highestPlan;
}

export function selectEntitlementPlan(
  subscriptions: SubscriptionEntitlementInput[]
) {
  return selectEntitlementSubscription(
    subscriptions
  ).planId;
}

export function selectEntitlementSubscription(
  subscriptions: SubscriptionEntitlementInput[]
): SelectedEntitlement {
  let selected: SelectedEntitlement = {
    planId: "free",
    subscriptionId: null,
    status: null,
    currentPeriodEnd: null,
  };

  for (const subscription of subscriptions) {
    if (
      !hasPaidEntitlementStatus(subscription.status)
    ) {
      continue;
    }

    const subscriptionPlan =
      chooseHighestPlan(subscription.planIds);

    if (
      getPlanPriority(subscriptionPlan) >
      getPlanPriority(selected.planId)
    ) {
      selected = {
        planId: subscriptionPlan,
        subscriptionId: subscription.id ?? null,
        status: subscription.status,
        currentPeriodEnd:
          subscription.currentPeriodEnd ?? null,
      };
    }
  }

  return selected;
}
