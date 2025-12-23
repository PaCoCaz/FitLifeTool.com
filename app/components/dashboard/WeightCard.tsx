"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function WeightCard() {
  const t = useLabels("nl").weight;

  // Dummy data – later Supabase
  const yesterdayWeight = 82.7;
  const targetWeight = 78;

  const [dayKey, setDayKey] = useState(getTodayKey);
  const [weightByDay, setWeightByDay] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  /* Dagwissel detectie */
  useEffect(() => {
    const today = getTodayKey();
    if (today !== dayKey) {
      setDayKey(today);
      setEditing(false);
      setInput("");
    }
  }, [dayKey]);

  const currentWeight = weightByDay[dayKey];
  const diff =
    currentWeight !== undefined
      ? +(currentWeight - yesterdayWeight).toFixed(1)
      : null;

  function saveWeight() {
    const value = Number(input.replace(",", "."));
    if (Number.isNaN(value)) return;

    setWeightByDay((prev) => ({
      ...prev,
      [dayKey]: value,
    }));

    setEditing(false);
    setInput("");
  }

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

        {/* Bovenkant */}
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-[#191970]">
            {currentWeight !== undefined
              ? `${currentWeight} ${t.unit}`
              : `– ${t.unit}`}
          </div>

          <div className="text-xs text-gray-500">
            {t.goal}: {targetWeight} {t.unit}
          </div>
        </div>

        {/* Verandering */}
        <div className="mt-3 text-xs">
          {diff !== null && diff > 0 && (
            <div className="text-red-600">
              +{diff} {t.unit} · {t.changeUp}
            </div>
          )}
          {diff !== null && diff < 0 && (
            <div className="text-green-600">
              {diff} {t.unit} · {t.changeDown}
            </div>
          )}
          {diff === 0 && (
            <div className="text-gray-600">{t.noChange}</div>
          )}
        </div>

        {/* Invoer */}
        <div className="mt-4">
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
                step="0.1"
                placeholder={`0.0 ${t.unit}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm"
              />

              <div className="flex gap-2">
                <button
                  onClick={saveWeight}
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
        </div>

      </div>
    </Card>
  );
}
