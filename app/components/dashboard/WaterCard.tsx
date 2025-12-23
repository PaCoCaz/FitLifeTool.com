"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

const DAILY_WATER_GOAL = 2000;
const QUICK_AMOUNTS = [250, 500];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function WaterCard() {
  const t = useLabels("nl").water;

  const [dayKey, setDayKey] = useState(getTodayKey);
  const [entries, setEntries] = useState<number[]>([]);

  /* Detecteer dagwissel (bij render / focus) */
  useEffect(() => {
    const today = getTodayKey();
    if (today !== dayKey) {
      setDayKey(today);
      setEntries([]);
    }
  }, [dayKey]);

  const total = entries.reduce((sum, v) => sum + v, 0);
  const progress = Math.min(total / DAILY_WATER_GOAL, 1);
  const isEmpty = total === 0;
  const isComplete = total >= DAILY_WATER_GOAL;

  function addWater(amount: number) {
    setEntries((prev) => [...prev, amount]);
  }

  function undoLast() {
    setEntries((prev) => prev.slice(0, -1));
  }

  function resetToday() {
    setEntries([]);
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
            {total.toLocaleString()} ml
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {DAILY_WATER_GOAL.toLocaleString()} ml
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
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
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

          <div className="flex gap-2">
            <button
              onClick={undoLast}
              disabled={entries.length === 0}
              className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-600 disabled:opacity-40"
            >
              Undo
            </button>

            <button
              onClick={resetToday}
              disabled={entries.length === 0}
              className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-600 disabled:opacity-40"
            >
              Reset vandaag
            </button>
          </div>
        </div>

      </div>
    </Card>
  );
}
