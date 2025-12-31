type CalculationSex = "male" | "female";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Goal =
  | "lose_weight"
  | "maintain"
  | "gain_weight"
  | "build_muscle";

/* ───────────────── Leeftijd ───────────────── */

export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/* ───────────────── BMR ───────────────── */

export function calculateBMR(
  sex: CalculationSex,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

/* ───────────────── Activity multiplier ───────────────── */

export function activityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "very_active":
      return 1.9;
    default:
      return 1.2;
  }
}

/* ───────────────── Calorie adjustment for goal ───────────────── */

export function adjustForGoal(
  tdee: number,
  goal: Goal
): number {
  switch (goal) {
    case "lose_weight": {
      // Maximaal 20% tekort of 500 kcal (wat lager is)
      const deficit = Math.min(500, tdee * 0.2);
      const result = tdee - deficit;

      // Minimum bescherming (mannen)
      return Math.max(result, 1600);
    }

    case "gain_weight":
      return tdee + 300;

    default:
      return tdee;
  }
}

/* ───────────────── Water goal ───────────────── */

export function calculateWaterGoal(
  weightKg: number
): number {
  return Math.round(weightKg * 35); // ml per dag
}

/* ───────────────── BMI ───────────────── */

export function calculateBMI(
  weightKg: number,
  heightCm: number
): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // 1 decimaal
}

/* ───────────────── Activity goal (NIEUW) ───────────────── */

/**
 * Dagelijks activiteitsdoel (kcal)
 * Afgeleid van TDEE en gebruikersdoel
 *
 * - lose_weight  → 20% van TDEE
 * - maintain     → 15% van TDEE
 * - gain_weight  → 10% van TDEE
 * - build_muscle → 15% van TDEE
 *
 * Met veiligheidsgrenzen:
 * - min 200 kcal
 * - max 800 kcal
 */
export function calculateActivityGoal(
  tdee: number,
  goal: Goal
): number {
  let ratio: number;

  switch (goal) {
    case "lose_weight":
      ratio = 0.20;
      break;

    case "gain_weight":
      ratio = 0.10;
      break;

    case "build_muscle":
      ratio = 0.15;
      break;

    default: // maintain
      ratio = 0.15;
  }

  const raw = tdee * ratio;

  return Math.round(
    Math.min(
      800,
      Math.max(200, raw)
    )
  );
}
