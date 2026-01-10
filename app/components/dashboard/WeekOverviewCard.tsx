"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import { useLabels } from "@/lib/useLabels";

export default function WeekOverviewCard() {
  const t = useLabels("nl").week;

  // Dummy data – later Supabase
  const averages = {
    weight: 82.1,   // kg
    calories: 2100, // kcal
    activity: 34,   // min
  };

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/week.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="h-full flex flex-col justify-between">

        {/* Subtitle */}
        <div className="text-xs text-gray-500">
          {t.subtitle}
        </div>

        {/* Overzicht */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-700">

          <div className="text-center">
            <div className="text-lg font-semibold text-[#191970]">
              {averages.weight} {t.unitKg}
            </div>
            <div className="text-gray-500">
              {t.avgWeight}
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-[#191970]">
              {averages.calories} {t.unitKcal}
            </div>
            <div className="text-gray-500">
              {t.avgCalories}
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-[#191970]">
              {averages.activity} {t.unitMin}
            </div>
            <div className="text-gray-500">
              {t.avgActivity}
            </div>
          </div>

        </div>

      </div>
    </Card>
  );
}
