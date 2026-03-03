// app/lib/fitlifeScore.ts

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

/* ───────────────── Status-kleur aggregatie (LIVE) ───────────────── */

/**
 * Combineert meerdere card-statussen tot één LIVE dagstatus.
 *
 * REGELS (definitief):
 * - 🔴 rood   → als één card rood is
 * - 🟠 oranje → als niets rood is, maar ≥1 card oranje
 * - 🟢 groen  → ALLE cards groen
 * - ⚪ grijs  → zolang niet alle cards een status hebben
 *
 * ⚠️ DEFENSIEF:
 * - veilig bij async laden
 * - veilig bij dagreset (00:00)
 * - geen false positives
 */
export function getFitLifeStatusColor(
  statusColors: Array<string | undefined | null>
): string {
  // ❗ Zolang niet alle cards een status hebben → grijs
  if (statusColors.some((c) => typeof c !== "string")) {
    return "bg-gray-400 text-white";
  }

  const colors = statusColors as string[];

  // 🔴 Rood heeft altijd prioriteit
  if (colors.some((c) => c.includes("bg-[#C80000]"))) {
    return "bg-[#C80000] text-white";
  }

  // 🟠 Daarna oranje
  if (colors.some((c) => c.includes("bg-orange-500"))) {
    return "bg-orange-500 text-white";
  }

  // 🟢 Alleen als ALLES groen is
  return "bg-green-600 text-white";
}

/* ───────────────── Dagelijkse FitLifeScore ───────────────── */

/**
 * Dagelijkse FitLifeScore (numeriek)
 *
 * Weegfactoren:
 * - Hydration: 30%
 * - Nutrition: 40%
 * - Activity: 30%
 *
 * ⚠️ Dit getal is informatief.
 * LIVE statuskleur wordt bepaald via
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

  // Bewust afronden naar beneden
  return Math.floor(weighted);
}
