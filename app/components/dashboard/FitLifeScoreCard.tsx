"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { calculateHydrationScore } from "../../lib/hydrationScore";
import { calculateActivityScore } from "../../lib/activityScore";
import {
  calculateDailyFitLifeScore,
  getFitLifeScoreColor,
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

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ───────────────── Component ───────────────── */

export default function FitLifeScoreCard() {
  const { user } = useUser();

  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadScore() {
    if (!user) return;

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

    // TODO: activityGoal later uit profiles halen
    const activityScore = calculateActivityScore(
      burnedCalories,
      300
    );

    /* ───── Nutrition (tijdelijk neutraal) ───── */
    // Totdat food logging bestaat:
    const nutritionScore = 100;

    /* ───── Dagscore ───── */
    const dailyScore = calculateDailyFitLifeScore({
      hydrationScore,
      nutritionScore,
      activityScore,
    });

    setScore(dailyScore);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;

    loadScore();

    function handleUpdate() {
      loadScore();
    }

    window.addEventListener(
      "hydration-updated",
      handleUpdate
    );
    window.addEventListener(
      "activity-updated",
      handleUpdate
    );
    window.addEventListener(
      "nutrition-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "hydration-updated",
        handleUpdate
      );
      window.removeEventListener(
        "activity-updated",
        handleUpdate
      );
      window.removeEventListener(
        "nutrition-updated",
        handleUpdate
      );
    };
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
    <Card
      title="FitLifeScore"
      action={
        <div className="rounded-[var(--radius)] bg-[#191970] px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
          Vandaag
        </div>
      }
    >
      <div className="space-y-3">
        {/* Score */}
        <div className="flex items-end gap-2">
          <div className="text-3xl font-semibold text-[#191970]">
            {score}
          </div>
          <div className="text-sm text-gray-400">
            / 100
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-2 transition-all ${getFitLifeScoreColor(
              score
            )}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="text-[11px] text-gray-400">
          Gebaseerd op hydratatie, voeding en
          activiteit
        </div>
      </div>
    </Card>
  );
}
