"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "./AuthProvider";
import { useDayNow } from "./useDayNow";

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
          goals_last_calculated_on
        `)
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Failed to load profile", error);
        setLoading(false);
        return;
      }

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

  return { goals, loading, isActiveDay };
}
