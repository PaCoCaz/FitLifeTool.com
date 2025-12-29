"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import {
  ACTIVITY_TYPES,
  ActivityType,
  calculateActivityCalories,
  calculateActivityScore,
} from "../../lib/activityScore";

import { getFitLifeScoreColor } from "../../lib/fitlifeScore";

type ActivityLogRow = {
  calories: number;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ActivityCard() {
  const { user } = useUser();

  const [burnedCalories, setBurnedCalories] = useState(0);
  const [activityScore, setActivityScore] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activityGoal = 300; // MVP vast doel

  /**
   * Load today's activities
   */
  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("activity_logs")
        .select("calories")
        .eq("user_id", user.id)
        .eq("log_date", today());

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      const total =
        (data as ActivityLogRow[] | null)?.reduce(
          (sum, row) => sum + row.calories,
          0
        ) ?? 0;

      setBurnedCalories(total);
      setActivityScore(
        calculateActivityScore(total, activityGoal)
      );

      setLoading(false);
    };

    loadActivities();
  }, [user]);

  /**
   * Add activity
   */
  async function addActivity(type: ActivityType) {
    if (!user) return;

    const weightKg =
      user.user_metadata?.weight_kg ?? 75;

    const calories = calculateActivityCalories(
      ACTIVITY_TYPES[type].met,
      weightKg,
      durationMinutes
    );

    const { error } = await supabase
      .from("activity_logs")
      .insert({
        user_id: user.id,
        activity_type: type,
        duration_minutes: durationMinutes,
        calories,
        log_date: today(),
      });

    if (error) {
      console.error(error.message);
      return;
    }

    // Optimistische update
    setBurnedCalories((prev) => {
      const total = prev + calories;
      setActivityScore(
        calculateActivityScore(total, activityGoal)
      );
      return total;
    });

    setLastAdded(
      `${ACTIVITY_TYPES[type].label} (${durationMinutes} min · ${calories} kcal)`
    );

    setTimeout(() => setLastAdded(null), 2000);

    // NutritionCard informeren
    window.dispatchEvent(
      new Event("activity-updated")
    );
  }

  if (loading) {
    return (
      <Card title="Activiteit">
        <div className="text-sm text-gray-500">
          Activiteit laden…
        </div>
      </Card>
    );
  }

  const progress = Math.min(
    burnedCalories / activityGoal,
    1
  );

  const scoreColorClass =
    getFitLifeScoreColor(activityScore);

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
            ${scoreColorClass}
          `}
        >
          FitLifeScore {activityScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {burnedCalories} kcal
          </div>

          <div className="text-xs text-gray-500">
            Dagdoel: {activityGoal} kcal
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${scoreColorClass}`}
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {burnedCalories === 0 &&
              "Nog geen activiteit gelogd"}
            {burnedCalories > 0 &&
              burnedCalories < activityGoal &&
              "Goed bezig, blijf bewegen"}
            {burnedCalories >= activityGoal &&
              "Activiteitsdoel behaald"}
          </div>

          {lastAdded && (
            <div className="text-xs text-green-600">
              ✓ {lastAdded} toegevoegd
            </div>
          )}
        </div>

        {/* Duur selector */}
        <div className="mt-4 flex gap-2">
          {[15, 30, 45].map((d) => (
            <button
              key={d}
              onClick={() =>
                setDurationMinutes(d)
              }
              className={`
                flex-1 rounded-[var(--radius)]
                px-2 py-1 text-xs font-medium
                border
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

        {/* Activiteiten */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map(
            (type) => {
              const kcal =
                calculateActivityCalories(
                  ACTIVITY_TYPES[type].met,
                  user?.user_metadata?.weight_kg ?? 75,
                  durationMinutes
                );

              return (
                <button
                  key={type}
                  onClick={() =>
                    addActivity(type)
                  }
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
