"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "./AuthProvider";

type DailyGoals = {
  waterGoalMl: number;
  activityGoalKcal: number;
  calorieGoal: number;
};

export function useDailyGoals() {
  const { user } = useUser();
  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadGoals = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select(
          "water_goal_ml, activity_goal_kcal, calorie_goal"
        )
        .eq("id", user.id)
        .single();

      if (data) {
        setGoals({
          waterGoalMl: data.water_goal_ml,
          activityGoalKcal: data.activity_goal_kcal,
          calorieGoal: data.calorie_goal,
        });
      }

      setLoading(false);
    };

    loadGoals();
  }, [user]);

  return { goals, loading };
}
