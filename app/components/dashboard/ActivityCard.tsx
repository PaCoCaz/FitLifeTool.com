// app/components/dashboard/ActivityCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useNow } from "@/lib/TimeProvider";

import {
  calculateActivityScore,
  getActivityStatus,
} from "@/lib/activityScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

import { useDashboard } from "@/lib/DashboardStore";

/* ───────────────── Types ───────────────── */

type ActivityLogRow = {
  calories: number;
};

type ActivityGoalProfileRow = {
  activity_goal_kcal: number | null;
};

/* ───────────────── Component ───────────────── */

export default function ActivityCard() {
  const { user } = useUser();

  const { ready } = useDashboard();

  const lang = useLang();
  const t = uiText[lang];

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);
  const now = useNow();

  const [burnedCalories, setBurnedCalories] = useState(0);
  const [activityScore, setActivityScore] = useState(0);
  const [activityGoal, setActivityGoal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* Reset bij dagwissel */

  useEffect(() => {
    setBurnedCalories(0);
    setActivityScore(0);
    setActivityGoal(null);
    setLoading(true);
  }, [dayKey]);

  /* Data laden */

  useEffect(() => {
    if (!user) return;

    const loadActivity = async () => {
      const [{ data: profile }, { data: logs }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("activity_goal_kcal")
            .eq("id", user.id)
            .single(),

          supabase
            .from("activity_logs")
            .select("calories")
            .eq("user_id", user.id)
            .eq("log_date", dayKey),
        ]);

      const goal =
        (profile as ActivityGoalProfileRow | null)
          ?.activity_goal_kcal ?? null;

      setActivityGoal(goal);

      const total =
        (logs as ActivityLogRow[] | null)?.reduce(
          (sum, row) => sum + row.calories,
          0
        ) ?? 0;

      setBurnedCalories(total);

      if (goal) {
        setActivityScore(
          calculateActivityScore(total, goal, now)
        );
      }

      setLoading(false);
    };

    loadActivity();
  }, [user, dayKey, now]);

  /* Status */

  const activityStatus = useMemo(() => {
    if (!activityGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: t.activity.status.noGoal,
        expectedProgress: 0,
      };
    }

    return getActivityStatus(
      burnedCalories,
      activityGoal,
      now,
      t,
      lang
    );
  }, [burnedCalories, activityGoal, now, t]);

  if (!ready || loading || activityGoal === null) {
    return (
      <Card title={t.activity.title}>
        <div className="text-sm text-gray-500">
          {t.activity.loading}
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(
    burnedCalories / activityGoal,
    1
  );

  const barColor =
    activityStatus.color.replace(
      "text-white",
      ""
    );

  return (
    <Card
      title={t.activity.title}
      icon={
        <Image
          src="/activity.svg"
          alt=""
          width={16}
          height={16}
        />
      }
      action={
        <div
          className={`rounded-[var(--radius)] px-3 py-1 text-xs font-semibold whitespace-nowrap ${activityStatus.color}`}
        >
          FitLifeScore {activityScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">

        <div className="space-y-1">

          <div className="text-2xl font-semibold text-[#191970]">
            {formatNumber(
              burnedCalories,
              lang
            )}{" "}
            kcal
          </div>

          <div className="text-xs text-gray-500">
            {t.activity.goal}:{" "}
            {formatNumber(
              activityGoal,
              lang
            )}{" "}
            kcal
          </div>

        </div>

        <div className="mt-4 space-y-2">

          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">

            <div
              className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
              style={{
                width: `${
                  activityStatus.expectedProgress *
                  100
                }%`,
              }}
            />

            <div
              className={`absolute left-0 top-0 h-full transition-all ${barColor}`}
              style={{
                width: `${
                  actualProgress * 100
                }%`,
              }}
            />

          </div>

          <div className="text-xs text-gray-600">
            {activityStatus.message}
          </div>

        </div>

      </div>
    </Card>
  );
}