"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import {
  calculateHydrationScore,
  getHydrationStatus,
} from "../../lib/hydrationScore";

/* ───────────────── Types ───────────────── */

type HydrationLogRow = {
  amount_ml: number;
  hydration_factor: number;
};

/* ───────────────── Utils ───────────────── */

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ───────────────── Constants ───────────────── */

const DRINK_TYPES = {
  water: {
    label: "Water",
    factor: 1.0,
    icon: "/water_drop.svg",
  },
} as const;

const QUICK_AMOUNTS = [50, 150, 200, 250, 300, 500];

/* ───────────────── Component ───────────────── */

export default function HydrationCard() {
  const { user } = useUser();

  const [hydrationGoal, setHydrationGoal] = useState<number | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("bg-gray-400 text-white");
  const [schemaProgress, setSchemaProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  /* ───────────────── Load data ───────────────── */

  useEffect(() => {
    if (!user) return;

    const loadHydration = async () => {
      setLoading(true);
      const date = today();

      const [{ data: profile }, { data: logs }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("water_goal_ml")
            .eq("id", user.id)
            .single(),

          supabase
            .from("hydration_logs")
            .select("amount_ml, hydration_factor")
            .eq("user_id", user.id)
            .eq("log_date", date),
        ]);

      const total =
        (logs as HydrationLogRow[] | null)?.reduce(
          (sum: number, row: HydrationLogRow) =>
            sum + row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      const rounded = Math.round(total);
      setCurrent(rounded);
      setHydrationGoal(profile?.water_goal_ml ?? null);

      if (profile?.water_goal_ml) {
        const scoreValue = calculateHydrationScore(
          rounded,
          profile.water_goal_ml
        );

        const status = getHydrationStatus(
          rounded,
          profile.water_goal_ml,
          new Date()
        );

        setScore(scoreValue);
        setStatusText(status.message);
        setStatusColor(status.color);
        setSchemaProgress(status.expectedProgress);
      }

      setLoading(false);
    };

    loadHydration();

    /* ⏱ Live update elke minuut */
    const interval = setInterval(loadHydration, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  /* ───────────────── Add drink ───────────────── */

  async function addDrink(amount: number) {
    if (!user || !hydrationGoal) return;

    const { error } = await supabase
      .from("hydration_logs")
      .insert({
        user_id: user.id,
        drink_type: "water",
        amount_ml: amount,
        hydration_factor: 1,
        log_date: today(),
      });

    if (error) {
      console.error(error.message);
      return;
    }

    const newTotal = current + amount;
    setCurrent(newTotal);

    const scoreValue = calculateHydrationScore(
      newTotal,
      hydrationGoal
    );

    const status = getHydrationStatus(
      newTotal,
      hydrationGoal,
      new Date()
    );

    setScore(scoreValue);
    setStatusText(status.message);
    setStatusColor(status.color);
    setSchemaProgress(status.expectedProgress);
  }

  /* ───────────────── Render ───────────────── */

  if (loading || hydrationGoal === null) {
    return (
      <Card title="Hydratatie">
        <div className="text-sm text-gray-400">
          Hydratatie laden…
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(current / hydrationGoal, 1);

  return (
    <Card
      title="Hydratatie"
      icon={
        <Image
          src={DRINK_TYPES.water.icon}
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
            ${statusColor}
          `}
        >
          FitLifeScore {score} / 100
        </div>
      }
    >
      <div className="space-y-4">
        {/* Bovenkant */}
        <div>
          <div className="text-2xl font-semibold text-[#191970]">
            {current.toLocaleString()} ml
          </div>
          <div className="text-xs text-gray-500">
            Dagdoel: {hydrationGoal.toLocaleString()} ml
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            {/* Schema (verwacht) */}
            <div
              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"
              style={{ width: `${schemaProgress * 100}%` }}
            />

            {/* Actueel */}
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${
                statusColor.replace("text-white", "")
              }`}
              style={{ width: `${actualProgress * 100}%` }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {statusText}
          </div>
        </div>

        {/* Acties */}
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addDrink(amount)}
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
              + {amount} ml
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
