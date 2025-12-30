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
 * Hydratatie – tijdsgewogen dagprogressie (24u)
 * Zware weging: 07:00 – 23:00
 * Lichte weging: 23:00 – 07:00
 * ─────────────────────────────────────────────
 */
 export function getExpectedHydrationProgress(
  now: Date = new Date()
): number {
  const hour =
    now.getHours() + now.getMinutes() / 60;

  // Dagindeling
  const lightWeight = 0.2; // nacht
  const heavyWeight = 0.8; // dag

  // Nacht: 23 → 07 (8 uur)
  const nightHours = 8;
  // Dag: 07 → 23 (16 uur)
  const dayHours = 16;

  let progress = 0;

  // Nachtdeel vóór 07:00
  if (hour < 7) {
    progress =
      (hour + 1) / nightHours * lightWeight;
  }
  // Dagdeel
  else if (hour < 23) {
    progress =
      lightWeight +
      ((hour - 7) / dayHours) * heavyWeight;
  }
  // Na 23:00
  else {
    progress = 1;
  }

  return Math.min(Math.max(progress, 0), 1);
}

/**
 * ─────────────────────────────────────────────
 * Hydratatie status + kleur + tekst
 * ─────────────────────────────────────────────
 */
export function getHydrationStatus(
  currentMl: number,
  dailyGoalMl: number,
  now: Date = new Date()
) {
  if (dailyGoalMl <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: "Geen hydratatiedoel ingesteld",
      progress: 0,
    };
  }

  const expectedProgress =
    getExpectedHydrationProgress(now);

  const expectedMl =
    dailyGoalMl * expectedProgress;

  const delta = Math.round(
    currentMl - expectedMl
  );

  const deviationRatio = delta / dailyGoalMl;

  // Status + kleur + tekst
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: `Goed bezig, je hydratatie loopt ${delta} ml voor op schema`,
      progress: expectedProgress,
    };
  }

  if (deviationRatio >= -0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: `Je hydratatie loopt ${Math.abs(
        delta
      )} ml achter op schema`,
      progress: expectedProgress,
    };
  }

  return {
    color: "bg-[#C80000] text-white",
    message: `Je hydratatie loopt ${Math.abs(
      delta
    )} ml achter op schema`,
    progress: expectedProgress,
  };
}
