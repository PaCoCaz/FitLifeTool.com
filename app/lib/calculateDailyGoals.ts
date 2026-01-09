import {
  calculateWaterGoal,
  adjustForGoal,
  calculateActivityGoal,
} from "./calculations";

type Goal =
  | "lose_weight"
  | "maintain"
  | "gain_weight"
  | "build_muscle";

export function calculateDailyGoals(
  weightKg: number,
  tdee: number,
  goal: Goal
) {
  return {
    // Hydratatie — gewicht-afhankelijk, doel-onafhankelijk
    waterGoalMl: calculateWaterGoal(weightKg),

    // Activiteit — beweegdoel uit onboarding (GEEN TDEE!)
    activityGoalKcal: calculateActivityGoal(tdee, goal),

    // Voeding — calorie-doel uit onboarding (afvallen blijft afvallen)
    calorieGoal: adjustForGoal(tdee, goal),
  };
}
