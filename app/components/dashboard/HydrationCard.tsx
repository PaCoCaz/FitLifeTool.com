"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import {
  calculateHydrationScore,
  getFitLifeScoreColor,
  getExpectedHydrationProgress,
} from "../../lib/fitlifeScore";

/**
 * MVP drinktypes
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

  const [hydrationGoal, setHydrationGoal] =
    useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [hydrationScore, setHydrationScore] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  /**
   * Data laden
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

      const goal = profile?.water_goal_ml ?? 0;
      setHydrationGoal(goal);

      const total =
        (logs as HydrationLogRow[] | null)?.reduce(
          (sum: number, row: HydrationLogRow) =>
            sum + row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      const rounded = Math.round(total);
      setCurrent(rounded);

      setHydrationScore(
        calculateHydrationScore(rounded, goal)
      );

      setLoading(false);
    };

    loadHydration();
  }, [user, today]);

  /**
   * Drink toevoegen
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
      console.error(error.message);
      return;
    }

    setCurrent((prev) => {
      const updated = Math.round(
        prev + amount * drink.factor
      );

      setHydrationScore(
        calculateHydrationScore(
          updated,
          hydrationGoal
        )
      );

      return updated;
    });
  }

  if (loading || hydrationGoal === 0) {
    return (
      <Card title="Hydratatie">
        <div className="text-sm text-gray-500">
          Hydratatie laden…
        </div>
      </Card>
    );
  }

  /**
   * Tijd-gecorrigeerd schema (06:00–22:00)
   */
  const expectedProgress =
    getExpectedHydrationProgress(); // 0–1

  const expectedMl = Math.round(
    hydrationGoal * expectedProgress
  );

  const actualProgress = Math.min(
    current / hydrationGoal,
    1
  );

  const ratio =
    expectedMl > 0 ? current / expectedMl : 0;

  let paceLabel = "Op schema";
  let paceColor = "text-green-600";

  if (ratio < 0.9) {
    paceLabel = "Achter op schema";
    paceColor = "text-[#C80000]";
  } else if (ratio > 1.1) {
    paceLabel = "Voor op schema";
    paceColor = "text-orange-500";
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
            px-3 py-1
            text-xs
            font-semibold
            whitespace-nowrap
            ${getFitLifeScoreColor(hydrationScore)}
          `}
        >
          FitLifeScore {hydrationScore} / 100
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

        {/* Progressbars */}
        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            {/* Schema (verwacht) */}
            <div
              className="absolute left-0 top-0 h-2"
              style={{
                width: `${expectedProgress * 100}%`,
                backgroundColor: "#B8CAE0",
              }}
            />

            {/* Werkelijk */}
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${getFitLifeScoreColor(
                hydrationScore
              )}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          {/* Schema-tekst ONDER de balk */}
          <div
            className={`text-xs font-medium ${paceColor}`}
          >
            {paceLabel} (verwacht {expectedMl} ml)
          </div>
        </div>

        {/* Acties */}
        <div className="mt-4 flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() =>
                addDrink("water", amount)
              }
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
