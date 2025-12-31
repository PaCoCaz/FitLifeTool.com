/**
 * ─────────────────────────────────────────────
 * FitLifeScore – aggregatie & algemene UI helpers
 *
 * Dit bestand bevat GEEN domeinspecifieke logica
 * (zoals Hydration / Nutrition / Activity).
 *
 * Het is uitsluitend verantwoordelijk voor:
 * - algemene scorekleuren (0–100)
 * - aggregatie van dag-scores
 * ─────────────────────────────────────────────
 */

/* ───────────────── Algemene scorekleuren ───────────────── */

/**
 * Algemene FitLifeScore-kleur (0–100)
 *
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
 * Progressbar-kleur (zelfde drempels, zonder tekst)
 */
export function getFitLifeProgressColor(score: number) {
  if (score < 60) return "bg-[#C80000]";
  if (score < 100) return "bg-orange-500";
  return "bg-green-600";
}

/* ───────────────── Dagelijkse FitLifeScore ───────────────── */

/**
 * Dagelijkse FitLifeScore
 *
 * Weegfactoren:
 * - Hydration: 30%
 * - Nutrition: 40%
 * - Activity: 30%
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
