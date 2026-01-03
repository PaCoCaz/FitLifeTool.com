"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import { useDayNow } from "../../lib/useDayNow";
import { useClockNow } from "../../lib/useClockNow";
import { getFitLifeStatusColor } from "../../lib/fitlifeScore";
import { DashboardEventMap } from "../../lib/dashboardEvents";

/* ───────────────── Utils ───────────────── */

function formatTime(now: Date): string {
  return now.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {
  const dayNow = useDayNow();
  const clockNow = useClockNow();

  const [hydrationScore, setHydrationScore] = useState<number | null>(null);
  const [activityScore, setActivityScore] = useState<number | null>(null);
  const [nutritionScore, setNutritionScore] = useState<number | null>(null);

  const [hydrationColor, setHydrationColor] = useState<string | null>(null);
  const [activityColor, setActivityColor] = useState<string | null>(null);
  const [nutritionColor, setNutritionColor] = useState<string | null>(null);

  /* Dagreset */
  useEffect(() => {
    setHydrationScore(null);
    setActivityScore(null);
    setNutritionScore(null);

    setHydrationColor(null);
    setActivityColor(null);
    setNutritionColor(null);
  }, [dayNow]);

  /* Events */
  useEffect(() => {
    const hydrationHandler = (
      e: CustomEvent<DashboardEventMap["hydration-updated"]>
    ) => {
      setHydrationScore(e.detail.score);
      setHydrationColor(e.detail.color);
    };

    const activityHandler = (
      e: CustomEvent<DashboardEventMap["activity-updated"]>
    ) => {
      setActivityScore(e.detail.score);
      setActivityColor(e.detail.color);
    };

    const nutritionHandler = (
      e: CustomEvent<DashboardEventMap["nutrition-updated"]>
    ) => {
      setNutritionScore(e.detail.score);
      setNutritionColor(e.detail.color);
    };

    window.addEventListener("hydration-updated", hydrationHandler as EventListener);
    window.addEventListener("activity-updated", activityHandler as EventListener);
    window.addEventListener("nutrition-updated", nutritionHandler as EventListener);

    return () => {
      window.removeEventListener("hydration-updated", hydrationHandler as EventListener);
      window.removeEventListener("activity-updated", activityHandler as EventListener);
      window.removeEventListener("nutrition-updated", nutritionHandler as EventListener);
    };
  }, []);

  /* 🔢 Score = laagste card (100 alleen als alles 100 is) */
  const fitLifeScore = useMemo(() => {
    const scores = [hydrationScore, activityScore, nutritionScore].filter(
      (s): s is number => typeof s === "number"
    );

    if (scores.length === 0) return 0;

    return Math.min(...scores);
  }, [hydrationScore, activityScore, nutritionScore]);

  /* 🎨 Kleur = aggregatie van card-status */
  const statusColor = useMemo(() => {
    return getFitLifeStatusColor([
      hydrationColor,
      activityColor,
      nutritionColor,
    ]);
  }, [hydrationColor, activityColor, nutritionColor]);

  const actualProgress = fitLifeScore / 100;

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
          {fitLifeScore}
        </div>

        <div className="mt-4">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${statusColor?.replace(
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
