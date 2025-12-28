"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import { calculateHydrationScore, getFitLifeScoreColor, } from "../../lib/fitlifeScore";

/**
 * MVP drinktypes
 * Later uitbreidbaar (thee, koffie, frisdrank, alcohol)
 */
const DRINK_TYPES = {
  water: {
    label: "Water",
    factor: 1.0,
    icon: "/water_drop.svg",
  },
} as const;

const QUICK_AMOUNTS = [250, 500];

type HydrationLogRow = {
  amount_ml: number;
  hydration_factor: number;
};

export default function HydrationCard() {
  const { user } = useUser();

  const [hydrationGoal, setHydrationGoal] = useState<number | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [hydrationScore, setHydrationScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const isEmpty = current === 0;
  const isComplete =
    hydrationGoal !== null && current >= hydrationGoal;

  const progress =
    hydrationGoal !== null
      ? Math.min(current / hydrationGoal, 1)
      : 0;

  /**
   * Load hydration goal + today logs
   */
  useEffect(() => {
    if (!user) return;

    const loadHydration = async () => {
      setLoading(true);

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
            .eq("log_date", today),
        ]);

      if (profile?.water_goal_ml) {
        setHydrationGoal(profile.water_goal_ml);
      }

      const total =
        (logs as HydrationLogRow[] | null)?.reduce(
          (sum, row) =>
            sum + row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      const roundedTotal = Math.round(total);
      setCurrent(roundedTotal);

      const score = calculateHydrationScore(
        roundedTotal,
        profile?.water_goal_ml ?? 0
      );
      setHydrationScore(score);

      setLoading(false);
    };

    loadHydration();
  }, [user, today]);

  /**
   * Add drink (MVP: water)
   */
  async function addDrink(
    drinkType: keyof typeof DRINK_TYPES,
    amount: number
  ) {
    if (!user) return;

    const drink = DRINK_TYPES[drinkType];

    const { error } = await supabase
      .from("hydration_logs")
      .insert({
        user_id: user.id,
        drink_type: drinkType,
        amount_ml: amount,
        hydration_factor: drink.factor,
        log_date: today,
      });

    if (error) {
      console.error("Hydration insert failed:", error.message);
      return;
    }

    // Optimistische UI update + score
    setCurrent((prev) => {
      const newTotal = Math.round(prev + amount * drink.factor);

      const score = calculateHydrationScore(
        newTotal,
        hydrationGoal ?? 0
      );
      setHydrationScore(score);

      return newTotal;
    });
  }

  if (loading || hydrationGoal === null) {
    return (
      <Card title="Hydratatie">
        <div className="text-sm text-gray-500">
          Hydratatie laden…
        </div>
      </Card>
    );
  }

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
            border
            px-2 py-1
            text-xs
            font-medium
            whitespace-nowrap
            ${getFitLifeScoreColor(hydrationScore)}
          `}
        >
          FitLifeScore: {hydrationScore} / 100
        </div>
      }               
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-[#191970]">
            {current.toLocaleString()} ml
          </div>

          <div className="text-xs text-gray-500">
            Dagdoel: {hydrationGoal.toLocaleString()} ml
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${
                isComplete
                  ? "bg-green-500"
                  : "bg-[#0095D3]"
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {isEmpty && "Nog geen hydratatie gelogd"}
            {!isEmpty && !isComplete &&
              "Goed bezig, blijf drinken"}
            {isComplete && "Hydratatiedoel behaald"}
          </div>
        </div>

        {/* Acties */}
        <div className="mt-4 flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addDrink("water", amount)}
              className="
                flex-1
                rounded-[var(--radius)]
                border border-[#0095D3]
                px-3 py-2
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
