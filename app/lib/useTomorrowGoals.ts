"use client";

import { calculateDailyGoals } from "./calculateDailyGoals";

type Goal =
  | "lose_weight"
  | "maintain"
  | "gain_weight"
  | "build_muscle";

export function useTomorrowGoals(
  weightKg: number | null,
  tdee: number | null,
  goal: Goal | null,
  isActiveDay: boolean
) {
  if (!weightKg || !tdee || !goal || !isActiveDay) {
    return null;
  }

  return calculateDailyGoals(weightKg, tdee, goal);
}
