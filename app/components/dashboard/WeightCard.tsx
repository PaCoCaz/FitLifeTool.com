"use client";

import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

export default function WeightCard() {
  const t = useLabels("nl").weight;

  // Dummy data – later Supabase
  const currentWeight = 82.4;     // kg
  const yesterdayWeight = 82.7;  // kg
  const targetWeight = 78;        // kg

  const diff = +(currentWeight - yesterdayWeight).toFixed(1);
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/weight.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="h-full flex flex-col justify-between">

        {/* Huidig gewicht */}
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentWeight} {t.unit}
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {targetWeight} {t.unit}
          </div>
        </div>

        {/* Verandering */}
        <div className="mt-4 space-y-1">
          {isUp && (
            <div className="text-xs text-red-600">
              +{diff} {t.unit} · {t.changeUp}
            </div>
          )}

          {isDown && (
            <div className="text-xs text-green-600">
              {diff} {t.unit} · {t.changeDown}
            </div>
          )}

          {!isUp && !isDown && (
            <div className="text-xs text-gray-600">
              {t.noChange}
            </div>
          )}
        </div>

      </div>
    </Card>
  );
}
