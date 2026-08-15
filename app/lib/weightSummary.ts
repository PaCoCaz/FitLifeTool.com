export type WeightProfileSnapshot = {
  weight_kg: number | null;
  bmi: number | null;
  target_weight_kg: number | null;
  height_cm: number | null;
};

export type WeightSummary = {
  weight: number;
  bmi: number;
  targetWeight: number | null;
};

type CalculateBmi = (weightKg: number, heightCm: number) => number;

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function canLoadWeightProfile(
  userId: string | null | undefined
): userId is string {
  return Boolean(userId);
}

export function resolveWeightSummary(
  profile: WeightProfileSnapshot | null,
  error: unknown,
  calculateBmi: CalculateBmi
): WeightSummary | null {
  if (error || !profile || !isPositiveNumber(profile.weight_kg)) {
    return null;
  }

  const bmi = isPositiveNumber(profile.bmi)
    ? profile.bmi
    : isPositiveNumber(profile.height_cm)
      ? calculateBmi(profile.weight_kg, profile.height_cm)
      : null;

  if (!isPositiveNumber(bmi)) {
    return null;
  }

  return {
    weight: profile.weight_kg,
    bmi,
    targetWeight: profile.target_weight_kg,
  };
}
