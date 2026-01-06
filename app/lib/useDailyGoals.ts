"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "./AuthProvider";
import { useDayNow } from "./useDayNow";

/* ───────────────── Types ───────────────── */

type DailyGoals = {
  waterGoalMl: number;
  activityGoalKcal: number;
  calorieGoal: number;
};

/* ───────────────── Helpers ───────────────── */

function calculateWaterGoal(weightKg: number) {
  return Math.round(weightKg * 35);
}

function calculateActivityGoal(weightKg: number) {
  return Math.round(weightKg * 30);
}

function calculateCalorieGoal(weightKg: number) {
  return Math.round(weightKg * 24);
}

/* ───────────────── Hook ───────────────── */

export function useDailyGoals() {
  const { user } = useUser();
  const dayNow = useDayNow();

  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [loading, setLoading] = useState(true);

  // voorkomt herberekening meerdere keren per dag (runtime)
  const lastDayRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      setLoading(true);

      const dayKey = dayNow.toISOString().slice(0, 10);
      const isNewDay = lastDayRef.current !== dayKey;

      /* 1️⃣ Profiel ophalen (incl. ankergewicht) */
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
          weight_kg,
          water_goal_ml,
          activity_goal_kcal,
          calorie_goal,
          goals_calculated_for_weight
        `
        )
        .eq("id", user.id)
        .single();

      if (error || !profile || !profile.weight_kg) {
        setLoading(false);
        return;
      }

      const weightKg = profile.weight_kg;

      /* 2️⃣ Bepalen of herberekening nodig is */
      const needsRecalc =
        isNewDay ||
        profile.goals_calculated_for_weight !== weightKg;

      if (needsRecalc) {
        const updates = {
          water_goal_ml: calculateWaterGoal(weightKg),
          activity_goal_kcal: calculateActivityGoal(weightKg),
          calorie_goal: calculateCalorieGoal(weightKg),
          goals_calculated_for_weight: weightKg,
        };

        await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);

        lastDayRef.current = dayKey;

        setGoals({
          waterGoalMl: updates.water_goal_ml,
          activityGoalKcal: updates.activity_goal_kcal,
          calorieGoal: updates.calorie_goal,
        });

        setLoading(false);
        return;
      }

      /* 3️⃣ Geen herberekening → bestaande doelen gebruiken */
      setGoals({
        waterGoalMl: profile.water_goal_ml,
        activityGoalKcal: profile.activity_goal_kcal,
        calorieGoal: profile.calorie_goal,
      });

      lastDayRef.current = dayKey;
      setLoading(false);
    };

    run();
  }, [user, dayNow]);

  return { goals, loading };
}
