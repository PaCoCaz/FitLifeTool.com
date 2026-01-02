"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { useDayNow } from "../../lib/useDayNow";
import { getLocalDayKey } from "../../lib/dayKey";

import { dispatchDashboardEvent } from "../../lib/dispatchDashboardEvent";

import {
  calculateHydrationScore,
  getHydrationStatus,
} from "../../lib/hydrationScore";

/* ───────────────── Constants ───────────────── */

const DRINK_TYPES = {
  water: {
    label: "Water",
    factor: 1.0,
    icon: "/water_drop.svg",
  },
} as const;

const QUICK_AMOUNTS = [50, 150, 200, 250, 300, 500];

/* ───────────────── Types ───────────────── */

type HydrationLogRow = {
  amount_ml: number;
  hydration_factor: number;
};

/* ───────────────── Component ───────────────── */

export default function HydrationCard() {
  const { user } = useUser();

  // 🔒 Logische dag (reset exact om 00:00 lokaal)
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  /* ───── State ───── */
  const [hydrationGoal, setHydrationGoal] =
    useState<number | null>(null);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [hydrationScore, setHydrationScore] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  /* ───── Data laden (init + dagwissel) ───── */
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
            .eq("log_date", dayKey),
        ]);

      const goal = profile?.water_goal_ml ?? null;
      setHydrationGoal(goal);

      const total =
        (logs as HydrationLogRow[] | null)?.reduce(
          (sum, row) =>
            sum +
            row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      const rounded = Math.round(total);
      setCurrentMl(rounded);

      if (goal) {
        setHydrationScore(
          calculateHydrationScore(rounded, goal)
        );
      }

      setLoading(false);
    };

    loadHydration();
  }, [user, dayKey]);

  /* ───── Live status (tijd-gevoelig, géén fetch) ───── */
  const hydrationStatus = useMemo(() => {
    if (!hydrationGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getHydrationStatus(
      currentMl,
      hydrationGoal,
      dayNow
    );
  }, [currentMl, hydrationGoal, dayNow]);

  /* ───── Drink toevoegen ───── */
  async function addDrink(amount: number) {
    if (!user) return;

    const now = new Date(); // ✅ stap 9.5

    const { error } = await supabase
      .from("hydration_logs")
      .insert({
        user_id: user.id,
        drink_type: "water",
        amount_ml: amount,
        hydration_factor: 1,

        // 🔒 Daglogica
        log_date: dayKey,

        // ✅ stap 9.5 — expliciete logtijd
        log_time_local: now.toTimeString().slice(0, 8),
        timezone:
          Intl.DateTimeFormat().resolvedOptions()
            .timeZone,
      });

    if (error) {
      console.error(error.message);
      return;
    }

    // Optimistische update
    setCurrentMl((prev) => {
      const next = prev + amount;
      if (hydrationGoal) {
        setHydrationScore(
          calculateHydrationScore(next, hydrationGoal)
        );
      }
      return next;
    });

    // Typed dashboard event
    dispatchDashboardEvent("hydration-updated", undefined);
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

  const actualProgress = Math.min(
    currentMl / hydrationGoal,
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
            ${hydrationStatus.color}
          `}
        >
          FitLifeScore {hydrationScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentMl.toLocaleString()} ml
          </div>

          <div className="text-xs text-gray-500">
            Dagdoel:{" "}
            {hydrationGoal.toLocaleString()} ml
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-2 bg-[#B8CAE0]"
              style={{
                width: `${hydrationStatus.expectedProgress * 100}%`,
              }}
            />
            <div
              className={`absolute left-0 top-0 h-2 transition-all ${hydrationStatus.color.replace(
                "text-white",
                ""
              )}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {hydrationStatus.message}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
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
