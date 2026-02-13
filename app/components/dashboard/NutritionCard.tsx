// app/components/dashboard/NutritionCard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useNow } from "@/lib/TimeProvider";
import { dispatchDashboardEvent } from "@/lib/dispatchDashboardEvent";

import {
  calculateNutritionScore,
  getNutritionStatus,
} from "@/lib/nutritionScore";

/* ✅ NIEUWE MODAL */
import ConsumptionModal from "@/components/dashboard/ConsumptionModal";

/* 🌍 Meertaligheid */
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

/* ───────────────── Types ───────────────── */

type NutritionLogRow = { calories: number };
type ActivityLogRow = { calories: number };
type NutritionProfile = {
  calorie_goal: number;
  goal: "lose_weight" | "maintain" | "gain_weight";
};

/* ───────────────── Component ───────────────── */

export default function NutritionCard() {
  const { user } = useUser();
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);
  const now = useNow();

  const lang = useLang();
  const t = uiText[lang];

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [goal, setGoal] = useState<NutritionProfile["goal"]>("maintain");
  const [activityBonus, setActivityBonus] = useState<number>(0);
  const [currentCalories, setCurrentCalories] = useState<number>(0);
  const [nutritionScore, setNutritionScore] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [showConsumptionModal, setShowConsumptionModal] = useState(false);

  useEffect(() => {
    setBaseGoal(null);
    setGoal("maintain");
    setActivityBonus(0);
    setCurrentCalories(0);
    setNutritionScore(0);
    setHasLoaded(false);
  }, [dayKey]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    const loadInitial = async () => {
      const [
        { data: profile },
        { data: activityLogs },
        { data: consumptionLogs },
      ] = await Promise.all([
        supabase.from("profiles").select("calorie_goal, goal").eq("id", userId).single<NutritionProfile>(),
        supabase.from("activity_logs").select("calories").eq("user_id", userId).eq("log_date", dayKey),
        supabase.from("consumption_logs").select("calories").eq("user_id", userId).eq("log_date", dayKey),
      ]);

      if (!profile?.calorie_goal) return;

      setBaseGoal(profile.calorie_goal);
      setGoal(profile.goal);

      const burned =
        (activityLogs as ActivityLogRow[] | null)?.reduce(
          (s, r) => s + r.calories,
          0
        ) ?? 0;
      setActivityBonus(burned);

      const eaten =
        (consumptionLogs as NutritionLogRow[] | null)?.reduce(
          (s, r) => s + r.calories,
          0
        ) ?? 0;
      setCurrentCalories(eaten);

      const limit = profile.calorie_goal + burned;
      setNutritionScore(calculateNutritionScore(eaten, limit, profile.goal));
      setHasLoaded(true);
    };

    loadInitial();
  }, [user, dayKey]);

  /* ✅ NIEUW: luisteren naar consumption-changed */
  useEffect(() => {
    if (!user) return;
  
    const userId = user.id; // ✅ fix TS null warning
  
    async function handleConsumptionChange() {
      const { data } = await supabase
        .from("consumption_logs")
        .select("calories")
        .eq("user_id", userId)
        .eq("log_date", dayKey);
  
      const eaten =
        (data as NutritionLogRow[] | null)?.reduce(
          (s, r) => s + r.calories,
          0
        ) ?? 0;
  
      setCurrentCalories(eaten);
    }
  
    window.addEventListener("consumption-changed", handleConsumptionChange);
  
    return () =>
      window.removeEventListener("consumption-changed", handleConsumptionChange);
  }, [user, dayKey]);  

  useEffect(() => {
    if (!user || !hasLoaded) return;
    const userId = user.id;

    async function handleActivityUpdate() {
      const { data } = await supabase
        .from("activity_logs")
        .select("calories")
        .eq("user_id", userId)
        .eq("log_date", dayKey);

      const burned =
        (data as ActivityLogRow[] | null)?.reduce(
          (s, r) => s + r.calories,
          0
        ) ?? 0;

      setActivityBonus(burned);
    }

    window.addEventListener("activity-updated", handleActivityUpdate);
    return () =>
      window.removeEventListener("activity-updated", handleActivityUpdate);
  }, [user, hasLoaded, dayKey]);

  const dailyLimit = baseGoal !== null ? baseGoal + activityBonus : 0;

  const statusKey = `${currentCalories}-${dailyLimit}-${goal}-${now.getHours()}-${lang}`;

  const nutritionStatus = useMemo(() => {
    if (!dailyLimit)
      return { color: "bg-gray-400 text-white", message: "", expectedProgress: 0 };
    return getNutritionStatus(currentCalories, dailyLimit, goal, now, t, lang);
  }, [statusKey]);

  const pillScore =
    nutritionStatus.color === "bg-green-600 text-white"
      ? nutritionScore
      : Math.min(nutritionScore, 99);

  useEffect(() => {
    if (!hasLoaded || !dailyLimit) return;
    dispatchDashboardEvent("nutrition-updated", {
      score: nutritionScore,
      color: nutritionStatus.color,
    });
  }, [hasLoaded, dailyLimit, nutritionScore, nutritionStatus.color]);

  if (!hasLoaded || baseGoal === null) {
    return (
      <Card title={t.nutrition.title}>
        <div className="text-sm text-gray-500">
          {t.nutrition.loading}
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(currentCalories / dailyLimit, 1);
  const progressBarColor = nutritionStatus.color.replace("text-white", "");
  const limitLabel = t.nutrition.goal;

  return (
    <>
      <Card
        title={t.nutrition.title}
        icon={<Image src="/nutrition.svg" alt="" width={16} height={16} />}
        action={
          <div
            className={`rounded-[var(--radius)] px-3 py-1 text-xs font-semibold whitespace-nowrap ${nutritionStatus.color}`}
          >
            FitLifeScore {pillScore} / 100
          </div>
        }
      >
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-[#191970]">
              {formatNumber(currentCalories, lang)} kcal
            </div>

            <div className="text-xs text-gray-500">
              {limitLabel}: {formatNumber(dailyLimit, lang)} kcal
            </div>

            <div className="text-[11px] text-gray-400">
              {t.nutrition.basePlusActivity
                .replace("{{base}}", formatNumber(baseGoal ?? 0, lang))
                .replace("{{activity}}", formatNumber(activityBonus, lang))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
                style={{ width: `${nutritionStatus.expectedProgress * 100}%` }}
              />
              <div
                className={`absolute left-0 top-0 h-full transition-all ${progressBarColor}`}
                style={{ width: `${actualProgress * 100}%` }}
              />
            </div>

            <div className="text-xs text-gray-600">
              {nutritionStatus.message}
            </div>
          </div>

          <button
            onClick={() => setShowConsumptionModal(true)}
            className="mt-4 rounded-[var(--radius)] border border-[#0095D3] px-3 py-3 text-sm font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
          >
            + {t.nutrition.addFood}
          </button>
        </div>
      </Card>

      {showConsumptionModal && (
        <ConsumptionModal
          onClose={() => setShowConsumptionModal(false)}
          onSaved={(calories: number) => {
            setCurrentCalories((prev) => prev + calories)
          }}
        />
      )}
    </>
  );
}
