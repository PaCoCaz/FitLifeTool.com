type CalculationSex = "male" | "female";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

type Goal = "lose_weight" | "maintain" | "gain_weight";

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

export function calculateWaterGoal(
  weightKg: number
): number {
  return Math.round(weightKg * 35); // ml per dag
}

export function calculateBMI(
  weightKg: number,
  heightCm: number
): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // 1 decimaal
}
