/**
 * ─────────────────────────────────────────────
 * FitLifeScore – UI color helpers
 * ─────────────────────────────────────────────
 */

 export type NutritionGoal =
 | "lose_weight"
 | "maintain"
 | "gain_weight";

/**
* Algemene scorekleur (0–100)
* 🔴 < 60
* 🟠 60 – 99
* 🟢 EXACT 100
*/
export function getFitLifeScoreColor(score: number) {
 if (score < 60) {
   return "bg-[#C80000] text-white";
 }

 if (score < 100) {
   return "bg-orange-500 text-white";
 }

 return "bg-green-600 text-white";
}

/**
* Progress bar kleur (zelfde drempels)
*/
export function getFitLifeProgressColor(score: number) {
 if (score < 60) return "bg-[#C80000]";
 if (score < 100) return "bg-orange-500";
 return "bg-green-600";
}

/**
* ─────────────────────────────────────────────
* HydrationScore (absoluut)
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
* NutritionScore (1 versie)
* ─────────────────────────────────────────────
*/
export function calculateNutritionScore(
 consumedCalories: number,
 dailyLimit: number
): number {
 if (dailyLimit <= 0) return 0;

 const ratio = consumedCalories / dailyLimit;

 if (ratio <= 1) {
   return Math.round(ratio * 100);
 }

 if (ratio <= 1.2) {
   return Math.round((1.2 - ratio) * 100);
 }

 return 0;
}

/**
* ─────────────────────────────────────────────
* NutritionScore kleur (doel-afhankelijk)
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
     if (ratio <= 1) return "bg-green-600 text-white";
     if (ratio <= 1.1) return "bg-orange-500 text-white";
     return "bg-[#C80000] text-white";

   case "gain_weight":
     if (ratio < 0.9) return "bg-[#C80000] text-white";
     if (ratio < 1) return "bg-orange-500 text-white";
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
* Verwachte DAG-progressie (0–1)
* 24 uur, met nacht- en dagweging
*
* Zware weging: 07:00 – 23:00
* Lichte weging: 23:00 – 07:00
*
* Reset AUTOMATISCH om 00:00
* ─────────────────────────────────────────────
*/
export function getExpectedHydrationProgress(
 now: Date = new Date()
): number {
 const hour = now.getHours() + now.getMinutes() / 60;

 let weightedMinutes = 0;
 let totalWeightedMinutes = 0;

 for (let h = 0; h < 24; h++) {
   let weight = 0.2; // nacht

   if (h >= 7 && h < 23) {
     weight = 1.0; // dag
   }

   totalWeightedMinutes += weight * 60;

   if (h < hour) {
     weightedMinutes += weight * 60;
   } else if (h === Math.floor(hour)) {
     weightedMinutes +=
       weight * ((hour - h) * 60);
   }
 }

 return Math.min(
   weightedMinutes / totalWeightedMinutes,
   1
 );
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
      expectedProgress: 0,
    };
  }

  const expectedProgress =
  getExpectedHydrationProgress(now);

  const expectedMl =
    dailyGoalMl * expectedProgress;

  const delta = Math.round(
    currentMl - expectedMl
  );

  // ❗️CORRECT: afwijking t.o.v. verwachte schema, niet dagdoel
  const deviationRatio =
    expectedMl > 0 ? delta / expectedMl : 0;

  /* ───── 1️⃣ Dagdoel behaald ───── */
  if (currentMl >= dailyGoalMl) {
    return {
      color: "bg-green-600 text-white",
      message: "Goed bezig, je hebt je dagdoel gehaald.",
      expectedProgress,
    };
  }

  /* ───── 2️⃣ Voor / op schema ───── */
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: `Goed bezig, je hydratatie loopt ${delta} ml voor op schema`,
      expectedProgress,
    };
  }

  /* ───── 3️⃣ Licht achter (≤15%) ───── */
  if (deviationRatio >= -0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: `Je hydratatie loopt ${Math.abs(
        delta
      )} ml achter op schema`,
      expectedProgress,
    };
  }

  /* ───── 4️⃣ Ver achter ───── */
  return {
    color: "bg-[#C80000] text-white",
    message: `Je hydratatie loopt ${Math.abs(
      delta
    )} ml achter op schema`,
    expectedProgress,
  };
}
