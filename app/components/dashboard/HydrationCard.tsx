// app/components/dashboard/HydrationCard.tsx

"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { useDashboard } from "@/lib/DashboardStore";

import { useNow } from "@/lib/TimeProvider";

import {
  getHydrationStatus,
  getExpectedHydrationProgress,
} from "@/lib/hydrationScore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

/* ───────────────── Component ───────────────── */

export default function HydrationCard() {

  const {
    hydrationMl,
    hydrationDrinkMl,
    hydrationFoodMl,
    hydrationGoalMl,
    ready
  } = useDashboard();

  const lang = useLang();
  const t = uiText[lang];

  const now = useNow();

  const hydrationGoal = hydrationGoalMl ?? 0;
  const currentMl = hydrationMl ?? 0;

  /* ───────────────── Hydration Status ───────────────── */

  const hydrationStatus = useMemo(() => {
    if (!hydrationGoal) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getHydrationStatus(currentMl, hydrationGoal, now, t, lang);
  }, [currentMl, hydrationGoal, now, t]);

  /* ───────────────── Score ───────────────── */

  const hydrationScore = useMemo(() => {
    if (!hydrationGoal) return 0;

    const expectedProgress = getExpectedHydrationProgress(now);
    const expectedMl = hydrationGoal * expectedProgress;

    if (expectedMl <= 0) return 0;

    const ratio = currentMl / expectedMl;

    return Math.min(100, Math.round(ratio * 100));
  }, [currentMl, hydrationGoal, now]);

  const pillScore =
    hydrationStatus.color === "bg-green-600 text-white"
      ? hydrationScore
      : Math.min(hydrationScore, 99);

  /* ───────────────── Render ───────────────── */

  if (!ready || !hydrationGoal) {
    return (
      <Card title={t.hydration.title}>
        <div className="text-sm text-gray-500">
          {t.hydration.loading}
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(currentMl / hydrationGoal, 1);

  return (
    <Card
      title={t.hydration.title}
      icon={<Image src="/water_drop.svg" alt="" width={16} height={16} />}
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
            {formatNumber(currentMl, lang)} ml
          </div>

          <div className="text-xs text-gray-500">
            {t.hydration.goal}: {formatNumber(hydrationGoal, lang)} ml
          </div>

          {/* NIEUW: drink vs food */}

          <div className="text-xs text-gray-400 space-y-1 pt-1">

            <div>
              🥤 {t.hydration.drinks}: {formatNumber(hydrationDrinkMl, lang)} ml
            </div>

            <div>
              🥗 {t.hydration.food}: {formatNumber(hydrationFoodMl, lang)} ml
            </div>

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

      </div>
    </Card>
  );
}