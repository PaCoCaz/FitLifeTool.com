export type OnboardingStep = "profile" | "personal" | "body" | "final" | "complete";

export type OnboardingProfile = {
  country_code: string | null;
  food_region: string | null;
  gender: string | null;
  birthdate: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  calculation_sex: string | null;
  activity_level: string | null;
};

export function getOnboardingStep(
  profile: OnboardingProfile | null,
  hasActiveGoal: boolean
): OnboardingStep {
  if (!profile?.country_code || !profile.food_region) return "profile";
  if (!profile.gender || !profile.birthdate) return "personal";
  if (
    profile.height_cm == null ||
    profile.weight_kg == null ||
    !profile.calculation_sex
  ) {
    return "body";
  }
  if (!profile.activity_level || !hasActiveGoal) return "final";
  return "complete";
}

export const ONBOARDING_PROFILE_FIELDS =
  "country_code, food_region, gender, birthdate, height_cm, weight_kg, calculation_sex, activity_level";
