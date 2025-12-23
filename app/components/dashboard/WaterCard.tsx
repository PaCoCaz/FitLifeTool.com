"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

const DAILY_WATER_GOAL = 2000; // ml
const QUICK_AMOUNTS = [250, 500];

export default function WaterCard() {
  const [current, setCurrent] = useState(1200);
  const t = useLabels("nl").water; // later: user.language

  const progressRaw = current / DAILY_WATER_GOAL;
  const progress = Math.min(progressRaw, 1);
  const isEmpty = current === 0;
  const isComplete = current >= DAILY_WATER_GOAL;

  function addWater(amount: number) {
    setCurrent((prev) => prev + amount);
  }

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/water_drop.svg"
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
            {current.toLocaleString()} ml
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {DAILY_WATER_GOAL.toLocaleString()} ml
          </div>
        </div>

        {/* Midden: progress */}
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

        {/* Onderkant: acties */}
        <div className="mt-4 flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="flex-1 rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-xs font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
            >
              {t.add(amount)}
            </button>
          ))}
        </div>

      </div>
    </Card>
  );
}
