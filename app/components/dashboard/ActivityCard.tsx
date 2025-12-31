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

/**
 * Verwachte activiteit-voortgang (24u, zwaartepunt overdag)
 */
function getExpectedActivityProgress(now: Date = new Date()): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour < 7) return hour * 0.02;                // nacht
  if (hour < 23) return 0.14 + (hour - 7) / 16 * 0.76;
  return 1;
}

export default function ActivityCard() {
  const { user } = useUser();

  const [burnedCalories, setBurnedCalories] = useState(0);
  const [activityScore, setActivityScore] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activityGoal = 300;

  useEffect(() => {
    if (!user) return;

    const load = async () => {
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
          (s: number, r: ActivityLogRow) => s + r.calories,
          0
        ) ?? 0;

      setBurnedCalories(total);
      setActivityScore(calculateActivityScore(total, activityGoal));
      setLoading(false);
    };

    load();
  }, [user]);

  async function addActivity(type: ActivityType) {
    if (!user) return;

    const weightKg = user.user_metadata?.weight_kg ?? 75;

    const calories = calculateActivityCalories(
      ACTIVITY_TYPES[type].met,
      weightKg,
      durationMinutes
    );

    const { error } = await supabase.from("activity_logs").insert({
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

    setBurnedCalories((prev) => {
      const total = prev + calories;
      setActivityScore(calculateActivityScore(total, activityGoal));
      return total;
    });

    setLastAdded(
      `${ACTIVITY_TYPES[type].label} (${durationMinutes} min · ${calories} kcal)`
    );

    setTimeout(() => setLastAdded(null), 2000);
    window.dispatchEvent(new Event("activity-updated"));
  }

  if (loading) {
    return (
      <Card title="Activiteit">
        <div className="text-sm text-gray-500">Activiteit laden…</div>
      </Card>
    );
  }

  const expectedProgress = getExpectedActivityProgress();
  const actualProgress = Math.min(burnedCalories / activityGoal, 1);

  let status: string;

if (burnedCalories >= activityGoal) {
  status = "Goed bezig, je hebt je dagdoel gehaald";
} else {
  const delta =
    burnedCalories - activityGoal * expectedProgress;

  if (delta < -30) {
    status = `Je loopt ${Math.abs(Math.round(delta))} kcal achter op schema`;
  } else if (delta > 30) {
    status = `Je loopt ${Math.round(delta)} kcal voor op schema`;
  } else {
    status = "Je activiteit loopt op schema";
  }
}

  return (
    <Card
      title="Activiteit"
      icon={<Image src="/activity.svg" alt="" width={16} height={16} />}
      action={
        <div
          className={`
            rounded-[var(--radius)]
            px-3 py-1
            text-xs
            font-semibold
            text-white
            ${getFitLifeScoreColor(activityScore)}
          `}
        >
          FitLifeScore {activityScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="text-2xl font-semibold text-[#191970]">
            {burnedCalories} kcal
          </div>
          <div className="text-xs text-gray-500">
            Dagdoel: {activityGoal} kcal
          </div>
        </div>

        {/* ÉÉN progressbar */}
        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-[#B8CAE0] overflow-hidden">
            {/* schema */}
            <div
              className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
              style={{ width: `${expectedProgress * 100}%` }}
            />

            {/* actueel */}
            <div
              className={`absolute left-0 top-0 h-full transition-all ${getFitLifeScoreColor(
                activityScore
              )}`}
              style={{ width: `${actualProgress * 100}%` }}
            />
          </div>

          <div className="text-xs text-gray-600">{status}</div>

          {lastAdded && (
            <div className="text-xs text-green-600">
              ✓ {lastAdded}
            </div>
          )}
        </div>

        {/* Duur */}
        <div className="mt-4 flex gap-2">
          {[15, 30, 45].map((d) => (
            <button
              key={d}
              onClick={() => setDurationMinutes(d)}
              className={`
                flex-1 rounded-[var(--radius)]
                px-2 py-1 text-xs font-medium border
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
          {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map((type) => {
            const kcal = calculateActivityCalories(
              ACTIVITY_TYPES[type].met,
              user?.user_metadata?.weight_kg ?? 75,
              durationMinutes
            );

            return (
              <button
                key={type}
                onClick={() => addActivity(type)}
                className="rounded-[var(--radius)] border border-[#0095D3] px-2 py-2 text-xs font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
              >
                + {ACTIVITY_TYPES[type].label}
                <div className="text-[10px] opacity-70">
                  {durationMinutes} min · {kcal} kcal
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
