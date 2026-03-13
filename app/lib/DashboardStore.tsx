// app/lib/DashboardStore.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

/* ───────────────── Types ───────────────── */

type DashboardState = {
  hydrationMl: number;
  hydrationDrinkMl: number;
  hydrationFoodMl: number;
  hydrationGoalMl: number | null;

  nutritionKcal: number;
  calorieGoal: number | null;

  activityCalories: number;
  activityGoal: number | null;

  refreshDashboard: () => Promise<void>;

  ready: boolean;
};

const DashboardContext = createContext<DashboardState | null>(null);

/* ───────────────── Provider ───────────────── */

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const [hydrationMl, setHydrationMl] = useState(0);
  const [hydrationDrinkMl, setHydrationDrinkMl] = useState(0);
  const [hydrationFoodMl, setHydrationFoodMl] = useState(0);
  const [hydrationGoalMl, setHydrationGoalMl] = useState<number | null>(null);

  const [nutritionKcal, setNutritionKcal] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);

  const [activityCalories, setActivityCalories] = useState(0);
  const [activityGoal, setActivityGoal] = useState<number | null>(null);

  const [ready, setReady] = useState(false);

  const refreshingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ───────────────── Refresh ───────────────── */

  async function refreshDashboard(dayKeyOverride?: string) {
    if (!user?.id) return;
    if (refreshingRef.current) return;
  
    refreshingRef.current = true;
  
    if (mountedRef.current) {
      setReady(false);
    }
  
    const freshDayKey =
      dayKeyOverride ?? getLocalDayKey(new Date());
  
    const [rpcResult, profileResult] = await Promise.all([
      supabase.rpc("dashboard_day_summary", {
        p_user_id: user.id,
        p_day: freshDayKey,
      }),
  
      supabase
        .from("profiles")
        .select(
          "water_goal_ml, calorie_goal, activity_goal_kcal"
        )
        .eq("id", user.id)
        .single(),
    ]);
  
    if (!mountedRef.current) {
      refreshingRef.current = false;
      return;
    }
  
    const rows = rpcResult.data;
    const profile = profileResult.data;
  
    const row = rows?.[0];
  
    if (row) {
      setNutritionKcal(row.kcal ?? 0);
  
      const drinkMl = row.drink_ml ?? 0;
      const foodMl = row.food_water_ml ?? 0;
  
      setHydrationDrinkMl(drinkMl);
      setHydrationFoodMl(foodMl);
      setHydrationMl(drinkMl + foodMl);
  
      setActivityCalories(row.activity_kcal ?? 0);
    } else {
      setNutritionKcal(0);
      setHydrationMl(0);
      setHydrationDrinkMl(0);
      setHydrationFoodMl(0);
      setActivityCalories(0);
    }
  
    setHydrationGoalMl(profile?.water_goal_ml ?? null);
    setCalorieGoal(profile?.calorie_goal ?? null);
    setActivityGoal(profile?.activity_goal_kcal ?? null);
  
    setReady(true);
  
    refreshingRef.current = false;
  }

  /* ───────────────── Load ───────────────── */

  useEffect(() => {
    if (!user?.id) {
      setReady(false);
      return;
    }
  
    refreshDashboard(dayKey);
  
  }, [user?.id, dayKey]);

  /* ───────────────── Context ───────────────── */

  return (
    <DashboardContext.Provider
      value={{
        hydrationMl,
        hydrationDrinkMl,
        hydrationFoodMl,
        hydrationGoalMl,

        nutritionKcal,
        calorieGoal,

        activityCalories,
        activityGoal,

        refreshDashboard,
        ready,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/* ───────────────── Hook ───────────────── */

export function useDashboard() {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error("DashboardProvider missing");
  }

  return ctx;
}