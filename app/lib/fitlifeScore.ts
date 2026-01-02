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
 * - aggregatie van status-kleuren (groen / oranje / rood)
 * ─────────────────────────────────────────────
 */

/* ───────────────── Algemene scorekleuren ───────────────── */

/**
 * Algemene FitLifeScore-kleur (0–100)
 *
 * 🔴 < 60
 * 🟠 60 – 99
 * 🟢 EXACT 100
 *
 * ⚠️ Gebruik deze alleen voor:
 * - historische scores
 * - grafieken
 * - trendweergave
 *
 * NIET voor live status-feedback
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
 * Progressbar-kleur (op basis van score, zonder tekst)
 */
export function getFitLifeProgressColor(score: number) {
  if (score < 60) return "bg-[#C80000]";
  if (score < 100) return "bg-orange-500";
  return "bg-green-600";
}

/* ───────────────── Status-kleur aggregatie ───────────────── */

/**
 * Combineert meerdere status-kleuren tot één dagstatus.
 *
 * Prioriteit:
 * 🔴 rood   → altijd rood
 * 🟠 oranje → als niets rood is
 * 🟢 groen  → alleen als alles groen is
 *
 * Verwacht Tailwind classes zoals:
 * - "bg-green-600 text-white"
 * - "bg-orange-500 text-white"
 * - "bg-[#C80000] text-white"
 */
export function getFitLifeStatusColor(
  statusColors: string[]
): string {
  if (
    statusColors.some((c) =>
      c.includes("bg-[#C80000]")
    )
  ) {
    return "bg-[#C80000] text-white";
  }

  if (
    statusColors.some((c) =>
      c.includes("bg-orange-500")
    )
  ) {
    return "bg-orange-500 text-white";
  }

  return "bg-green-600 text-white";
}

/* ───────────────── Dagelijkse FitLifeScore ───────────────── */

/**
 * Dagelijkse FitLifeScore
 *
 * Weegfactoren:
 * - Hydration: 30%
 * - Nutrition: 40%
 * - Activity: 30%
 *
 * ⚠️ Dit getal is informatief.
 * De LIVE statuskleur wordt bepaald via
 * `getFitLifeStatusColor`.
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

  return Math.floor(weighted); // ⬅️ cruciaal
}
