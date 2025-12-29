"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import {
  calculateNutritionScore,
  getNutritionScoreColor,
  NutritionGoal,
} from "../../lib/fitlifeScore";

/**
 * Types
 */
type ActivityLog = {
  calories: number;
};

type NutritionProfile = {
  calorie_goal: number;
  goal: NutritionGoal;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function NutritionCard() {
  const { user } = useUser();

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [goal, setGoal] = useState<NutritionGoal>("maintain");
  const [activityBonus, setActivityBonus] = useState<number>(0);

  // Tijdelijk totdat food logging bestaat
  const [currentCalories, setCurrentCalories] =
    useState<number>(0);

  const [nutritionScore, setNutritionScore] =
    useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Data laden
   */
  async function loadData(userId: string) {
    setLoading(true);

    // Profiel
    const {
      data: profile,
      error: profileError,
    }: {
      data: NutritionProfile | null;
      error: { message: string } | null;
    } = await supabase
      .from("profiles")
      .select("calorie_goal, goal")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error(
        profileError?.message ??
          "Geen nutrition profiel gevonden"
      );
      setLoading(false);
      return;
    }

    setBaseGoal(profile.calorie_goal);
    setGoal(profile.goal);

    // Activiteit vandaag
    const {
      data: activities,
      error: activityError,
    }: {
      data: ActivityLog[] | null;
      error: { message: string } | null;
    } = await supabase
      .from("activity_logs")
      .select("calories")
      .eq("user_id", userId)
      .eq("log_date", today());

    if (activityError) {
      console.error(activityError.message);
      setLoading(false);
      return;
    }

    const burned =
      activities?.reduce(
        (sum: number, a: ActivityLog) =>
          sum + a.calories,
        0
      ) ?? 0;

    setActivityBonus(burned);
    setLoading(false);
  }

  /**
   * Init + updates
   */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;
    loadData(userId);

    function handleActivityUpdate() {
      loadData(userId);
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

  /**
   * Score berekenen
   */
  const dailyLimit =
    baseGoal !== null ? baseGoal + activityBonus : 0;

  useEffect(() => {
    if (!dailyLimit) return;

    const score = calculateNutritionScore(
      currentCalories,
      dailyLimit
    );

    setNutritionScore(score);
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

  const progress = Math.min(
    currentCalories / dailyLimit,
    1
  );

  const isEmpty = currentCalories === 0;
  const isOver = currentCalories > dailyLimit;

  const limitLabel =
    goal === "gain_weight"
      ? "Dagdoel"
      : "Daglimiet";

  /**
   * Tijdelijke testactie
   */
  function addCalories(amount: number) {
    setCurrentCalories((prev) => prev + amount);
  }

  const scoreColorClass = getNutritionScoreColor(
    currentCalories,
    dailyLimit,
    goal
  );

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
            ${scoreColorClass}
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
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${scoreColorClass}`}
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {isEmpty && "Nog geen voeding gelogd"}
            {!isEmpty && !isOver &&
              "Binnen je daglimiet"}
            {isOver && "Boven je daglimiet"}
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
