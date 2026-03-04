//  app/lib/recalculateUserTargets.ts

import { supabase } from "@/lib/supabaseClient";

import {
  calculateAge,
  calculateBMR,
  activityMultiplier,
  adjustForGoal,
  calculateWaterGoal,
  calculateBMI,
  calculateActivityGoal,
} from "@/lib/calculations";

export async function recalculateUserTargets(userId: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      birthdate,
      height_cm,
      weight_kg,
      calculation_sex,
      activity_level,
      goal
    `)
    .eq("id", userId)
    .single();

  if (error || !profile) return;

  const age = calculateAge(profile.birthdate);

  const bmr = calculateBMR(
    profile.calculation_sex,
    profile.weight_kg,
    profile.height_cm,
    age
  );

  const tdee =
    bmr * activityMultiplier(profile.activity_level);

  const calorieGoal = Math.round(
    adjustForGoal(tdee, profile.goal)
  );

  const activityGoal = calculateActivityGoal(
    tdee,
    profile.goal
  );

  const waterGoal = calculateWaterGoal(profile.weight_kg);

  const bmi = calculateBMI(
    profile.weight_kg,
    profile.height_cm
  );

  await supabase
    .from("profiles")
    .update({
      tdee: Math.round(tdee),
      calorie_goal: calorieGoal,
      activity_goal_kcal: activityGoal,
      water_goal_ml: waterGoal,
      bmi,
    })
    .eq("id", userId);
}