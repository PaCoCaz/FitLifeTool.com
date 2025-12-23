"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

const DAILY_ACTIVITY_GOAL = 30; // minuten

export default function ActivityCard() {
  const [minutes, setMinutes] = useState(20); // dummy data
  const t = useLabels("nl").activity;

  const progressRaw = minutes / DAILY_ACTIVITY_GOAL;
  const progress = Math.min(progressRaw, 1);
  const isEmpty = minutes === 0;
  const isComplete = minutes >= DAILY_ACTIVITY_GOAL;

  function addActivity(amount: number) {
    setMinutes((prev) => prev + amount);
  }

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/activity.svg"
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
            {minutes} {t.duration}
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {DAILY_ACTIVITY_GOAL} {t.duration}
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

        {/* Acties */}
        <div className="mt-4 flex gap-2">
          {[10, 15].map((amount) => (
            <button
              key={amount}
              onClick={() => addActivity(amount)}
              className="flex-1 rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-xs font-medium text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
            >
              + {amount} {t.duration}
            </button>
          ))}
        </div>

      </div>
    </Card>
  );
}
