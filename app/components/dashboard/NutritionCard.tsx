"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

type ActivityLog = {
  calories: number;
};

type NutritionProfile = {
  calorie_goal: number;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function NutritionCard() {
  const { user } = useUser();

  const [baseGoal, setBaseGoal] = useState<number | null>(null);
  const [activityBonus, setActivityBonus] =
    useState<number>(0);

  // Tijdelijke dummy calorie-inname
  const [currentCalories, setCurrentCalories] =
    useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  // 🔁 Centrale loader (herbruikbaar)
  async function loadData(userId: string) {
    setLoading(true);

    // 1️⃣ Basis calorie-doel
    const {
      data: profile,
      error: profileError,
    }: {
      data: NutritionProfile | null;
      error: { message: string } | null;
    } = await supabase
      .from("profiles")
      .select("calorie_goal")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error(
        profileError?.message ??
          "Geen calorie_goal gevonden"
      );
      setLoading(false);
      return;
    }

    setBaseGoal(profile.calorie_goal);

    // 2️⃣ Activiteiten van vandaag
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
      .eq("date", today());

    if (activityError) {
      console.error(activityError.message);
      setLoading(false);
      return;
    }

    const totalBurned =
      activities?.reduce(
        (sum, a) => sum + a.calories,
        0
      ) ?? 0;

    setActivityBonus(totalBurned);
    setLoading(false);
  }

  // 🔔 Init + luisteren naar activiteit-updates
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

  if (loading || baseGoal === null) {
    return (
      <Card title="Voeding">
        <div className="text-sm text-gray-500">
          Dagbudget laden…
        </div>
      </Card>
    );
  }

  const dailyBudget = baseGoal + activityBonus;

  const progress = Math.min(
    currentCalories / dailyBudget,
    1
  );

  const isEmpty = currentCalories === 0;
  const isComplete = currentCalories >= dailyBudget;

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
    >
      <div className="h-full flex flex-col justify-between">
        {/* Bovenkant */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentCalories.toLocaleString()} kcal
          </div>

          <div className="text-xs text-gray-500">
            Dagbudget: {dailyBudget} kcal
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
              className={`h-2 rounded-full transition-all ${
                isComplete
                  ? "bg-green-500"
                  : "bg-[#0095D3]"
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {isEmpty && "Nog geen voeding gelogd"}
            {!isEmpty && !isComplete &&
              "Goed bezig, blijf loggen"}
            {isComplete && "Dagbudget bereikt"}
          </div>
        </div>

        {/* Tijdelijke test-acties */}
        <div className="mt-4 flex gap-2">
          {[200, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => addCalories(amount)}
              className="flex-1 rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-xs font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
            >
              + {amount} kcal
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
