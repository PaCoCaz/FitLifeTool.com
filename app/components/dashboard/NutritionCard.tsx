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

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);
  const now = useNow();

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [goal, setGoal] =
    useState<NutritionProfile["goal"]>("maintain");
  const [activityBonus, setActivityBonus] = useState<number>(0);
  const [currentCalories, setCurrentCalories] = useState<number>(0);
  const [nutritionScore, setNutritionScore] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setBaseGoal(null);
    setGoal("maintain");
    setActivityBonus(0);
    setCurrentCalories(0);
    setNutritionScore(0);
    setHasLoaded(false);
  }, [dayKey]);

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

      const initialLimit = profile.calorie_goal + burned;

      const initialScore = calculateNutritionScore(
        eaten,
        initialLimit,
        profile.goal
      );

      setNutritionScore(initialScore);
      setHasLoaded(true);
    };

    loadInitial();
  }, [user, dayKey]);

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

    window.addEventListener("activity-updated", handleActivityUpdate);

    return () => {
      window.removeEventListener("activity-updated", handleActivityUpdate);
    };
  }, [user, hasLoaded, dayKey]);

  const dailyLimit =
    baseGoal !== null ? baseGoal + activityBonus : 0;

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

  /* ───── ✅ ENIGE WIJZIGING: pill-score blokkade ───── */
  const pillScore =
    nutritionStatus.color === "bg-green-600 text-white"
      ? nutritionScore
      : Math.min(nutritionScore, 99);

  useEffect(() => {
    if (!hasLoaded || !dailyLimit) return;

    dispatchDashboardEvent("nutrition-updated", {
      score: nutritionScore,
      color: nutritionStatus.color,
    });
  }, [hasLoaded, dailyLimit, nutritionScore, nutritionStatus.color]);

  async function addCalories(amount: number) {
    if (!user || !dailyLimit) return;

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

    if (error) return;

    const nextCalories = currentCalories + amount;

    const nextScore = calculateNutritionScore(
      nextCalories,
      dailyLimit,
      goal
    );

    const nextStatus = getNutritionStatus(
      nextCalories,
      dailyLimit,
      goal,
      now
    );

    setCurrentCalories(nextCalories);
    setNutritionScore(nextScore);

    dispatchDashboardEvent("nutrition-updated", {
      score: nextScore,
      color: nextStatus.color,
    });
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
    goal === "gain_weight" ? "Dagdoel" : "Daglimiet";

  const progressBarColor =
    nutritionStatus.color.replace("text-white", "");

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
          FitLifeScore {pillScore} / 100
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
              className={`absolute left-0 top-0 h-full transition-all ${progressBarColor}`}
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
