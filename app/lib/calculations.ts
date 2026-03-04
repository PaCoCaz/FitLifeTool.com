// app/lib/calculations.ts

type CalculationSex = "male" | "female";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Goal =
  | "LOSE"
  | "MAINTAIN"
  | "GAIN"
  | "HOLIDAY";

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
    case "LOSE": {
      const deficit = Math.min(500, tdee * 0.2);
      const result = tdee - deficit;
      return Math.max(result, 1600);
    }

    case "GAIN":
      return tdee + 300;

    case "HOLIDAY":
      return tdee;

    default:
      return tdee;
  }
}

/* ───────────────── Water goal ───────────────── */

export function calculateWaterGoal(
  weightKg: number
): number {
  return Math.round(weightKg * 35);
}

/* ───────────────── BMI ───────────────── */

export function calculateBMI(
  weightKg: number,
  heightCm: number
): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/* ───────────────── Activity goal ───────────────── */

export function calculateActivityGoal(
  tdee: number,
  goal: Goal
): number {
  let ratio: number;

  switch (goal) {
    case "LOSE":
      ratio = 0.20;
      break;

    case "GAIN":
      ratio = 0.10;
      break;

    case "HOLIDAY":
      ratio = 0.10;
      break;

    default: // MAINTAIN
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