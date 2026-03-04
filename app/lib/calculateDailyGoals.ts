// app/lib/calculateDailyGoals.ts

import {
  calculateWaterGoal,
  adjustForGoal,
  calculateActivityGoal,
} from "./calculations";

type Goal = "LOSE" | "MAINTAIN" | "GAIN";

export function calculateDailyGoals(
  weightKg: number,
  tdee: number,
  goal: Goal
) {
  return {
    // Hydratatie — gewicht-afhankelijk, doel-onafhankelijk
    waterGoalMl: calculateWaterGoal(weightKg),

    // Activiteit — beweegdoel uit onboarding
    activityGoalKcal: calculateActivityGoal(tdee, goal),

    // Voeding — calorie-doel
    calorieGoal: adjustForGoal(tdee, goal),
  };
}