"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { useDayNow } from "../../lib/useDayNow";
import { getLocalDayKey } from "../../lib/dayKey";
import { useNow } from "../../lib/TimeProvider";
import { dispatchDashboardEvent } from "../../lib/dispatchDashboardEvent";

import {
  calculateNutritionScore,
  getNutritionStatus,
} from "../../lib/nutritionScore";

/* ───────────────── Types ───────────────── */

type NutritionLogRow = {
  calories: number;
};

type ActivityLogRow = {
  calories: number;
};

type NutritionProfile = {
  calorie_goal: number;
  goal: "lose_weight" | "maintain" | "gain_weight";
};

/* ───────────────── Component ───────────────── */

export default function NutritionCard() {
  const { user } = useUser();

  // 🔒 Logische dag (DB + reset)
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  // ⏱️ Live tijd (schema)
  const now = useNow();

  /* ───── State ───── */
  const [baseGoal, setBaseGoal] =
    useState<number | null>(null);
  const [goal, setGoal] =
    useState<NutritionProfile["goal"]>("maintain");
  const [activityBonus, setActivityBonus] =
    useState<number>(0);

  const [currentCalories, setCurrentCalories] =
    useState<number>(0);

  const [nutritionScore, setNutritionScore] =
    useState<number>(0);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  /* ───── INIT load (profile + activity + nutrition) ───── */
  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    const loadInitial = async () => {
      const [
        { data: profile },
        { data: activityLogs },
        { data: nutritionLogs },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("calorie_goal, goal")
          .eq("id", userId)
          .single<NutritionProfile>(),

        supabase
          .from("activity_logs")
          .select("calories")
          .eq("user_id", userId)
          .eq("log_date", dayKey),

        supabase
          .from("nutrition_logs")
          .select("calories")
          .eq("user_id", userId)
          .eq("log_date", dayKey),
      ]);

      if (!profile?.calorie_goal) return;

      setBaseGoal(profile.calorie_goal);
      setGoal(profile.goal);

      const burned =
        (activityLogs as ActivityLogRow[] | null)?.reduce(
          (sum, row) => sum + row.calories,
          0
        ) ?? 0;

      setActivityBonus(burned);

      const eaten =
        (nutritionLogs as NutritionLogRow[] | null)?.reduce(
          (sum, row) => sum + row.calories,
          0
        ) ?? 0;

      setCurrentCalories(eaten);
      setHasLoaded(true);
    };

    loadInitial();
  }, [user, dayKey]);

  /* ───── LIVE activity updates → bonus herberekenen ───── */
  useEffect(() => {
    if (!user || !hasLoaded) return;

    const userId = user.id;

    async function handleActivityUpdate() {
      const { data: activityLogs } = await supabase
        .from("activity_logs")
        .select("calories")
        .eq("user_id", userId)
        .eq("log_date", dayKey);

      const burned =
        (activityLogs as ActivityLogRow[] | null)?.reduce(
          (sum, row) => sum + row.calories,
          0
        ) ?? 0;

      setActivityBonus(burned);
    }

    window.addEventListener(
      "activity-updated",
      handleActivityUpdate
    );

    return () => {
      window.removeEventListener(
        "activity-updated",
        handleActivityUpdate
      );
    };
  }, [user, hasLoaded, dayKey]);

  /* ───── Daglimiet ───── */
  const dailyLimit =
    baseGoal !== null
      ? baseGoal + activityBonus
      : 0;

  /* ───── Status (LIVE schema) ───── */
  const nutritionStatus = useMemo(() => {
    if (!dailyLimit) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getNutritionStatus(
      currentCalories,
      dailyLimit,
      goal,
      now
    );
  }, [currentCalories, dailyLimit, goal, now]);

  /* ───── Score + dashboard event ───── */
  useEffect(() => {
    if (!dailyLimit) return;

    const score = calculateNutritionScore(
      currentCalories,
      dailyLimit,
      goal
    );

    setNutritionScore(score);

    dispatchDashboardEvent("nutrition-updated", {
      score,
      color: nutritionStatus.color,
    });
  }, [
    currentCalories,
    dailyLimit,
    goal,
    nutritionStatus.color,
  ]);

  /* ───── Calorie toevoegen (DB-first) ───── */
  async function addCalories(amount: number) {
    if (!user) return;

    const nowTs = new Date();

    const { error } = await supabase
      .from("nutrition_logs")
      .insert({
        user_id: user.id,
        calories: amount,
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

    setCurrentCalories((prev) => prev + amount);
  }

  if (!hasLoaded || baseGoal === null) {
    return (
      <Card title="Voeding">
        <div className="text-sm text-gray-500">
          Voeding laden…
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(
    currentCalories / dailyLimit,
    1
  );

  const limitLabel =
    goal === "gain_weight"
      ? "Dagdoel"
      : "Daglimiet";

  return (
    <Card
      title="Voeding"
      icon={
        <Image
          src="/nutrition.svg"
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
            ${nutritionStatus.color}
          `}
        >
          FitLifeScore {nutritionScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentCalories.toLocaleString()} kcal
          </div>

          <div className="text-xs text-gray-500">
            {limitLabel}: {dailyLimit} kcal
          </div>

          <div className="text-[11px] text-gray-400">
            Basis {baseGoal} + activiteit {activityBonus}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
              style={{
                width: `${nutritionStatus.expectedProgress * 100}%`,
              }}
            />
            <div
              className={`absolute left-0 top-0 h-full transition-all ${nutritionStatus.color.replace(
                "text-white",
                ""
              )}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {nutritionStatus.message}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {[200, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => addCalories(amount)}
              className="
                flex-1 rounded-[var(--radius)]
                border border-[#0095D3]
                px-3 py-2
                text-xs font-medium
                text-[#0095D3]
                hover:bg-[#0095D3]
                hover:text-white
                transition
              "
            >
              + {amount} kcal
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
