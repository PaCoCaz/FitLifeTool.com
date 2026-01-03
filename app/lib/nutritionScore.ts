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
 * - Afvallen / onderhouden → DAGLIMIET (bandbreedte)
 * - Aankomen → DAGDOEL (ondergrens)
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

/**
 * Live dagschema-score (0–100)
 * 100 = op schema
 */
export function calculateNutritionScore(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal,
  now: Date = new Date()
): number {
  if (dailyLimit <= 0) return 0;

  const expectedProgress =
    getExpectedNutritionProgress(now);

  const expectedCalories =
    dailyLimit * expectedProgress;

  /* ───── Aankomen in gewicht ───── */
  if (goal === "gain_weight") {
    if (expectedCalories <= 0) return 0;

    if (consumedCalories >= expectedCalories) {
      return 100;
    }

    return Math.round(
      (consumedCalories / expectedCalories) * 100
    );
  }

  /* ───── Afvallen / onderhouden ───── */

  // Gezonde bandbreedte ±15%
  const lowerBound = expectedCalories * 0.85;
  const upperBound = expectedCalories * 1.15;

  // Te weinig gegeten → onder schema
  if (consumedCalories < lowerBound) {
    if (expectedCalories === 0) return 0;

    return Math.round(
      (consumedCalories / expectedCalories) * 100
    );
  }

  // Op schema
  if (consumedCalories <= upperBound) {
    return 100;
  }

  // Te veel gegeten → boven schema
  const excess =
    consumedCalories - expectedCalories;

  return Math.max(
    0,
    Math.round(
      (1 - excess / dailyLimit) * 100
    )
  );
}

/* ───────────────── Score kleur (Nutrition-specifiek) ───────────────── */

export function getNutritionScoreColor(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal,
  now: Date = new Date()
): string {
  if (dailyLimit <= 0) {
    return "bg-gray-400 text-white";
  }

  const expectedProgress =
    getExpectedNutritionProgress(now);

  const expectedCalories =
    dailyLimit * expectedProgress;

  if (goal === "gain_weight") {
    if (consumedCalories < expectedCalories * 0.85)
      return "bg-[#C80000] text-white";

    if (consumedCalories < expectedCalories)
      return "bg-orange-500 text-white";

    return "bg-green-600 text-white";
  }

  // Afvallen / onderhouden
  if (consumedCalories < expectedCalories * 0.85)
    return "bg-[#C80000] text-white";

  if (consumedCalories > expectedCalories * 1.15)
    return "bg-[#C80000] text-white";

  return "bg-green-600 text-white";
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
    if (
      consumedCalories >= expectedCalories * 0.85 &&
      consumedCalories <= expectedCalories * 1.15
    ) {
      return {
        color: "bg-green-600 text-white",
        message: "Je ligt op je dagschema",
        expectedProgress,
      };
    }

    if (delta < 0) {
      return {
        color: "bg-[#C80000] text-white",
        message: "Je loopt achter op je dagschema",
        expectedProgress,
      };
    }

    return {
      color: "bg-[#C80000] text-white",
      message: "Je zit boven je dagschema",
      expectedProgress,
    };
  }

  /* ───── Aankomen ───── */
  if (goal === "gain_weight") {
    if (delta >= 0) {
      return {
        color: "bg-green-600 text-white",
        message: "Je ligt op dagschema voor aankomen",
        expectedProgress,
      };
    }

    if (Math.abs(delta) <= dailyLimit * 0.15) {
      return {
        color: "bg-orange-500 text-white",
        message: "Je zit iets onder je dagschema",
        expectedProgress,
      };
    }

    return {
      color: "bg-[#C80000] text-white",
      message: "Je loopt duidelijk achter op je dagschema",
      expectedProgress,
    };
  }

  return {
    color: "bg-gray-400 text-white",
    message: "",
    expectedProgress,
  };
}
