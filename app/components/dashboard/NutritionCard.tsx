// app/components/dashboard/NutritionCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

import { useNow } from "@/lib/TimeProvider";

import {
  calculateNutritionScore,
  getNutritionStatus,
} from "@/lib/nutritionScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";
import { useRouter } from "next/navigation";

import { useDashboard } from "@/lib/DashboardStore";

/* ───────────────── Types ───────────────── */

type ProfileGoal = "LOSE" | "MAINTAIN" | "GAIN";

type NutritionProfile = {
  calorie_goal: number;
  goal: ProfileGoal;
};

/* ───────────────── Goal Mapping ───────────────── */

function mapGoalToScoreGoal(goal: ProfileGoal) {
  if (goal === "LOSE") return "lose_weight";
  if (goal === "GAIN") return "gain_weight";
  return "maintain";
}

/* ───────────────── Component ───────────────── */

export default function NutritionCard() {

  const { user } = useUser();

  const {
    ready,
    nutritionKcal,
    activityCalories
  } = useDashboard();

  const now = useNow();

  const lang = useLang();
  const t = uiText[lang];
  const router = useRouter();

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [goal, setGoal] =
    useState<"lose_weight" | "maintain" | "gain_weight">("maintain");

  const [nutritionScore, setNutritionScore] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  /* ───────────────── Load profile ───────────────── */

  useEffect(() => {
    const userId = user?.id;
    if (!user) return;

    async function loadProfile() {

      const { data } = await supabase
        .from("profiles")
        .select("calorie_goal, goal")
        .eq("id", userId)
        .single<NutritionProfile>();

      if (!data?.calorie_goal) return;

      setBaseGoal(data.calorie_goal);
      setGoal(mapGoalToScoreGoal(data.goal));

      setHasLoaded(true);

    }

    loadProfile();

  }, [user]);

  /* ───────────────── Derived values ───────────────── */

  const currentCalories = nutritionKcal ?? 0;
  const activityBonus = activityCalories ?? 0;

  const dailyLimit =
    baseGoal !== null ? baseGoal + activityBonus : 0;

  /* ───────────────── Score ───────────────── */

  useEffect(() => {

    if (!baseGoal) return;

    const limit = baseGoal + activityBonus;

    const score = calculateNutritionScore(
      currentCalories,
      limit,
      goal,
      now
    );

    setNutritionScore(score);

  }, [currentCalories, activityBonus, baseGoal, goal, now]);

  const statusKey =
    `${currentCalories}-${dailyLimit}-${goal}-${now.getHours()}-${lang}`;

  const nutritionStatus = useMemo(() => {

    if (!dailyLimit)
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };

    return getNutritionStatus(
      currentCalories,
      dailyLimit,
      goal,
      now,
      t,
      lang
    );

  }, [statusKey]);

  const pillScore =
    nutritionStatus.color === "bg-green-600 text-white"
      ? nutritionScore
      : Math.min(nutritionScore, 99);

  if (!ready || !hasLoaded || baseGoal === null) {
    return (
      <Card title={t.nutrition.title}>
        <div className="text-sm text-gray-500">
          {t.nutrition.loading}
        </div>
      </Card>
    );
  }

  const actualProgress =
    Math.min(currentCalories / dailyLimit, 1);

  const progressBarColor =
    nutritionStatus.color.replace("text-white", "");

  const limitLabel = t.nutrition.goal;

  return (
    <>
      <Card
        title={t.nutrition.title}
        icon={<Image src="/nutrition.svg" alt="" width={16} height={16} />}
        action={
          <div
            className={`rounded-[var(--radius)] px-3 py-1 text-xs font-semibold whitespace-nowrap ${nutritionStatus.color}`}
          >
            FitLifeScore {pillScore} / 100
          </div>
        }
      >
        <div className="h-full flex flex-col justify-between">

          <div className="space-y-1">

            <div className="text-2xl font-semibold text-[#191970]">
              {formatNumber(Math.round(currentCalories), lang)} kcal
            </div>

            <div className="text-xs text-gray-500">
              {limitLabel}: {formatNumber(Math.round(dailyLimit), lang)} kcal
            </div>

            <div className="text-[11px] text-gray-400">
              {t.nutrition.basePlusActivity
                .replace(
                  "{{base}}",
                  formatNumber(Math.round(baseGoal ?? 0), lang)
                )
                .replace(
                  "{{activity}}",
                  formatNumber(Math.round(activityBonus), lang)
                )}
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

          <button
            onClick={() => router.push("/dashboard/food/search")}
            className="mt-4 rounded-[var(--radius)] border border-[#0095D3] px-3 py-3 text-sm font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
          >
            + {t.nutrition.addFood}
          </button>

        </div>
      </Card>
    </>
  );
}