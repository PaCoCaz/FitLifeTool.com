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

  // Fasegrenzen
  if (hour < 7) {
    // Nacht: 0 → 5% over 7 uur
    return (hour / 7) * 0.05;
  }

  if (hour < 10) {
    // Ochtend: 5% → 25% over 3 uur
    return (
      0.05 +
      ((hour - 7) / 3) * 0.20
    );
  }

  if (hour < 18) {
    // Dagkern: 25% → 80% over 8 uur
    return (
      0.25 +
      ((hour - 10) / 8) * 0.55
    );
  }

  if (hour < 24) {
    // Avond: 80% → 100% over ~6 uur
    return (
      0.80 +
      ((hour - 18) / 6) * 0.20
    );
  }

  return 1;
}

/**
 * Live hydratatiescore (0–100) op basis van dagschema
 *
 * 100 = op of voor dagschema
 * <100 = achter dagschema (proportioneel)
 */
export function calculateHydrationScore(
  currentMl: number,
  dailyGoalMl: number,
  now: Date = new Date()
): number {
  if (dailyGoalMl <= 0) return 0;

  const expectedProgress =
    getExpectedHydrationProgress(now);

  const expectedMl =
    dailyGoalMl * expectedProgress;

  // Nog niets verwacht → geen straf
  if (expectedMl <= 0) return 0;

  const delta =
    currentMl - expectedMl;

  // Op of voor schema
  if (delta >= 0) {
    return 100;
  }

  // Achter schema → score proportioneel
  const ratio =
    Math.max(0, currentMl / expectedMl);

  return Math.round(ratio * 100);
}

/**
 * Hydratatie-status (kleur + tekst + schema-progress)
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

  const deviationRatio =
    expectedMl > 0
      ? Math.abs(delta) / expectedMl
      : 0;

  // ✅ Dagdoel behaald
  if (currentMl >= dailyGoalMl) {
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
      message: `Goed bezig, hydratatie loopt ${delta} ml voor op je dagschema`,
      expectedProgress,
    };
  }

  // 🟠 Binnen 15% achterstand
  if (deviationRatio <= 0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: `Hydratatie loopt ${Math.abs(
        delta
      )} ml achter op je dagschema`,
      expectedProgress,
    };
  }

  // 🔴 Meer dan 15% achterstand
  return {
    color: "bg-[#C80000] text-white",
    message: `Hydratatie loopt ${Math.abs(
      delta
    )} ml achter op je dagschema`,
    expectedProgress,
  };
}
