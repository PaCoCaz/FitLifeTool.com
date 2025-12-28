/**
 * ─────────────────────────────────────────────
 * FitLifeScore – algemene helpers
 * ─────────────────────────────────────────────
 */
 export function getFitLifeScoreColor(score: number) {
    if (score < 50) return "border-[#C80000] text-[#C80000]";
    if (score < 75) return "border-orange-400 text-orange-500";
    return "border-green-500 text-green-600";
  }
  
  /**
   * ─────────────────────────────────────────────
   * HydrationScore
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
  