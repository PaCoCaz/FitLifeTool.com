// app/lib/nutritionScore.ts

/**
 * ─────────────────────────────────────────────
 * Nutrition score & schema logic
 *
 * LET OP:
 * Dit is een globaal, cultuur-neutraal standaardschema.
 * Het is bewust avond-tolerant en heuristisch opgezet,
 * bedoeld voor feedback-timing — niet als voedingsadvies.
 *
 * Nutrition wijkt bewust af van Hydration & Activity:
 * - Afvallen / onderhouden → DAGLIMIET (bandbreedte)
 * - Aankomen → DAGDOEL (ondergrens)
 *
 * Activiteit kan het calorie-budget verhogen (activity bonus).
 * ─────────────────────────────────────────────
 */

import { formatNumber } from "./formatNumber";
import type { Lang } from "./useLang";

/* ───────────────── Types ───────────────── */

export type NutritionGoal =
  | "lose_weight"
  | "maintain"
  | "gain_weight";

/* ───────────────── Schema (tijd-gewogen) ───────────────── */

export function getExpectedNutritionProgress(
  now: Date = new Date()
): number {
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour < 7) return (hour / 7) * 0.05;
  if (hour < 12) return 0.05 + ((hour - 7) / 5) * 0.20;
  if (hour < 18) return 0.25 + ((hour - 12) / 6) * 0.30;
  if (hour < 24) return 0.55 + ((hour - 18) / 6) * 0.45;

  return 1;
}

/* ───────────────── NutritionScore (0–100) ───────────────── */

export function calculateNutritionScore(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal,
  now: Date = new Date()
): number {
  if (dailyLimit <= 0) return 0;

  const expectedProgress = getExpectedNutritionProgress(now);
  const expectedCalories = dailyLimit * expectedProgress;

  if (goal === "gain_weight") {
    if (expectedCalories <= 0) return 0;
    if (consumedCalories >= expectedCalories) return 100;
    return Math.round((consumedCalories / expectedCalories) * 100);
  }

  const lowerBound = expectedCalories * 0.85;
  const upperBound = expectedCalories * 1.15;

  if (consumedCalories < lowerBound) {
    if (expectedCalories === 0) return 0;
    return Math.round((consumedCalories / expectedCalories) * 100);
  }

  if (consumedCalories <= upperBound) return 100;

  const excess = consumedCalories - expectedCalories;
  return Math.max(0, Math.round((1 - excess / dailyLimit) * 100));
}

/* ───────────────── Status (tekst + schema-feedback) ───────────────── */

export function getNutritionStatus(
  consumedCalories: number,
  dailyLimit: number,
  goal: NutritionGoal,
  _now: Date = new Date(),
  t: any,
  lang: Lang
) {
  if (dailyLimit <= 0) {
    return {
      color: "bg-gray-400 text-white",
      message: t.nutrition.status.noGoal,
      expectedProgress: 0,
    };
  }

  const now = new Date(); // 🔥 realtime
  const expectedProgress = getExpectedNutritionProgress(now);
  const expectedCalories = dailyLimit * expectedProgress;
  const delta = Math.round(consumedCalories - expectedCalories);

  const formatted = (v: number) => formatNumber(v, lang);

  if (goal === "lose_weight" || goal === "maintain") {
    if (
      consumedCalories >= expectedCalories * 0.85 &&
      consumedCalories <= expectedCalories * 1.15
    ) {
      return {
        color: "bg-green-600 text-white",
        message: t.nutrition.status.onTrack,
        expectedProgress,
      };
    }

    if (delta < 0) {
      const shortage = Math.abs(delta);
      return {
        color: "bg-[#C80000] text-white",
        message: t.nutrition.status.behind.replace("{{value}}", formatted(shortage)),
        expectedProgress,
      };
    }

    return {
      color: "bg-[#C80000] text-white",
      message: t.nutrition.status.over.replace("{{value}}", formatted(delta)),
      expectedProgress,
    };
  }

  if (goal === "gain_weight") {
    if (delta >= 0) {
      return {
        color: "bg-green-600 text-white",
        message: t.nutrition.status.onTrack,
        expectedProgress,
      };
    }

    const shortage = Math.abs(delta);

    if (shortage <= dailyLimit * 0.15) {
      return {
        color: "bg-orange-500 text-white",
        message: t.nutrition.status.behind.replace("{{value}}", formatted(shortage)),
        expectedProgress,
      };
    }

    return {
      color: "bg-[#C80000] text-white",
      message: t.nutrition.status.behind.replace("{{value}}", formatted(shortage)),
      expectedProgress,
    };
  }

  return {
    color: "bg-gray-400 text-white",
    message: "",
    expectedProgress,
  };
}
