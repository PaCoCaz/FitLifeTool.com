"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import {
  calculateHydrationScore,
  getHydrationStatus,
} from "../../lib/fitlifeScore";

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

  const [goalMl, setGoalMl] =
    useState<number | null>(null);
  const [currentMl, setCurrentMl] =
    useState<number>(0);
  const [score, setScore] =
    useState<number>(0);
  const [loading, setLoading] =
    useState<boolean>(true);

  const today = new Date()
    .toISOString()
    .slice(0, 10);

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
            .select(
              "amount_ml, hydration_factor"
            )
            .eq("user_id", user.id)
            .eq("log_date", today),
        ]);

      if (!profile?.water_goal_ml) {
        setLoading(false);
        return;
      }

      const total =
        (logs as HydrationLogRow[] | null)?.reduce(
          (sum: number, row: HydrationLogRow) =>
            sum +
            row.amount_ml *
              row.hydration_factor,
          0
        ) ?? 0;

      const rounded = Math.round(total);

      setGoalMl(profile.water_goal_ml);
      setCurrentMl(rounded);
      setScore(
        calculateHydrationScore(
          rounded,
          profile.water_goal_ml
        )
      );

      setLoading(false);
    };

    loadHydration();
  }, [user, today]);

  async function addDrink(amount: number) {
    if (!user || !goalMl) return;

    const { error } = await supabase
      .from("hydration_logs")
      .insert({
        user_id: user.id,
        drink_type: "water",
        amount_ml: amount,
        hydration_factor: 1,
        log_date: today,
      });

    if (error) {
      console.error(error.message);
      return;
    }

    setCurrentMl((prev) => {
      const next = prev + amount;
      setScore(
        calculateHydrationScore(next, goalMl)
      );
      return next;
    });
  }

  if (loading || goalMl === null) {
    return (
      <Card title="Hydratatie">
        <div className="text-sm text-gray-500">
          Hydratatie laden…
        </div>
      </Card>
    );
  }

  const status = getHydrationStatus(
    currentMl,
    goalMl
  );

  const actualProgress = Math.min(
    currentMl / goalMl,
    1
  );

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
            ${status.color}
          `}
        >
          FitLifeScore {score} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Boven */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentMl.toLocaleString()} ml
          </div>
          <div className="text-xs text-gray-500">
            Dagdoel: {goalMl.toLocaleString()} ml
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200 relative overflow-hidden">
            {/* Schema */}
            <div
              className="absolute h-2 bg-[#B8CAE0]"
              style={{
                width: `${
                  status.progress * 100
                }%`,
              }}
            />
            {/* Actueel */}
            <div
              className={`absolute h-2 ${status.color}`}
              style={{
                width: `${
                  actualProgress * 100
                }%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {status.message}
          </div>
        </div>

        {/* Acties */}
        <div className="mt-4 flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addDrink(amount)}
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
