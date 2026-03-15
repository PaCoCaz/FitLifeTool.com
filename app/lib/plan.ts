//  app/lib/plan.ts

export type Plan =
  | "free"
  | "premium"
  | "pro"
  | "coach";

const PLAN_ORDER: Plan[] = [
  "free",
  "premium",
  "pro",
  "coach",
];

export function hasPlan(
  userPlan: string,
  required: Plan
) {
  return (
    PLAN_ORDER.indexOf(
      userPlan as Plan
    ) >=
    PLAN_ORDER.indexOf(
      required
    )
  );
}

export function isPremium(
  plan: string
) {
  return hasPlan(
    plan,
    "premium"
  );
}

export function isPro(
  plan: string
) {
  return hasPlan(
    plan,
    "pro"
  );
}

export function isCoach(
  plan: string
) {
  return hasPlan(
    plan,
    "coach"
  );
}
