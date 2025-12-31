/**
 * ─────────────────────────────────────────────
 * Nutrition score & schema logic
 *
 * LET OP:
 * Dit is een globaal, cultuur-neutraal standaardschema.
 * Het is bewust avond-tolerant en heuristisch opgezet,
 * bedoeld voor feedback-timing — niet als voedingsadvies.
 *
 * Nutrition wijkt bewust af van Hydration & Activity:
 * - Afvallen / onderhouden → DAGLIMIET (harde grens)
 * - Aankomen → DAGDOEL
 *
 * Activiteit kan het calorie-budget verhogen (activity bonus).
 * ─────────────────────────────────────────────
 */

/* ───────────────── Types ───────────────── */

export type NutritionGoal =
  | "lose_weight"
  | "maintain"
  | "gain_weight";

/* ───────────────── Schema (tijd-gewogen) ───────────────── */

/**
 * Verwachte voedings-voortgang (0–1)
 * Avond heeft zwaartepunt
 */
export function getExpectedNutritionProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  // Nacht: 0 → 5%
  if (hour < 7) {
    return (hour / 7) * 0.05;
  }

  // Ochtend: 5% → 25%
  if (hour < 12) {
    return (
      0.05 +
      ((hour - 7) / 5) * 0.20
    );
  }

  // Middag: 25% → 55%
  if (hour < 18) {
    return (
      0.25 +
      ((hour - 12) / 6) * 0.30
    );
  }

  // Avond: 55% → 100%
  if (hour < 24) {
    return (
      0.55 +
      ((hour - 18) / 6) * 0.45
    );
  }

  return 1;
}

/* ───────────────── NutritionScore (0–100) ───────────────── */

export function calculateNutritionScore(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal
): number {
  if (dailyLimit <= 0) return 0;

  const ratio = consumedCalories / dailyLimit;

  switch (goal) {
    case "lose_weight":
    case "maintain":
      if (ratio <= 1) return 100;
      if (ratio <= 1.2) {
        return Math.round((1.2 - ratio) * 100);
      }
      return 0;

    case "gain_weight":
      if (ratio < 1) {
        return Math.round(ratio * 100);
      }
      return 100;

    default:
      return 0;
  }
}

/* ───────────────── Score kleur (Nutrition-specifiek) ───────────────── */

export function getNutritionScoreColor(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal
): string {
  if (dailyLimit <= 0) {
    return "bg-gray-400 text-white";
  }

  const ratio = consumedCalories / dailyLimit;

  switch (goal) {
    case "lose_weight":
    case "maintain":
      if (ratio <= 1) return "bg-green-600 text-white";
      return "bg-[#C80000] text-white";

    case "gain_weight":
      if (ratio < 0.9) return "bg-[#C80000] text-white";
      if (ratio < 1) return "bg-orange-500 text-white";
      return "bg-green-600 text-white";

    default:
      return "bg-gray-400 text-white";
  }
}

/* ───────────────── Status (tekst + schema-feedback) ───────────────── */

export function getNutritionStatus(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal,
  now: Date = new Date()
) {
  if (dailyLimit <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: "Geen voedingsdoel ingesteld",
      expectedProgress: 0,
    };
  }

  const expectedProgress =
    getExpectedNutritionProgress(now);

  const expectedCalories =
    dailyLimit * expectedProgress;

  const delta = Math.round(
    consumedCalories - expectedCalories
  );

  /* ───── Afvallen / onderhouden ───── */
  if (goal === "lose_weight" || goal === "maintain") {
    if (consumedCalories <= dailyLimit) {
      return {
        color: "bg-green-600 text-white",
        message: "Je zit binnen je daglimiet",
        expectedProgress,
      };
    }

    const excessCalories = Math.round(
      consumedCalories - dailyLimit
    );

    return {
      color: "bg-[#C80000] text-white",
      message: `Je zit ${excessCalories} kcal boven je daglimiet!`,
      expectedProgress,
    };
  }

  /* ───── Aankomen ───── */
  if (goal === "gain_weight") {
    if (delta >= 0) {
      return {
        color: "bg-green-600 text-white",
        message: "Je ligt op schema voor aankomen",
        expectedProgress,
      };
    }

    const shortageCalories = Math.abs(delta);

    if (shortageCalories <= dailyLimit * 0.15) {
      return {
        color: "bg-orange-500 text-white",
        message: "Je zit iets onder je voedingsschema",
        expectedProgress,
      };
    }

    return {
      color: "bg-[#C80000] text-white",
      message: "Je loopt duidelijk achter op je voedingsschema",
      expectedProgress,
    };
  }

  return {
    color: "bg-gray-400 text-white",
    message: "",
    expectedProgress,
  };
}
