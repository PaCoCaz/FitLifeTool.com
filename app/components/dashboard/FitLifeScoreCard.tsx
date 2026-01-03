"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { useDayNow } from "../../lib/useDayNow";
import { useClockNow } from "../../lib/useClockNow";

import {
  getHydrationStatus,
  getExpectedHydrationProgress,
} from "../../lib/hydrationScore";

import { getActivityStatus } from "../../lib/activityScore";
import { getNutritionStatus } from "../../lib/nutritionScore";

import {
  getFitLifeStatusColor,
} from "../../lib/fitlifeScore";

/* ───────────────── Types ───────────────── */

type HydrationLog = {
  amount_ml: number;
  hydration_factor: number;
};

type ActivityLog = {
  calories: number;
};

type NutritionLog = {
  calories: number;
};

type Profile = {
  water_goal_ml: number;
  activity_goal_kcal: number | null;
  calorie_goal: number;
  goal: "lose_weight" | "maintain" | "gain_weight";
};

/* ───────────────── Utils ───────────────── */

function dayKeyFromNow(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function formatTime(now: Date): string {
  return now.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {
  const { user } = useUser();

  const dayNow = useDayNow();      // ✅ dagreset om 00:00
  const clockNow = useClockNow();  // ⏱️ live tijd

  const [hasLoaded, setHasLoaded] = useState(false);

  /* Schema-scores (0–100) */
  const [hydrationScore, setHydrationScore] = useState(100);
  const [activityScore, setActivityScore] = useState(100);
  const [nutritionScore, setNutritionScore] = useState(100);

  /* Statuskleuren per component */
  const [hydrationColor, setHydrationColor] =
    useState("bg-green-600 text-white");
  const [activityColor, setActivityColor] =
    useState("bg-green-600 text-white");
  const [nutritionColor, setNutritionColor] =
    useState("bg-green-600 text-white");

  /* ───────────────── Data laden ───────────────── */

  async function loadData(initial = false) {
    if (!user) return;

    const date = dayKeyFromNow(dayNow);

    const [
      { data: profile },
      { data: hydrationLogs },
      { data: activityLogs },
      { data: nutritionLogs },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "water_goal_ml, activity_goal_kcal, calorie_goal, goal"
        )
        .eq("id", user.id)
        .single<Profile>(),

      supabase
        .from("hydration_logs")
        .select("amount_ml, hydration_factor")
        .eq("user_id", user.id)
        .eq("log_date", date),

      supabase
        .from("activity_logs")
        .select("calories")
        .eq("user_id", user.id)
        .eq("log_date", date),

      supabase
        .from("nutrition_logs")
        .select("calories")
        .eq("user_id", user.id)
        .eq("log_date", date),
    ]);

    if (!profile) return;

    /* ───── Hydration ───── */
    const hydrationSum =
      (hydrationLogs as HydrationLog[] | null)?.reduce(
        (sum, r) =>
          sum + r.amount_ml * r.hydration_factor,
        0
      ) ?? 0;

    const hydrationStatus = getHydrationStatus(
      hydrationSum,
      profile.water_goal_ml,
      clockNow
    );

    setHydrationColor(hydrationStatus.color);
    setHydrationScore(
      hydrationStatus.color.includes("#C80000")
        ? 60
        : hydrationStatus.color.includes("orange")
        ? 85
        : 100
    );

    /* ───── Activity ───── */
    const burned =
      (activityLogs as ActivityLog[] | null)?.reduce(
        (sum, r) => sum + r.calories,
        0
      ) ?? 0;

    const activityStatus = getActivityStatus(
      burned,
      profile.activity_goal_kcal ?? 0,
      clockNow
    );

    setActivityColor(activityStatus.color);
    setActivityScore(
      activityStatus.color.includes("#C80000")
        ? 60
        : activityStatus.color.includes("orange")
        ? 85
        : 100
    );

    /* ───── Nutrition ───── */
    const eaten =
      (nutritionLogs as NutritionLog[] | null)?.reduce(
        (sum, r) => sum + r.calories,
        0
      ) ?? 0;

    const nutritionStatus = getNutritionStatus(
      eaten,
      profile.calorie_goal + burned,
      profile.goal,
      clockNow
    );

    setNutritionColor(nutritionStatus.color);
    setNutritionScore(
      nutritionStatus.color.includes("#C80000")
        ? 60
        : nutritionStatus.color.includes("orange")
        ? 85
        : 100
    );

    if (initial) setHasLoaded(true);
  }

  /* Init + dagwissel */
  useEffect(() => {
    if (!user) return;
    setHasLoaded(false);
    loadData(true);
  }, [user, dayNow]);

  /* Updates na logs */
  useEffect(() => {
    if (!hasLoaded) return;

    const handleUpdate = () => loadData(false);

    window.addEventListener("hydration-updated", handleUpdate);
    window.addEventListener("activity-updated", handleUpdate);
    window.addEventListener("nutrition-updated", handleUpdate);

    return () => {
      window.removeEventListener("hydration-updated", handleUpdate);
      window.removeEventListener("activity-updated", handleUpdate);
      window.removeEventListener("nutrition-updated", handleUpdate);
    };
  }, [hasLoaded]);

  /* Totale FitLifeScore (gewogen dagschema) */
  const dailyScore = useMemo(() => {
    return Math.floor(
      hydrationScore * 0.3 +
      activityScore * 0.3 +
      nutritionScore * 0.4
    );
  }, [hydrationScore, activityScore, nutritionScore]);

  /* Totale statuskleur – centrale helper */
  const statusColor = useMemo(() => {
    return getFitLifeStatusColor([
      hydrationColor,
      activityColor,
      nutritionColor,
    ]);
  }, [hydrationColor, activityColor, nutritionColor]);

  /* Progress */
  const expectedProgress =
    getExpectedHydrationProgress(clockNow);
  const actualProgress = Math.min(dailyScore / 100, 1);

  if (!hasLoaded) {
    return (
      <Card title="FitLifeScore">
        <div className="text-sm text-gray-400">
          Score berekenen…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="FitLifeScore"
      action={
        <div
          className={`
            rounded-[var(--radius)]
            px-3 py-1
            text-xs
            font-semibold
            tabular-time
            min-w-[130px]
            text-center
            ${statusColor}
          `}
        >
          Vandaag | {formatTime(clockNow)}
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        <div className="text-3xl font-semibold text-[#191970]">
          {dailyScore}
        </div>

        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"
              style={{ width: `${expectedProgress * 100}%` }}
            />
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${statusColor.replace(
                "text-white",
                ""
              )}`}
              style={{ width: `${actualProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
