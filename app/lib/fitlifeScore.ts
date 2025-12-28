/**
 * ─────────────────────────────────────────────
 * FitLifeScore – algemene helpers
 * ─────────────────────────────────────────────
 */

/**
 * Bepaalt kleurstijl op basis van score
 * (UI-helper, geen domeinlogica)
 */
 export function getFitLifeScoreColor(score: number) {
  if (score < 50) return "border-[#C80000] text-[#C80000]";
  if (score < 75) return "border-orange-400 text-orange-500";
  return "border-green-500 text-green-600";
}

/**
 * ─────────────────────────────────────────────
 * HydrationScore
 * Absoluut doel: dichter bij doel = beter
 * ─────────────────────────────────────────────
 */
export function calculateHydrationScore(
  effectiveHydrationMl: number,
  hydrationGoalMl: number
): number {
  if (hydrationGoalMl <= 0) return 0;

  const ratio = effectiveHydrationMl / hydrationGoalMl;
  return Math.min(100, Math.round(ratio * 100));
}

/**
 * ─────────────────────────────────────────────
 * NutritionScore v1 (legacy / MVP)
 * Enkel calorie-based, doel-onafhankelijk
 * ─────────────────────────────────────────────
 * @deprecated Gebruik calculateNutritionScoreV2
 */
export function calculateNutritionScore(
  consumedCalories: number,
  calorieGoal: number
): number {
  if (calorieGoal <= 0) return 0;

  const ratio = consumedCalories / calorieGoal;

  if (ratio < 0.5) return Math.round(ratio * 100);
  if (ratio <= 1.1) return 100;
  if (ratio <= 1.3) return Math.round((1.3 - ratio) * 100);

  return 0;
}

/**
 * ─────────────────────────────────────────────
 * NutritionScore v2 (doel-afhankelijk)
 * ─────────────────────────────────────────────
 */

export type NutritionGoal =
  | "lose_weight"
  | "maintain"
  | "gain_weight";

/**
 * Berekent NutritionScore op basis van:
 * - calorie-inname
 * - dagbudget
 * - gebruikersdoel
 */
export function calculateNutritionScoreV2(
  consumedCalories: number,
  calorieGoal: number,
  goal: NutritionGoal
): number {
  if (calorieGoal <= 0) return 0;

  const ratio = consumedCalories / calorieGoal;

  switch (goal) {
    case "lose_weight":
      // Onder of rond budget = goed
      if (ratio <= 1.0) return 100;
      if (ratio <= 1.1)
        return Math.round((1.1 - ratio) * 100);
      return 0;

    case "maintain":
      // Dicht bij budget = goed
      if (ratio >= 0.85 && ratio <= 1.05) return 100;
      if (ratio < 0.85) return Math.round(ratio * 100);
      if (ratio <= 1.15)
        return Math.round((1.15 - ratio) * 100);
      return 0;

    case "gain_weight":
      // Meer eten = beter (tot zekere grens)
      if (ratio < 0.8) return Math.round(ratio * 100);
      if (ratio <= 1.1) return 100;
      if (ratio <= 1.25)
        return Math.round((1.25 - ratio) * 100);
      return 0;

    default:
      return 0;
  }
}
