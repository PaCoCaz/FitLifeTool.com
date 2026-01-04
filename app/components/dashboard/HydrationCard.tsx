"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import { useDayNow } from "../../lib/useDayNow";
import { getLocalDayKey } from "../../lib/dayKey";
import { useNow } from "../../lib/TimeProvider";

import { dispatchDashboardEvent } from "../../lib/dispatchDashboardEvent";

import {
  getHydrationStatus,
  getExpectedHydrationProgress,
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

  // 🔒 Logische dag
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  // ⏱️ Live tijd
  const now = useNow();

  /* ───── State ───── */
  const [hydrationGoal, setHydrationGoal] =
    useState<number | null>(null);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [hydrationScore, setHydrationScore] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  /* ───── ✅ DAGRESET (LOKAAL, GEEN EVENTS) ───── */
  useEffect(() => {
    setCurrentMl(0);
    setHydrationScore(0);
    setHydrationGoal(null);
    setLoading(true);
  }, [dayKey]);

  /* ───── Data laden (init + dagwissel) ───── */
  useEffect(() => {
    if (!user) return;

    const loadHydration = async () => {
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

      setCurrentMl(Math.round(total));
      setLoading(false);
    };

    loadHydration();
  }, [user, dayKey]);

  /* ───── Status (LIVE schema) ───── */
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
      now
    );
  }, [currentMl, hydrationGoal, now]);

  /* ───── Moment-score (GEEN EVENT) ───── */
  useEffect(() => {
    if (!hydrationGoal) return;

    const expectedProgress =
      getExpectedHydrationProgress(now);

    const expectedMl =
      hydrationGoal * expectedProgress;

    if (expectedMl <= 0) return;

    const ratio = currentMl / expectedMl;
    const score = Math.min(
      100,
      Math.round(ratio * 100)
    );

    setHydrationScore(score);
  }, [currentMl, hydrationGoal, now]);

  /* ───── Drink toevoegen (USER ACTIE) ───── */
  async function addDrink(amount: number) {
    if (!user || !hydrationGoal) return;

    const nowTs = new Date();

    const { error } = await supabase
      .from("hydration_logs")
      .insert({
        user_id: user.id,
        drink_type: "water",
        amount_ml: amount,
        hydration_factor: 1,
        log_date: dayKey,
        log_time_local: nowTs
          .toTimeString()
          .slice(0, 8),
        timezone:
          Intl.DateTimeFormat().resolvedOptions()
            .timeZone,
      });

    if (error) return;

    setCurrentMl((prev) => {
      const next = prev + amount;

      const expectedProgress =
        getExpectedHydrationProgress(now);

      const expectedMl =
        hydrationGoal * expectedProgress;

      const nextScore =
        expectedMl > 0
          ? Math.min(
              100,
              Math.round((next / expectedMl) * 100)
            )
          : 0;

      setHydrationScore(nextScore);

      const nextStatus = getHydrationStatus(
        next,
        hydrationGoal,
        now
      );

      // ✅ EVENT ALLEEN HIER
      dispatchDashboardEvent("hydration-updated", {
        score: nextScore,
        color: nextStatus.color,
      });

      return next;
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
            Dagdoel: {hydrationGoal.toLocaleString()} ml
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
