"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

const QUICK_AMOUNTS = [250, 500];

type WaterGoalResult = {
  water_goal_ml: number;
};

export default function WaterCard() {
  const { user } = useUser();

  const [waterGoal, setWaterGoal] = useState<number | null>(null);
  const [current, setCurrent] = useState<number>(0);

  const isEmpty = current === 0;
  const isComplete =
    waterGoal !== null && current >= waterGoal;

  const progress =
    waterGoal !== null
      ? Math.min(current / waterGoal, 1)
      : 0;

  // Haal waterdoel op
  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("water_goal_ml")
      .eq("id", user.id)
      .single()
      .then(
        ({
          data,
          error,
        }: {
          data: WaterGoalResult | null;
          error: { message: string } | null;
        }) => {
          if (error) {
            console.error(error.message);
            return;
          }

          if (data?.water_goal_ml) {
            setWaterGoal(data.water_goal_ml);
          }
        }
      );
  }, [user]);

  function addWater(amount: number) {
    setCurrent((prev) => prev + amount);
  }

  if (!waterGoal) {
    return (
      <Card title="Water">
        <div className="text-sm text-gray-500">
          Waterdoel laden…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Water"
      icon={
        <Image
          src="/water_drop.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-[#191970]">
            {current.toLocaleString()} ml
          </div>

          <div className="text-xs text-gray-500">
            Dagdoel: {waterGoal.toLocaleString()} ml
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
            {isEmpty && "Nog geen water gedronken"}
            {!isEmpty && !isComplete &&
              "Goed bezig, blijf drinken"}
            {isComplete && "Dagdoel behaald"}
          </div>
        </div>

        {/* Acties */}
        <div className="mt-4 flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="flex-1 rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-xs font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
            >
              + {amount} ml
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
