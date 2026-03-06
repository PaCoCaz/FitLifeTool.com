//  app/lib/DashboardStore.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
  activityCalories: number;

  refreshDashboard: () => Promise<void>;

  ready: boolean; // ← nieuw
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
  const [activityCalories, setActivityCalories] = useState(0);

  const [ready, setReady] = useState(false); // ← nieuw

  /* ───────────────── Dashboard Refresh ───────────────── */

  async function refreshDashboard() {
    if (!user) return;

    setReady(false); // ← nieuw
  
    const [rpcResult, profileResult] = await Promise.all([
      supabase.rpc("dashboard_day_summary", {
        p_user_id: user.id,
        p_day: dayKey,
      }),
  
      supabase
        .from("profiles")
        .select("water_goal_ml")
        .eq("id", user.id)
        .single(),
    ]);
  
    const rows = rpcResult.data;
    const profile = profileResult.data;
  
    const row = rows?.[0];
    if (!row) return;
  
    setNutritionKcal(row.kcal ?? 0);
  
    const drinkMl = row.drink_ml ?? 0;
    const foodMl = row.food_water_ml ?? 0;
  
    setHydrationDrinkMl(drinkMl);
    setHydrationFoodMl(foodMl);
    setHydrationMl(drinkMl + foodMl);
  
    setActivityCalories(row.activity_kcal ?? 0);
  
    setHydrationGoalMl(profile?.water_goal_ml ?? null);

    setReady(true); // ← nieuw
  }

  /* ───────────────── Initial Load ───────────────── */

  useEffect(() => {
    if (!user) return;
  
    refreshDashboard();
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
        activityCalories,
        refreshDashboard,
        ready, // ← nieuw
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/* ───────────────── Hook ───────────────── */

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("DashboardProvider missing");
  return ctx;
}