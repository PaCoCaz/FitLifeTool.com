// app/components/dashboard/HydrationCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useNow } from "@/lib/TimeProvider";

import { dispatchDashboardEvent } from "@/lib/dispatchDashboardEvent";
import DrinkModal from "@/components/dashboard/DrinkModal";

import {
  getHydrationStatus,
  getExpectedHydrationProgress,
} from "@/lib/hydrationScore";

/* 🌍 Meertaligheid */
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber"; // ✅ toegevoegd

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

  const lang = useLang();
  const t = uiText[lang];

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);
  const now = useNow();

  const [hydrationGoal, setHydrationGoal] = useState<number | null>(null);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [hydrationScore, setHydrationScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [showDrinkModal, setShowDrinkModal] = useState(false);

  useEffect(() => {
    setCurrentMl(0);
    setHydrationScore(0);
    setHydrationGoal(null);
    setLoading(true);
  }, [dayKey]);

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
          (sum, row) => sum + row.amount_ml * row.hydration_factor,
          0
        ) ?? 0;

      setCurrentMl(Math.round(total));
      setLoading(false);
    };

    loadHydration();
  }, [user, dayKey]);

  const hydrationStatus = useMemo(() => {
    if (!hydrationGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getHydrationStatus(currentMl, hydrationGoal, now, t);
  }, [currentMl, hydrationGoal, now, t]);

  useEffect(() => {
    if (!hydrationGoal) return;

    const expectedProgress = getExpectedHydrationProgress(now);
    const expectedMl = hydrationGoal * expectedProgress;

    if (expectedMl <= 0) return;

    const ratio = Math.round(currentMl) / expectedMl;
    const score = Math.min(100, Math.round(ratio * 100));

    setHydrationScore(score);
  }, [currentMl, hydrationGoal, now]);

  const pillScore =
    hydrationStatus.color === "bg-green-600 text-white"
      ? hydrationScore
      : Math.min(hydrationScore, 99);

  useEffect(() => {
    if (loading) return;
    if (!hydrationGoal) return;

    dispatchDashboardEvent("hydration-updated", {
      score: hydrationScore,
      color: hydrationStatus.color,
    });
  }, [loading, hydrationGoal, hydrationScore, hydrationStatus.color]);

  useEffect(() => {
    function handleWeightUpdate(e: any) {
      const newWeight = e.detail?.weightKg;
      if (!newWeight) return;

      const recalculatedGoal = Math.round(newWeight * 35);
      setHydrationGoal(recalculatedGoal);
    }

    window.addEventListener("weight-updated", handleWeightUpdate);
    return () =>
      window.removeEventListener("weight-updated", handleWeightUpdate);
  }, []);

  async function addDrink(amount: number, factor: number, drinkLabel: string) {
    if (!user || !hydrationGoal) return;

    const nowTs = new Date();

    const { error } = await supabase.from("hydration_logs").insert({
      user_id: user.id,
      drink_type: drinkLabel.toLowerCase(),
      amount_ml: amount,
      hydration_factor: factor,
      log_date: dayKey,
      log_time_local: nowTs.toTimeString().slice(0, 8),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (error) return;

    setCurrentMl((prev) => prev + amount * factor);
  }

  if (loading || hydrationGoal === null) {
    return (
      <Card title={t.hydration.title}>
        <div className="text-sm text-gray-500">
          {t.hydration.loading}
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(Math.round(currentMl) / hydrationGoal, 1);

  return (
    <>
      <Card
        title={t.hydration.title}
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
            FitLifeScore {pillScore} / 100
          </div>
        }
      >
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-[#191970]">
              {formatNumber(Math.round(currentMl), lang)} ml
            </div>
            <div className="text-xs text-gray-500">
              {t.hydration.goal}: {formatNumber(hydrationGoal, lang)} ml
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

          <button
            onClick={() => setShowDrinkModal(true)}
            className="
              mt-4
              rounded-[var(--radius)]
              border border-[#0095D3]
              px-3 py-3
              text-sm font-medium
              text-[#0095D3]
              hover:bg-[#0095D3]
              hover:text-white
              transition
            "
          >
            + {t.hydration.addDrink}
          </button>
        </div>
      </Card>

      {showDrinkModal && (
        <DrinkModal
          onClose={() => setShowDrinkModal(false)}
          onAdd={(amount: number, factor: number, label: string) => {
            addDrink(amount, factor, label);
            setShowDrinkModal(false);
          }}
        />
      )}
    </>
  );
}
