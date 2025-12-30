/**
 * ─────────────────────────────────────────────
 * FitLifeScore – UI color helpers (FINAL)
 * ─────────────────────────────────────────────
 */

 export type NutritionGoal =
 | "lose_weight"
 | "maintain"
 | "gain_weight";

/**
* ─────────────────────────────────────────────
* Algemene scorekleur (0–100)
* Gebruikt voor:
* - Hydration
* - Activity
*
* REGEL:
* 🔴 < 60
* 🟠 60 – 99
* 🟢 EXACT 100
* ─────────────────────────────────────────────
*/
export function getFitLifeScoreColor(score: number) {
 if (score < 60) {
   return "bg-[#C80000] text-white"; // rood (logo)
 }

 if (score < 100) {
   return "bg-orange-500 text-white";
 }

 // Alleen bij 100%
 return "bg-green-600 text-white";
}

/**
 * Progress bar kleur op basis van FitLifeScore
 * Exact dezelfde drempels als de score-pill
 */
 export function getFitLifeProgressColor(score: number) {
  if (score < 60) {
    return "bg-[#C80000]"; // rood
  }

  if (score < 100) {
    return "bg-orange-500";
  }

  return "bg-green-600";
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
* NutritionScore (ENKEL 1 versie)
* Score = hoe dicht je bij je limiet / doel zit
* ─────────────────────────────────────────────
*/
export function calculateNutritionScore(
 consumedCalories: number,
 dailyLimit: number
): number {
 if (dailyLimit <= 0) return 0;

 const ratio = consumedCalories / dailyLimit;

 // Lineair naar 100%
 if (ratio <= 1) {
   return Math.round(ratio * 100);
 }

 // Licht boven limiet → langzaam afstraffen
 if (ratio <= 1.2) {
   return Math.round((1.2 - ratio) * 100);
 }

 return 0;
}

/**
* ─────────────────────────────────────────────
* NutritionScore KLEUR (doel-afhankelijk)
* Deze is INTENTIONEEL anders dan algemeen
* ─────────────────────────────────────────────
*/
export function getNutritionScoreColor(
 consumedCalories: number,
 dailyLimit: number,
 goal: NutritionGoal
) {
 if (dailyLimit <= 0) {
   return "bg-gray-400 text-white";
 }

 const ratio = consumedCalories / dailyLimit;

 switch (goal) {
   case "lose_weight":
   case "maintain":
     // Groen zolang je ONDER limiet zit
     if (ratio <= 1) {
       return "bg-green-600 text-white";
     }

     // Net erover → oranje
     if (ratio <= 1.1) {
       return "bg-orange-500 text-white";
     }

     // Ver erover → rood
     return "bg-[#C80000] text-white";

   case "gain_weight":
     // Te weinig eten → rood
     if (ratio < 0.9) {
       return "bg-[#C80000] text-white";
     }

     // Richting doel → oranje
     if (ratio < 1) {
       return "bg-orange-500 text-white";
     }

     // Doel behaald of erboven → groen
     return "bg-green-600 text-white";

   default:
     return "bg-gray-400 text-white";
 }
}

/**
 * ─────────────────────────────────────────────
 * Totale FitLifeScore (dagtotaal)
 * ─────────────────────────────────────────────
 */
 export function calculateDailyFitLifeScore({
  hydrationScore,
  nutritionScore,
  activityScore,
}: {
  hydrationScore: number;
  nutritionScore: number;
  activityScore: number;
}): number {
  const weighted =
    hydrationScore * 0.3 +
    nutritionScore * 0.4 +
    activityScore * 0.3;

  return Math.round(weighted);
}

/**
 * ─────────────────────────────────────────────
 * Verwachte hydratatie-voortgang op basis van tijd
 * Dag: 06:00 – 22:00 (16 uur)
 * ─────────────────────────────────────────────
 */
 export function getExpectedHydrationProgress(now: Date = new Date()): number {
  const startHour = 6;
  const endHour = 22;

  const hour =
    now.getHours() + now.getMinutes() / 60;

  if (hour <= startHour) return 0;
  if (hour >= endHour) return 1;

  return (hour - startHour) / (endHour - startHour);
}
