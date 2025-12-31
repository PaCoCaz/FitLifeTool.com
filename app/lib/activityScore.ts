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
 * ─────────────────────────────────────────────
 * ActivityScore – dagtotaal (0–100)
 * ─────────────────────────────────────────────
 */
export function calculateActivityScore(
  burnedCalories: number,
  dailyGoal: number
): number {
  if (dailyGoal <= 0) return 0;
  return Math.min(
    100,
    Math.round((burnedCalories / dailyGoal) * 100)
  );
}

/**
 * ─────────────────────────────────────────────
 * Verwachte activiteit-voortgang (24u, gewogen)
 * Zwaar: 07:00–23:00
 * Licht: 23:00–07:00
 * ─────────────────────────────────────────────
 */
export function getExpectedActivityProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  const nightWeight = 0.2; // 20%
  const dayWeight = 0.8;   // 80%

  if (hour < 7) {
    // nacht (23–07)
    return Math.min(
      (hour + 1) / 8 * nightWeight,
      nightWeight
    );
  }

  if (hour < 23) {
    // dag (07–23)
    return (
      nightWeight +
      ((hour - 7) / 16) * dayWeight
    );
  }

  return 1;
}

/**
 * ─────────────────────────────────────────────
 * Activiteit-status (kleur + tekst)
 * ─────────────────────────────────────────────
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

  const deviationRatio = delta / dailyGoal;

  // Groen → op of voor schema
  if (delta >= 0) {
    return {
      color: "bg-green-600 text-white",
      message: `Goed bezig, je activiteit loopt ${delta} kcal voor op schema`,
      expectedProgress,
    };
  }

  // Oranje → max 15% achter
  if (deviationRatio >= -0.15) {
    return {
      color: "bg-orange-500 text-white",
      message: `Je activiteit loopt ${Math.abs(delta)} kcal achter op schema`,
      expectedProgress,
    };
  }

  // Rood → verder achter
  return {
    color: "bg-[#C80000] text-white",
    message: `Je activiteit loopt ${Math.abs(delta)} kcal achter op schema`,
    expectedProgress,
  };
}

/**
 * ─────────────────────────────────────────────
 * Activity types (MVP)
 * ─────────────────────────────────────────────
 */
export const ACTIVITY_TYPES = {
  walking: { label: "Wandelen", met: 3.5 },
  cycling: { label: "Fietsen", met: 6.8 },
  running: { label: "Hardlopen", met: 9.8 },
  strength_training: { label: "Krachttraining", met: 6.0 },
  yoga: { label: "Yoga", met: 2.5 },
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;
