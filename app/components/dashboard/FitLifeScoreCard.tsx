// app/components/dashboard/FitLifeScoreCard.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import Card from "@/components/ui/Card";

import { useClockNow } from "@/lib/useClockNow";
import { getExpectedHydrationProgress } from "@/lib/hydrationScore";
import { calculateNutritionScore } from "@/lib/nutritionScore";

import {
  calculateDailyFitLifeScore,
  getFitLifeStatusColor,
  getFitLifeProgressColor,
  getFitLifeScoreColor,
} from "@/lib/fitlifeScore";

import { useDashboard } from "@/lib/DashboardStore";

/* ───────────────── Helpers ───────────────── */

function formatTime(now: Date): string {
  return now.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {

  const clockNow = useClockNow();

  const {
    hydrationMl,
    hydrationGoalMl,
    nutritionKcal,
    activityCalories,
  } = useDashboard();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ───────── Hydration Score ───────── */

  const hydrationScore = useMemo(() => {

    if (!hydrationGoalMl) return 0;

    const expectedProgress =
      getExpectedHydrationProgress(clockNow);

    const expectedMl =
      hydrationGoalMl * expectedProgress;

    if (expectedMl <= 0) return 0;

    const ratio =
      hydrationMl / expectedMl;

    return Math.min(
      100,
      Math.round(ratio * 100)
    );

  }, [
    hydrationMl,
    hydrationGoalMl,
    clockNow,
  ]);

  const hydrationColor =
    hydrationScore >= 100
      ? "bg-green-600 text-white"
      : hydrationScore >= 70
      ? "bg-orange-500 text-white"
      : "bg-[#C80000] text-white";

  /* ───────── Activity Score ───────── */

  const activityGoal = 400;

  const activityScore = useMemo(() => {

    const ratio =
      activityCalories / activityGoal;

    return Math.min(
      100,
      Math.round(ratio * 100)
    );

  }, [activityCalories]);

  const activityColor =
    activityScore >= 100
      ? "bg-green-600 text-white"
      : activityScore >= 70
      ? "bg-orange-500 text-white"
      : "bg-[#C80000] text-white";

  /* ───────── Nutrition Score ───────── */

  const calorieGoal = 2000;

  const nutritionScore = useMemo(() => {

    return calculateNutritionScore(
      nutritionKcal,
      calorieGoal,
      "maintain",
      clockNow
    );

  }, [
    nutritionKcal,
    clockNow,
  ]);

  const nutritionColor =
    nutritionScore >= 100
      ? "bg-green-600 text-white"
      : nutritionScore >= 70
      ? "bg-orange-500 text-white"
      : "bg-[#C80000] text-white";

  /* ───────── FitLifeScore (lib) ───────── */

  const fitLifeScore = useMemo(() => {

    return calculateDailyFitLifeScore({
      hydrationScore,
      nutritionScore,
      activityScore,
    });

  }, [
    hydrationScore,
    nutritionScore,
    activityScore,
  ]);

  /* ───────── Status kleur ───────── */

  const statusColor = useMemo(() => {

    return getFitLifeStatusColor([
      hydrationColor,
      activityColor,
      nutritionColor,
    ]);

  }, [
    hydrationColor,
    activityColor,
    nutritionColor,
  ]);

  /* ───────── Dagprogress ───────── */

  const expectedProgress =
    getExpectedHydrationProgress(clockNow);

  const actualProgressWithinSchedule =
    expectedProgress * (fitLifeScore / 100);

    const pillColor =
    getFitLifeScoreColor(fitLifeScore);

  const progressBarColor =
    getFitLifeProgressColor(fitLifeScore);

  /* ───────── UI ───────── */

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
            min-w-[130px]
            text-center
            ${pillColor}
          `}
        >
          Vandaag | {mounted ? formatTime(clockNow) : "—"}
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">

        <div className="text-3xl font-semibold text-[#191970]">
          {fitLifeScore}
        </div>

        <div className="mt-4">

          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">

            <div
              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"
              style={{
                width: `${expectedProgress * 100}%`,
              }}
            />

            <div
              className={`absolute left-0 top-0 h-2 ${progressBarColor}`}
              style={{
                width: `${actualProgressWithinSchedule * 100}%`,
              }}
            />

          </div>

        </div>

      </div>
    </Card>
  );
}