"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

const DAILY_ACTIVITY_GOAL = 30;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function ActivityCard() {
  const t = useLabels("nl").activity;

  const [dayKey, setDayKey] = useState(getTodayKey);
  const [entries, setEntries] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  /* Dagwissel detectie */
  useEffect(() => {
    const today = getTodayKey();
    if (today !== dayKey) {
      setDayKey(today);
      setEntries([]);
      setEditing(false);
      setInput("");
    }
  }, [dayKey]);

  const total = entries.reduce((sum, v) => sum + v, 0);
  const progress = Math.min(total / DAILY_ACTIVITY_GOAL, 1);
  const isEmpty = total === 0;
  const isComplete = total >= DAILY_ACTIVITY_GOAL;

  function saveActivity() {
    const value = Number(input);
    if (Number.isNaN(value) || value <= 0) return;

    setEntries((prev) => [...prev, value]);
    setEditing(false);
    setInput("");
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
            {total} {t.duration}
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
        <div className="mt-4 space-y-2">

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="w-full rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              {t.add}
            </button>
          )}

          {editing && (
            <div className="space-y-2">
              <input
                type="number"
                placeholder={`0 ${t.duration}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm"
              />

              <div className="flex gap-2">
                <button
                  onClick={saveActivity}
                  className="flex-1 rounded-[var(--radius)] bg-[#0095D3] px-3 py-2 text-xs text-white hover:opacity-90"
                >
                  {t.save}
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setInput("");
                  }}
                  className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-600"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Extra acties */}
          {entries.length > 0 && !editing && (
            <div className="flex gap-2">
              <button
                onClick={undoLast}
                className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-600"
              >
                Undo
              </button>

              <button
                onClick={resetToday}
                className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-xs text-gray-600"
              >
                Reset vandaag
              </button>
            </div>
          )}

        </div>

      </div>
    </Card>
  );
}
