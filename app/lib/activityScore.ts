/**
 * ─────────────────────────────────────────────
 * Activity – calorie calculation (MET-based)
 * ─────────────────────────────────────────────
 * Formula:
 * kcal = MET × gewicht (kg) × tijd (uren)
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
 * ─────────────────────────────────────────────
 * ActivityScore – percentage based (FINAL)
 * ─────────────────────────────────────────────
 * 0%   → score 0
 * 50%  → score 50
 * 95%  → score 95
 * 100% → score 100
 * >100% → blijft 100
 */
export function calculateActivityScore(
  burnedCalories: number,
  activityGoal: number
): number {
  if (activityGoal <= 0) return 0;

  const percentage = burnedCalories / activityGoal;
  const score = Math.round(percentage * 100);

  return Math.min(score, 100);
}

/**
 * ─────────────────────────────────────────────
 * Activity types (MVP)
 * MET values based on compendium averages
 * ─────────────────────────────────────────────
 */
export const ACTIVITY_TYPES = {
  walking: {
    label: "Wandelen",
    met: 3.5,
  },
  cycling: {
    label: "Fietsen",
    met: 6.8,
  },
  running: {
    label: "Hardlopen",
    met: 9.8,
  },
  strength_training: {
    label: "Krachttraining",
    met: 6.0,
  },
  yoga: {
    label: "Yoga",
    met: 2.5,
  },
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;
