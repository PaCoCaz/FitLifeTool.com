"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import {
  calculateHydrationScore,
  calculateNutritionScore,
  getFitLifeScoreColor,
} from "../../lib/fitlifeScore";

import { calculateActivityScore } from "../../lib/activityScore";

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

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {
  const { user } = useUser();

  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const loadScore = async () => {
      setLoading(true);
      const date = today();

      /* ───── Hydration ───── */
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

      const hydrationTotal =
        hydrationLogs?.reduce(
          (sum: number, row: HydrationLog) =>
            sum + row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      const hydrationScore = calculateHydrationScore(
        hydrationTotal,
        profile?.water_goal_ml ?? 0
      );

      /* ───── Activity ───── */
      const { data: activityLogs } = await supabase
        .from("activity_logs")
        .select("calories")
        .eq("user_id", user.id)
        .eq("log_date", date)
        .returns<ActivityLog[]>();

      const burnedCalories =
        activityLogs?.reduce(
          (sum: number, row: ActivityLog) =>
            sum + row.calories,
          0
        ) ?? 0;

      const activityScore = calculateActivityScore(
        burnedCalories,
        300 // vast dagdoel (MVP)
      );

      /* ───── Nutrition (tijdelijk) ───── */
      const nutritionScore = calculateNutritionScore(
        0,
        1 // voorkomt NaN zolang food logging ontbreekt
      );

      /* ───── Dagscore ───── */
      const scores = [
        hydrationScore,
        activityScore,
        nutritionScore,
      ].filter((s) => s > 0);

      const dailyScore =
        scores.length > 0
          ? Math.round(
              scores.reduce(
                (sum: number, s: number) => sum + s,
                0
              ) / scores.length
            )
          : 0;

      setScore(dailyScore);
      setLoading(false);
    };

    loadScore();
  }, [user]);

  if (loading) {
    return (
      <Card title="FitLifeScore">
        <div className="text-sm text-gray-400">
          Score berekenen…
        </div>
      </Card>
    );
  }

  return (
    <Card title="FitLifeScore">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-semibold text-[#191970] min-w-[80px]">
          {score}
          <span className="text-sm text-gray-400">
            {" "}
            / 100
          </span>
        </div>

        <div className="flex-1">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-2 transition-all ${getFitLifeScoreColor(
                score
              )}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
