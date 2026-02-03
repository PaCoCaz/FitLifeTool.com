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
 */
 export function getExpectedActivityProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour < 7) {
    return (hour / 7) * 0.05;
  }

  if (hour < 24) {
    return 0.05 + ((hour - 7) / 17) * 0.95;
  }

  return 1;
}

/**
 * Live activityscore (0–100) op basis van dagschema
 */
export function calculateActivityScore(
  burnedCalories: number,
  dailyGoal: number,
  now: Date = new Date()
): number {
  if (dailyGoal <= 0) return 0;

  const expectedProgress = getExpectedActivityProgress(now);
  const expectedCalories = dailyGoal * expectedProgress;

  if (expectedCalories <= 0) return 0;

  const delta = burnedCalories - expectedCalories;

  if (delta >= 0) return 100;

  const ratio = Math.max(0, burnedCalories / expectedCalories);
  return Math.max(0, Math.min(99, Math.floor(ratio * 100)));
}

/**
 * Activiteit-status (kleur + tekst + schema-progress)
 * ✅ STAP 2: berichten nu meertalig via `t`
 */
 export function getActivityStatus(
  burnedCalories: number,
  dailyGoal: number,
  now: Date = new Date(),
  t: any // 🌍 vertalingen
) {
  if (dailyGoal <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: t.activity.status.noGoal,
      expectedProgress: 0,
    };
  }

  const expectedProgress = getExpectedActivityProgress(now);
  const expectedCalories = dailyGoal * expectedProgress;

  const delta = Math.round(burnedCalories - expectedCalories);
  const deviationRatio =
    expectedCalories > 0 ? Math.abs(delta) / expectedCalories : 0;

  // ✅ Dagdoel behaald
  if (burnedCalories >= dailyGoal) {
    return {
      color: "bg-green-600 text-white",
      message: t.activity.status.goalReached,
      expectedProgress,
    };
  }

  // ✅ Voor op schema
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: t.activity.status.ahead.replace(
        "{{value}}",
        delta.toLocaleString()
      ),
      expectedProgress,
    };
  }

  // 🟠 / 🔴 Achter op schema
  return {
    color:
      deviationRatio <= 0.15
        ? "bg-orange-500 text-white"
        : "bg-[#C80000] text-white",
    message: t.activity.status.behind.replace(
      "{{value}}",
      Math.abs(delta).toLocaleString()
    ),
    expectedProgress,
  };
}

/**
 * Calorie berekening (MET-based)
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
