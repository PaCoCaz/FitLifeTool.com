// app/lib/DashboardStore.tsx

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useBrowserReturnRefresh } from "@/lib/useBrowserReturnRefresh";

/* ───────────────── Types ───────────────── */

type UserGoal = "LOSE" | "MAINTAIN" | "GAIN";

type PlanFeatures = {
  has_full_food_database: boolean;
  has_ai_coach: boolean;
  has_advanced_search_filters: boolean;
};

type PlanLimits = {
  max_favorite_foods: number | null;
  max_favorite_drinks: number | null;
};

type DashboardState = {
  features: PlanFeatures;
  limits: PlanLimits;

  hydrationMl: number;
  hydrationDrinkMl: number;
  hydrationFoodMl: number;
  hydrationGoalMl: number | null;

  nutritionKcal: number;
  calorieGoal: number | null;
  goal: UserGoal | null;

  activityCalories: number;
  activityGoal: number | null;

  abonnement: string;

  refreshDashboard: () => Promise<void>;

  ready: boolean;
};

const DEFAULT_FEATURES: PlanFeatures = {
  has_full_food_database: false,
  has_ai_coach: false,
  has_advanced_search_filters: false,
};

const DEFAULT_LIMITS: PlanLimits = {
  max_favorite_foods: 3,
  max_favorite_drinks: 3,
};

const DashboardContext = createContext<DashboardState | null>(null);

type SupabaseErrorDetails = {
  message?: unknown;
  code?: unknown;
  details?: unknown;
  hint?: unknown;
};

function logDashboardError(label: string, error: SupabaseErrorDetails) {
  console.error(label, {
    message: error.message ?? null,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  });
}

