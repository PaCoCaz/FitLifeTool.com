"use client";

import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

const DAILY_CALORIE_GOAL = 2200;

export default function NutritionCard() {
  const t = useLabels("nl").nutrition;

  // Dummy data – later Supabase
  const calories: number = 1650;
  const macros = {
    protein: 110, // g
    carbs: 180,   // g
    fat: 55,      // g
  };

  const progressRaw = calories / DAILY_CALORIE_GOAL;
  const progress = Math.min(progressRaw, 1);
  const isEmpty = calories === 0;
  const isComplete = calories >= DAILY_CALORIE_GOAL;

  return (
    <Card
      title={t.title}
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
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-[#191970]">
            {calories} {t.calories}
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {DAILY_CALORIE_GOAL} {t.calories}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${
                isComplete ? "bg-green-500" : "bg-[#0095D3]"
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="text-xs text-gray-600">
            {isEmpty && t.empty}
            {!isEmpty && !isComplete && t.progress}
            {isComplete && t.completed}
          </div>
        </div>

        {/* Macro’s */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-700">
          <div className="text-center">
            <div className="font-semibold">{macros.protein}g</div>
            <div className="text-gray-500">{t.protein}</div>
          </div>

          <div className="text-center">
            <div className="font-semibold">{macros.carbs}g</div>
            <div className="text-gray-500">{t.carbs}</div>
          </div>

          <div className="text-center">
            <div className="font-semibold">{macros.fat}g</div>
            <div className="text-gray-500">{t.fat}</div>
          </div>
        </div>

      </div>
    </Card>
  );
}
