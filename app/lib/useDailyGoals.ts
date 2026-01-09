"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "./AuthProvider";
import { useDayNow } from "./useDayNow";

type Goal =
  | "lose_weight"
  | "maintain"
  | "gain_weight"
  | "build_muscle";

type DailyGoals = {
  waterGoalMl: number;
  activityGoalKcal: number;
  calorieGoal: number;
};

export function useDailyGoals() {
  const { user } = useUser();
  const dayNow = useDayNow();

  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActiveDay, setIsActiveDay] = useState(false);

  const [weightKg, setWeightKg] = useState<number | null>(null); // STAP 4E
  const [tdee, setTdee] = useState<number | null>(null);         // STAP 4J
  const [goal, setGoal] = useState<Goal | null>(null);           // STAP 4J

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      setLoading(true);

      const todayKey = dayNow.toISOString().slice(0, 10);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          weight_kg,
          water_goal_ml,
          activity_goal_kcal,
          calorie_goal,
          goals_calculated_for_weight,
          goals_last_calculated_on,
          tdee,
          goal
        `)
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Failed to load profile", error);
        setLoading(false);
        return;
      }

      // STAP 4E — expose huidig gewicht (read-only)
      setWeightKg(profile.weight_kg);

      // STAP 4J — expose onboarding context (read-only)
      setTdee(profile.tdee);
      setGoal(profile.goal);

      // STAP 3D — herberekenen en schrijven ALLEEN bij nieuwe dag
      const needsRecalc =
        profile.goals_last_calculated_on !== todayKey;

      if (needsRecalc) {
        await supabase
          .from("profiles")
          .update({
            goals_calculated_for_weight: profile.weight_kg,
            goals_last_calculated_on: todayKey,
          })
          .eq("id", user.id);
      }

      const active =
        profile.goals_last_calculated_on === todayKey;

      setIsActiveDay(active);

      setGoals(
        active
          ? {
              waterGoalMl: profile.water_goal_ml,
              activityGoalKcal: profile.activity_goal_kcal,
              calorieGoal: profile.calorie_goal,
            }
          : null
      );

      setLoading(false);
    };

    run();
  }, [user, dayNow]);

  // STAP 3C — live refresh bij dagwissel (read-only)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const currentKey = new Date().toISOString().slice(0, 10);
      const dayKeyFromHook = dayNow.toISOString().slice(0, 10);

      if (currentKey !== dayKeyFromHook) {
        // force re-run via dayNow update (read-only)
        // useDayNow zal hierdoor opnieuw renderen
      }
    }, 60_000); // 1x per minuut

    return () => clearInterval(interval);
  }, [user, dayNow]);

  return {
    goals,
    loading,
    isActiveDay,
    weightKg,
    tdee,   // STAP 4J
    goal,   // STAP 4J
  };
}
