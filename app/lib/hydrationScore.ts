// app/lib/hydrationScore.ts

/**
 * ─────────────────────────────────────────────
 * Hydration score & schema logic (FINAL)
 * ─────────────────────────────────────────────
 */

/**
 * Verwachte hydratatie-voortgang (0–1)
 * Faseverdeling:
 * - 00:00–07:00 → 5%
 * - 07:00–10:00 → +20%
 * - 10:00–18:00 → +55%
 * - 18:00–23:59 → +20%
 */
 export function getExpectedHydrationProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour < 7) {
    return (hour / 7) * 0.05;
  }

  if (hour < 10) {
    return 0.05 + ((hour - 7) / 3) * 0.20;
  }

  if (hour < 18) {
    return 0.25 + ((hour - 10) / 8) * 0.55;
  }

  if (hour < 24) {
    return 0.80 + ((hour - 18) / 6) * 0.20;
  }

  return 1;
}

/**
 * Live hydratatiescore (0–100) op basis van dagschema
 */
export function calculateHydrationScore(
  currentMl: number,
  dailyGoalMl: number,
  now: Date = new Date()
): number {
  if (dailyGoalMl <= 0) return 0;

  const expectedProgress = getExpectedHydrationProgress(now);
  const expectedMl = dailyGoalMl * expectedProgress;

  if (expectedMl <= 0) return 0;

  const delta = currentMl - expectedMl;

  if (delta >= 0) {
    return 100;
  }

  const ratio = Math.max(0, currentMl / expectedMl);
  return Math.round(ratio * 100);
}

/**
 * Hydratatie-status (kleur + tekst + schema-progress)
 * 🔹 NU meertalig via uiText (t.hydration.status)
 */
export function getHydrationStatus(
  currentMl: number,
  dailyGoalMl: number,
  now: Date = new Date(),
  t: any
) {
  if (dailyGoalMl <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: t.hydration.status.noGoal,
      expectedProgress: 0,
    };
  }

  const expectedProgress = getExpectedHydrationProgress(now);
  const expectedMl = dailyGoalMl * expectedProgress;

  const delta = Math.round(currentMl - expectedMl);

  const deviationRatio =
    expectedMl > 0 ? Math.abs(delta) / expectedMl : 0;

  // ✅ Dagdoel behaald
  if (currentMl >= dailyGoalMl) {
    return {
      color: "bg-green-600 text-white",
      message: t.hydration.status.goalReached,
      expectedProgress,
    };
  }

  // ✅ Voor of op schema
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: t.hydration.status.ahead.replace(
        "{{value}}",
        delta.toString()
      ),
      expectedProgress,
    };
  }

  // 🟠 Binnen 15% achterstand
  if (deviationRatio <= 0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: t.hydration.status.behind.replace(
        "{{value}}",
        Math.abs(delta).toString()
      ),
      expectedProgress,
    };
  }

  // 🔴 Meer dan 15% achterstand
  return {
    color: "bg-[#C80000] text-white",
    message: t.hydration.status.behind.replace(
      "{{value}}",
      Math.abs(delta).toString()
    ),
    expectedProgress,
  };
}