/* ───────────────── Provider ───────────────── */

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const isOnboarding =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  /* ───────────────── State ───────────────── */

  const [hydrationMl, setHydrationMl] = useState(0);
  const [hydrationDrinkMl, setHydrationDrinkMl] = useState(0);
  const [hydrationFoodMl, setHydrationFoodMl] = useState(0);
  const [hydrationGoalMl, setHydrationGoalMl] =
    useState<number | null>(null);

  const [nutritionKcal, setNutritionKcal] = useState(0);
  const [calorieGoal, setCalorieGoal] =
    useState<number | null>(null);

  const [goal, setGoal] = useState<UserGoal | null>(null);

  const [activityCalories, setActivityCalories] = useState(0);
  const [activityGoal, setActivityGoal] =
    useState<number | null>(null);

  const [abonnement, setAbonnement] = useState("free");

  const [features, setFeatures] =
    useState<PlanFeatures>(DEFAULT_FEATURES);

  const [limits, setLimits] =
    useState<PlanLimits>(DEFAULT_LIMITS);

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

  const refreshDashboard = useCallback(async (
    dayKeyOverride?: string
  ): Promise<void> => {
    if (!user?.id || isOnboarding) {
      return;
    }

    if (refreshingRef.current) {
      return;
    }

    refreshingRef.current = true;

    if (mountedRef.current) {
      setReady(false);
    }

    try {
      const freshDayKey =
        dayKeyOverride ?? getLocalDayKey(new Date());

      /*
       * De basisprofielgegevens en goal worden bewust
       * apart opgehaald.
       *
       * Daardoor kan een fout bij de kolom "goal"
       * niet meer de query voor "abonnement" laten mislukken.
       */
      const [
        rpcResult,
        profileResult,
        goalResult,
        planResult,
      ] = await Promise.all([
        supabase.rpc("dashboard_day_summary", {
          p_user_id: user.id,
          p_day: freshDayKey,
        }),

        supabase
          .from("profiles")
          .select(
            `
            water_goal_ml,
            calorie_goal,
            activity_goal_kcal,
            abonnement
            `
          )
          .eq("id", user.id)
          .maybeSingle(),

        supabase
          .from("profiles")
          .select("goal")
          .eq("id", user.id)
          .maybeSingle(),

        supabase.rpc("get_user_plan_features", {
          p_user_id: user.id,
        }),
      ]);

      if (!mountedRef.current) {
        return;
      }

      /* ───────────── Error logging ───────────── */

      if (rpcResult.error) {
        logDashboardError("Dashboard summary error:", rpcResult.error);
      }

      if (profileResult.error) {
        logDashboardError("Dashboard profile error:", profileResult.error);
      }

      if (goalResult.error) {
        logDashboardError("Dashboard goal error:", goalResult.error);
      }

      if (planResult.error) {
        logDashboardError("Dashboard plan error:", planResult.error);
      }

      /* ───────────── Daily summary ───────────── */

      const rows = rpcResult.data;
      const row = Array.isArray(rows) ? rows[0] : null;

      if (row) {
        const drinkMl = Number(row.drink_ml ?? 0);
        const foodMl = Number(row.food_water_ml ?? 0);

        setNutritionKcal(
          Number(row.kcal ?? 0)
        );

        setHydrationDrinkMl(drinkMl);
        setHydrationFoodMl(foodMl);
        setHydrationMl(drinkMl + foodMl);

        setActivityCalories(
          Number(row.activity_kcal ?? 0)
        );
      } else if (!rpcResult.error) {
        setNutritionKcal(0);

        setHydrationMl(0);
        setHydrationDrinkMl(0);
        setHydrationFoodMl(0);

        setActivityCalories(0);
      }

      /* ───────────── Profile ───────────── */

      if (!profileResult.error && profileResult.data) {
        const profile = profileResult.data;

        setHydrationGoalMl(
          profile.water_goal_ml ?? null
        );

        setCalorieGoal(
          profile.calorie_goal ?? null
        );

        setActivityGoal(
          profile.activity_goal_kcal ?? null
        );

        /*
         * Alleen aanpassen wanneer de profielquery echt
         * gelukt is. Een queryfout zet Premium dus niet
         * meer automatisch om naar Free.
         */
        setAbonnement(
          profile.abonnement ?? "free"
        );
      }

      /* ───────────── Goal ───────────── */

      if (!goalResult.error && goalResult.data) {
        const profileGoal = goalResult.data.goal;

        if (
          profileGoal === "LOSE" ||
          profileGoal === "MAINTAIN" ||
          profileGoal === "GAIN"
        ) {
          setGoal(profileGoal);
        } else {
          setGoal(null);
        }
      }

      /* ───────────── Plan features ───────────── */

      const plan = Array.isArray(planResult.data)
        ? planResult.data[0]
        : planResult.data;

      if (!planResult.error && plan) {
        setFeatures({
          has_full_food_database:
            plan.features?.has_full_food_database ?? false,

          has_ai_coach:
            plan.features?.has_ai_coach ?? false,

          has_advanced_search_filters:
            plan.features?.has_advanced_search_filters ?? false,
        });

        setLimits({
          max_favorite_foods:
            plan.limits?.max_favorite_foods ?? null,

          max_favorite_drinks:
            plan.limits?.max_favorite_drinks ?? null,
        });
      } else if (!planResult.error) {
        setFeatures(DEFAULT_FEATURES);
        setLimits(DEFAULT_LIMITS);
      }
    } catch (error) {
      console.error(
        "Unexpected dashboard refresh error:",
        error
      );
    } finally {
      refreshingRef.current = false;

      if (mountedRef.current) {
        setReady(true);
      }
    }
  }, [isOnboarding, user?.id]);

  /* ───────────────── Load ───────────────── */

  useEffect(() => {
    if (!user?.id || isOnboarding) {
      setReady(false);
      return;
    }

    void refreshDashboard(dayKey);
  }, [user?.id, dayKey, isOnboarding, refreshDashboard]);

  useBrowserReturnRefresh(
    () => refreshDashboard(),
    {
      enabled: Boolean(user?.id) && !isOnboarding,
    }
  );

  /* ───────────────── Context ───────────────── */

  return (
    <DashboardContext.Provider
      value={{
        features,
        limits,

        hydrationMl,
        hydrationDrinkMl,
        hydrationFoodMl,
        hydrationGoalMl,

        nutritionKcal,
        calorieGoal,
        goal,

        activityCalories,
        activityGoal,

        abonnement,

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
