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

import {
  calculateDailyFitLifeScore,
} from "../../lib/fitlifeScore";

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

  // 🔒 Logische tijd (schema / reset / DB)
  const dayNow = useDayNow();

  // 👁️ UI-tijd (exact synchroon met systeem)
  const clockNow = useClockNow();

  /* ───── Ruwe data ───── */
  const [hydrationTotal, setHydrationTotal] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(0);

  const [burnedCalories, setBurnedCalories] = useState(0);
  const activityGoal = 300;

  /* Scores */
  const [hydrationScore, setHydrationScore] = useState(0);
  const [activityScore, setActivityScore] = useState(0);
  const nutritionScore = 100; // tijdelijk neutraal

  /* Init flag */
  const [hasLoaded, setHasLoaded] = useState(false);

  /* ───── Data laden (init + events) ───── */
  async function loadData(initial = false) {
    if (!user) return;

    const date = dayKeyFromNow(dayNow);

    /* Hydration */
    const [{ data: profile }, { data: hydrationLogs }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("water_goal_ml")
          .eq("id", user.id)
          .single<Profile>(),

        supabase
          .from("hydration_logs")
          .select("amount_ml, hydration_factor")
          .eq("user_id", user.id)
          .eq("log_date", date)
          .returns<HydrationLog[]>(),
      ]);

    const hydrationSum =
      hydrationLogs?.reduce(
        (sum: number, row: HydrationLog) =>
          sum + row.amount_ml * row.hydration_factor,
        0
      ) ?? 0;

    const goal = profile?.water_goal_ml ?? 0;

    setHydrationTotal(hydrationSum);
    setHydrationGoal(goal);
    setHydrationScore(
      calculateHydrationScore(hydrationSum, goal)
    );

    /* Activity */
    const { data: activityLogs } = await supabase
      .from("activity_logs")
      .select("calories")
      .eq("user_id", user.id)
      .eq("log_date", date)
      .returns<ActivityLog[]>();

    const burned =
      activityLogs?.reduce(
        (sum: number, row: ActivityLog) =>
          sum + row.calories,
        0
      ) ?? 0;

    setBurnedCalories(burned);
    setActivityScore(
      calculateActivityScore(burned, activityGoal)
    );

    if (initial) {
      setHasLoaded(true);
    }
  }

  /* Init */
  useEffect(() => {
    if (!user) return;
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* Live updates (events only) */
  useEffect(() => {
    if (!hasLoaded) return;

    function handleUpdate() {
      loadData(false);
    }

    window.addEventListener("hydration-updated", handleUpdate);
    window.addEventListener("activity-updated", handleUpdate);

    return () => {
      window.removeEventListener("hydration-updated", handleUpdate);
      window.removeEventListener("activity-updated", handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  /* ───── Status (tijd-gevoelig) ───── */

  const hydrationStatus = useMemo(() => {
    return getHydrationStatus(
      hydrationTotal,
      hydrationGoal,
      dayNow
    );
  }, [hydrationTotal, hydrationGoal, dayNow]);

  const activityStatus = useMemo(() => {
    return getActivityStatus(
      burnedCalories,
      activityGoal,
      dayNow
    );
  }, [burnedCalories, activityGoal, dayNow]);

  /* ───── Dagscore ───── */
  const dailyScore = useMemo(() => {
    return calculateDailyFitLifeScore({
      hydrationScore,
      nutritionScore,
      activityScore,
    });
  }, [hydrationScore, activityScore]);

  /* ───── Geaggregeerde statuskleur ───── */
  const statusColor = useMemo(() => {
    const colors = [
      hydrationStatus.color,
      activityStatus.color,
      "bg-green-600 text-white",
    ];

    if (colors.some((c) => c.includes("#C80000"))) {
      return "bg-[#C80000] text-white";
    }

    if (colors.some((c) => c.includes("orange"))) {
      return "bg-orange-500 text-white";
    }

    return "bg-green-600 text-white";
  }, [hydrationStatus, activityStatus]);

  /* ───── Progress ───── */
  const expectedProgress =
    getExpectedHydrationProgress(dayNow);

  const actualProgress = Math.min(
    dailyScore / 100,
    1
  );

  const progressColor =
    statusColor.replace("text-white", "");

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
        <div className="space-y-1">
          <div className="text-3xl font-semibold text-[#191970]">
            {dailyScore}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"
              style={{
                width: `${expectedProgress * 100}%`,
              }}
            />
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${progressColor}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            Samengestelde score op basis van hydratatie,
            voeding en activiteit
          </div>
        </div>
      </div>
    </Card>
  );
}
