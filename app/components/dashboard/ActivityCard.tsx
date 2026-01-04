"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import { useToast } from "../../lib/ToastProvider";

import { useDayNow } from "../../lib/useDayNow";
import { getLocalDayKey } from "../../lib/dayKey";
import { useNow } from "../../lib/TimeProvider";

import { dispatchDashboardEvent } from "../../lib/dispatchDashboardEvent";

import {
  ACTIVITY_TYPES,
  ActivityType,
  calculateActivityCalories,
  calculateActivityScore,
  getActivityStatus,
} from "../../lib/activityScore";

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
  const { showToast } = useToast();

  // 🔒 Logische dag
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  // ⏱️ Live tijd
  const now = useNow();

  /* ───── State ───── */
  const [burnedCalories, setBurnedCalories] = useState<number>(0);
  const [activityScore, setActivityScore] = useState<number>(0);
  const [activityGoal, setActivityGoal] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);

  /* ───── ✅ DAGRESET (LOKAAL, GEEN EVENTS) ───── */
  useEffect(() => {
    setBurnedCalories(0);
    setActivityScore(0);
    setActivityGoal(null);
    setLoading(true);
  }, [dayKey]);

  /* ───── Data laden (init + dagwissel) ───── */
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
          calculateActivityScore(total, goal)
        );
      }

      setLoading(false);
    };

    loadActivity();
  }, [user, dayKey]);

  /* ───── Live status (schema) ───── */
  const activityStatus = useMemo(() => {
    if (!activityGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getActivityStatus(
      burnedCalories,
      activityGoal,
      now
    );
  }, [burnedCalories, activityGoal, now]);

  /* ───── Activiteit toevoegen (USER ACTIE) ───── */
  async function addActivity(type: ActivityType) {
    if (!user || !activityGoal) return;

    const weightKg =
      user.user_metadata?.weight_kg ?? 75;

    const calories = calculateActivityCalories(
      ACTIVITY_TYPES[type].met,
      weightKg,
      durationMinutes
    );

    const nowTs = new Date();

    const { error } = await supabase
      .from("activity_logs")
      .insert({
        user_id: user.id,
        activity_type: type,
        duration_minutes: durationMinutes,
        calories,
        log_date: dayKey,
        log_time_local: nowTs
          .toTimeString()
          .slice(0, 8),
        timezone:
          Intl.DateTimeFormat().resolvedOptions()
            .timeZone,
      });

    if (error) {
      console.error(error.message);
      return;
    }

    // ✅ Optimistische update + EVENT (CORRECT)
    setBurnedCalories((prev) => {
      const next = prev + calories;

      const nextScore =
        calculateActivityScore(next, activityGoal);

      setActivityScore(nextScore);

      const nextStatus = getActivityStatus(
        next,
        activityGoal,
        now
      );

      dispatchDashboardEvent("activity-updated", {
        score: nextScore,
        color: nextStatus.color,
      });

      return next;
    });

    showToast(
      `✓ ${ACTIVITY_TYPES[type].label} · ${durationMinutes} min · ${calories} kcal`
    );
  }

  if (loading || activityGoal === null) {
    return (
      <Card title="Activiteit">
        <div className="text-sm text-gray-500">
          Activiteit laden…
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(
    burnedCalories / activityGoal,
    1
  );

  return (
    <Card
      title="Activiteit"
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
          className={`
            rounded-[var(--radius)]
            px-3 py-1
            text-xs
            font-semibold
            whitespace-nowrap
            ${activityStatus.color}
          `}
        >
          FitLifeScore {activityScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {burnedCalories} kcal
          </div>

          <div className="text-xs text-gray-500">
            Dagdoel: {activityGoal} kcal
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
              style={{
                width: `${activityStatus.expectedProgress * 100}%`,
              }}
            />
            <div
              className={`absolute left-0 top-0 h-full transition-all ${activityStatus.color.replace(
                "text-white",
                ""
              )}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {activityStatus.message}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {[15, 30, 45].map((d) => (
            <button
              key={d}
              onClick={() => setDurationMinutes(d)}
              className={`
                flex-1 rounded-[var(--radius)]
                px-2 py-2 text-xs font-medium border
                ${
                  durationMinutes === d
                    ? "bg-[#0095D3] text-white border-[#0095D3]"
                    : "border-gray-300 text-gray-600 hover:border-[#0095D3]"
                }
              `}
            >
              {d} min
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map(
            (type) => {
              const kcal = calculateActivityCalories(
                ACTIVITY_TYPES[type].met,
                user?.user_metadata?.weight_kg ?? 75,
                durationMinutes
              );

              return (
                <button
                  key={type}
                  onClick={() => addActivity(type)}
                  className="
                    rounded-[var(--radius)]
                    border border-[#0095D3]
                    px-2 py-2
                    text-xs font-medium
                    text-[#0095D3]
                    hover:bg-[#0095D3]
                    hover:text-white
                    transition
                  "
                >
                  + {ACTIVITY_TYPES[type].label}
                  <div className="text-[10px] opacity-70">
                    {durationMinutes} min · {kcal} kcal
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>
    </Card>
  );
}
