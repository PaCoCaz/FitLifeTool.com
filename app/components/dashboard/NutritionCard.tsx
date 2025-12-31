"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

import {
  calculateNutritionScore,
  getNutritionStatus,
} from "../../lib/nutritionScore";

/* ───────────────── Types ───────────────── */

type ActivityLog = {
  calories: number;
};

type NutritionProfile = {
  calorie_goal: number;
  goal: "lose_weight" | "maintain" | "gain_weight";
};

/* ───────────────── Utils ───────────────── */

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ───────────────── Component ───────────────── */

export default function NutritionCard() {
  const { user } = useUser();

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [goal, setGoal] =
    useState<NutritionProfile["goal"]>("maintain");
  const [activityBonus, setActivityBonus] =
    useState<number>(0);

  // Tijdelijk totdat food logging bestaat
  const [currentCalories, setCurrentCalories] =
    useState<number>(0);

  const [nutritionScore, setNutritionScore] =
    useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  /** 🔁 Tijd – alleen voor schema (identiek aan andere cards) */
  const [now, setNow] = useState<Date>(new Date());

  /* ⏱ Minute tick */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  /* 📥 Data laden (profiel + activiteit) */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const userId = user.id;

      const [{ data: profile }, { data: activities }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("calorie_goal, goal")
            .eq("id", userId)
            .single(),

          supabase
            .from("activity_logs")
            .select("calories")
            .eq("user_id", userId)
            .eq("log_date", today()),
        ]);

      if (!profile?.calorie_goal) {
        setLoading(false);
        return;
      }

      setBaseGoal(profile.calorie_goal);
      setGoal(profile.goal);

      const burned =
        (activities as ActivityLog[] | null)?.reduce(
          (sum, a) => sum + a.calories,
          0
        ) ?? 0;

      setActivityBonus(burned);
      setLoading(false);
    };

    loadData();

    function handleActivityUpdate() {
      loadData();
    }

    window.addEventListener(
      "activity-updated",
      handleActivityUpdate
    );

    return () => {
      window.removeEventListener(
        "activity-updated",
        handleActivityUpdate
      );
    };
  }, [user]);

  /** 🧠 Daglimiet + status (memoized) */
  const dailyLimit =
    baseGoal !== null ? baseGoal + activityBonus : 0;

  const nutritionStatus = useMemo(() => {
    if (!dailyLimit) {
      return {
        color: "bg-gray-400 text-white",
        message: "",
        expectedProgress: 0,
      };
    }

    return getNutritionStatus(
      currentCalories,
      dailyLimit,
      goal,
      now
    );
  }, [currentCalories, dailyLimit, now]);

  /** 📊 Score */
  useEffect(() => {
    if (!dailyLimit) return;

    setNutritionScore(
      calculateNutritionScore(
        currentCalories,
        dailyLimit,
        goal
      )
    );    
  }, [currentCalories, dailyLimit]);

  if (loading || baseGoal === null) {
    return (
      <Card title="Voeding">
        <div className="text-sm text-gray-500">
          Voeding laden…
        </div>
      </Card>
    );
  }

  const actualProgress = Math.min(
    currentCalories / dailyLimit,
    1
  );

  const limitLabel =
    goal === "gain_weight"
      ? "Dagdoel"
      : "Daglimiet";

  /* Tijdelijke testactie */
  function addCalories(amount: number) {
    setCurrentCalories((prev) => prev + amount);
  }

  return (
    <Card
      title="Voeding"
      icon={
        <Image
          src="/nutrition.svg"
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
            ${nutritionStatus.color}
          `}
        >
          FitLifeScore {nutritionScore} / 100
        </div>
      }
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentCalories.toLocaleString()} kcal
          </div>

          <div className="text-xs text-gray-500">
            {limitLabel}: {dailyLimit} kcal
          </div>

          <div className="text-[11px] text-gray-400">
            Basis {baseGoal} + activiteit{" "}
            {activityBonus}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            {/* Schema */}
            <div
              className="absolute left-0 top-0 h-full bg-[#B8CAE0]"
              style={{
                width: `${nutritionStatus.expectedProgress * 100}%`,
              }}
            />

            {/* Actueel */}
            <div
              className={`absolute left-0 top-0 h-full transition-all ${nutritionStatus.color.replace(
                "text-white",
                ""
              )}`}
              style={{
                width: `${actualProgress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {nutritionStatus.message}
          </div>
        </div>

        <div className="mt-2 text-[11px] text-gray-400">
          FitLifeScore gebaseerd op calorie-inname
        </div>

        {/* Tijdelijke test-acties */}
        <div className="mt-4 flex gap-2">
          {[200, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => addCalories(amount)}
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
              + {amount} kcal
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
