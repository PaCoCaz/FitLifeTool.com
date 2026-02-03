// app/lib/activityScore.ts

/**
 * ─────────────────────────────────────────────
 * Activity score & schema logic (FINAL)
 * Structuur: IDENTIEK aan hydrationScore.ts
 * ─────────────────────────────────────────────
 */

/**
 * Verwachte activiteit-voortgang (0–1)
 *
 * Faseverdeling (identiek patroon als Hydration):
 * - 00:00–07:00 → 5%
 * - 07:00–23:59 → 95%
 *
 * Belangrijk:
 * - hour ∈ [0 … 23.999]
 * - 100% wordt pas na de dag bereikt
 */
 export function getExpectedActivityProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  // Nacht: 0 → 5% over 7 uur
  if (hour < 7) {
    return (hour / 7) * 0.05;
  }

  // Dagkern: 5% → 100% over 17 uur (07:00–24:00)
  if (hour < 24) {
    return (
      0.05 +
      ((hour - 7) / 17) * 0.95
    );
  }

  return 1;
}

/**
 * Live activityscore (0–100) op basis van dagschema
 *
 * 100 = op of voor dagschema
 * <100 = achter dagschema (proportioneel)
 */
 export function calculateActivityScore(
  burnedCalories: number,
  dailyGoal: number,
  now: Date = new Date()
): number {
  if (dailyGoal <= 0) return 0;

  const expectedProgress =
    getExpectedActivityProgress(now);

  const expectedCalories =
    dailyGoal * expectedProgress;

  if (expectedCalories <= 0) return 0;

  const delta =
    burnedCalories - expectedCalories;

  // ✅ Alleen 100 als je op of voor dagschema ligt
  if (delta >= 0) {
    return 100;
  }

  // ❗ Zodra je achter ligt: altijd naar beneden afronden
  // 99,99 → 99 | 59,99 → 59 | NOOIT 100
  const ratio =
    Math.max(0, burnedCalories / expectedCalories);

  return Math.max(0, Math.min(99, Math.floor(ratio * 100)));
}

/**
 * Activiteit-status (kleur + tekst + schema-progress)
 * Volledig identiek beslispad als Hydration
 */
export function getActivityStatus(
  burnedCalories: number,
  dailyGoal: number,
  now: Date = new Date()
) {
  if (dailyGoal <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: "Geen activiteitsdoel ingesteld",
      expectedProgress: 0,
    };
  }

  const expectedProgress =
    getExpectedActivityProgress(now);

  const expectedCalories =
    dailyGoal * expectedProgress;

  const delta = Math.round(
    burnedCalories - expectedCalories
  );

  const deviationRatio =
    expectedCalories > 0
      ? Math.abs(delta) / expectedCalories
      : 0;

  // ✅ Dagdoel behaald
  if (burnedCalories >= dailyGoal) {
    return {
      color: "bg-green-600 text-white",
      message:
        "Goed bezig, je hebt je dagdoel gehaald.",
      expectedProgress,
    };
  }

  // ✅ Voor of op schema
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: `Goed bezig, activiteiten loopt ${delta} kcal voor op je dagschema`,
      expectedProgress,
    };
  }

  // 🟠 Binnen 15% achterstand
  if (deviationRatio <= 0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: `Activiteiten loopt ${Math.abs(
        delta
      )} kcal achter op je dagschema`,
      expectedProgress,
    };
  }

  // 🔴 Meer dan 15% achterstand
  return {
    color: "bg-[#C80000] text-white",
    message: `Activiteiten loopt ${Math.abs(
      delta
    )} kcal achter op je dagschema`,
    expectedProgress,
  };
}

/**
 * ─────────────────────────────────────────────
 * Activity – calorie calculation (MET-based)
 * kcal = MET × gewicht (kg) × tijd (uren)
 * ─────────────────────────────────────────────
 */
export function calculateActivityCalories(
  metValue: number,
  weightKg: number,
  durationMinutes: number
): number {
  if (metValue <= 0 || weightKg <= 0 || durationMinutes <= 0) {
    return 0;
  }

  const hours = durationMinutes / 60;
  return Math.round(metValue * weightKg * hours);
}

/**
 * Activity types (MVP)
 */
export const ACTIVITY_TYPES = {
  walking: { label: "Wandelen", met: 3.5 },
  cycling: { label: "Fietsen", met: 6.8 },
  running: { label: "Hardlopen", met: 9.8 },
  strength_training: { label: "Krachttraining", met: 6.0 },
  yoga: { label: "Yoga", met: 2.5 },
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;
