"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { useDayNow } from "../../lib/useDayNow";
import { useClockNow } from "../../lib/useClockNow";

import {
  calculateHydrationScore,
  getHydrationStatus,
  getExpectedHydrationProgress,
} from "../../lib/hydrationScore";

import {
  calculateActivityScore,
  getActivityStatus,
} from "../../lib/activityScore";

import { calculateDailyFitLifeScore } from "../../lib/fitlifeScore";
import { DashboardEventMap } from "../../lib/dashboardEvents";

/* ───────────────── Types ───────────────── */

type HydrationLog = {
  amount_ml: number;
  hydration_factor: number;
};

type ActivityLog = {
  calories: number;
};

type Profile = {
  water_goal_ml: number;
  activity_goal_kcal: number | null;
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

  const dayNow = useDayNow();
  const clockNow = useClockNow();

  /* ───── Ruwe data ───── */
  const [hydrationTotal, setHydrationTotal] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(0);

  const [burnedCalories, setBurnedCalories] = useState(0);
  const [activityGoal, setActivityGoal] = useState(0);

  /* Scores */
  const [hydrationScore, setHydrationScore] = useState(0);
  const [activityScore, setActivityScore] = useState(0);

  const [nutritionScore, setNutritionScore] = useState(100);
  const [nutritionStatusColor, setNutritionStatusColor] =
    useState("bg-green-600 text-white");

  const [hasLoaded, setHasLoaded] = useState(false);

  /* ───── Data laden ───── */
  async function loadData(initial = false) {
    if (!user) return;

    const date = dayKeyFromNow(dayNow);

    const [
      { data: profile },
      { data: hydrationLogsRaw },
      { data: activityLogsRaw },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("water_goal_ml, activity_goal_kcal")
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
    ]);

    /* Hydration */
    const hydrationLogs: HydrationLog[] =
      (hydrationLogsRaw as HydrationLog[]) ?? [];

    const hydrationSum = hydrationLogs.reduce(
      (sum, row) =>
        sum + row.amount_ml * row.hydration_factor,
      0
    );

    const waterGoal = profile?.water_goal_ml ?? 0;

    setHydrationTotal(hydrationSum);
    setHydrationGoal(waterGoal);
    setHydrationScore(
      calculateHydrationScore(hydrationSum, waterGoal)
    );

    /* Activity */
    const activityLogs: ActivityLog[] =
      (activityLogsRaw as ActivityLog[]) ?? [];

    const burned = activityLogs.reduce(
      (sum, row) => sum + row.calories,
      0
    );

    const aGoal = profile?.activity_goal_kcal ?? 0;

    setBurnedCalories(burned);
    setActivityGoal(aGoal);

    if (aGoal > 0) {
      setActivityScore(
        calculateActivityScore(burned, aGoal)
      );
    }

    if (initial) setHasLoaded(true);
  }

  /* Init */
  useEffect(() => {
    if (!user) return;
    loadData(true);
  }, [user]);

  /* Hydration + Activity updates */
  useEffect(() => {
    if (!hasLoaded) return;

    const handleUpdate = () => loadData(false);

    window.addEventListener("hydration-updated", handleUpdate);
    window.addEventListener("activity-updated", handleUpdate);

    return () => {
      window.removeEventListener("hydration-updated", handleUpdate);
      window.removeEventListener("activity-updated", handleUpdate);
    };
  }, [hasLoaded]);

  /* 🔔 Nutrition — STAP 8 (type-safe) */
  useEffect(() => {
    const handler = (
      e: CustomEvent<DashboardEventMap["nutrition-updated"]>
    ) => {
      setNutritionScore(e.detail.score);
      setNutritionStatusColor(e.detail.color);
    };

    window.addEventListener(
      "nutrition-updated",
      handler as EventListener
    );

    return () => {
      window.removeEventListener(
        "nutrition-updated",
        handler as EventListener
      );
    };
  }, []);

  /* Status */
  const hydrationStatus = useMemo(
    () =>
      getHydrationStatus(
        hydrationTotal,
        hydrationGoal,
        dayNow
      ),
    [hydrationTotal, hydrationGoal, dayNow]
  );

  const activityStatus = useMemo(
    () =>
      getActivityStatus(
        burnedCalories,
        activityGoal,
        dayNow
      ),
    [burnedCalories, activityGoal, dayNow]
  );

  /* Dagscore */
  const dailyScore = useMemo(() => {
    const raw = calculateDailyFitLifeScore({
      hydrationScore,
      nutritionScore,
      activityScore,
    });

    const weakest = Math.min(
      hydrationScore,
      nutritionScore,
      activityScore
    );

    return weakest === 100 ? 100 : Math.min(raw, weakest);
  }, [hydrationScore, nutritionScore, activityScore]);

  /* Statuskleur */
  const statusColor = useMemo(() => {
    const colors = [
      hydrationStatus.color,
      activityStatus.color,
      nutritionStatusColor,
    ];

    if (colors.some((c) => c.includes("#C80000")))
      return "bg-[#C80000] text-white";

    if (colors.some((c) => c.includes("orange")))
      return "bg-orange-500 text-white";

    return "bg-green-600 text-white";
  }, [hydrationStatus, activityStatus, nutritionStatusColor]);

  /* Progress */
  const expectedProgress =
    getExpectedHydrationProgress(dayNow);

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
