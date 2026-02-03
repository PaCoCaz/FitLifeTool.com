// /app/components/dashboard/ActivityModal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import {
  ACTIVITY_TYPES,
  ActivityType,
  calculateActivityCalories,
} from "@/lib/activityScore";

type Props = {
  onClose: () => void;
  onAdd: (type: ActivityType, minutes: number) => void;
};

type ActivityRow = {
  activity_type: ActivityType;
  duration_minutes: number;
  calories: number;
};

const QUICK_DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];

export default function ActivityModal({ onClose, onAdd }: Props) {
  const { user } = useUser();
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const weightKg = user?.user_metadata?.weight_kg ?? 75;

  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [todayActivities, setTodayActivities] = useState<ActivityRow[]>([]);

  /* ESC sluiten */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Vandaag logs laden */
  useEffect(() => {
    if (!user) return;

    supabase
      .from("activity_logs")
      .select("activity_type, duration_minutes, calories")
      .eq("user_id", user.id)
      .eq("log_date", dayKey)
      .then(
        ({
          data,
        }: {
          data: ActivityRow[] | null;
        }) => {
          setTodayActivities(data ?? []);
        }
      );
  }, [user, dayKey]);

  const totalCalories = useMemo(
    () => todayActivities.reduce((sum, a) => sum + a.calories, 0),
    [todayActivities]
  );

  const totalMinutes = useMemo(
    () => todayActivities.reduce((sum, a) => sum + a.duration_minutes, 0),
    [todayActivities]
  );

  const effectiveMinutes =
    minutes ?? (customMinutes ? Number(customMinutes) : 0);

  const previewCalories =
    selectedType && effectiveMinutes > 0
      ? calculateActivityCalories(
          ACTIVITY_TYPES[selectedType].met,
          weightKg,
          effectiveMinutes
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-[var(--radius)] bg-white p-6 shadow-xl my-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191970]">
              <Image src="/activity.svg" alt="" width={18} height={18} />
              Activiteit toevoegen
            </h2>

            <button
              onClick={onClose}
              className="rounded-[var(--radius)] border border-[#191970] bg-[#191970] px-3 py-1 text-xs font-medium text-white hover:bg-[#0095D3] hover:border-[#0095D3] transition"
            >
              Sluiten
            </button>
          </div>

          {/* Activiteitstype */}
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Welke activiteit?
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#0095D3] text-white border-[#0095D3]"
                        : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    }`}
                  >
                    {ACTIVITY_TYPES[type].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duur */}
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Hoe lang?
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
              {QUICK_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setMinutes(d);
                    setCustomMinutes("");
                  }}
                  className={`rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition ${
                    minutes === d
                      ? "bg-[#0095D3] text-white border-[#0095D3]"
                      : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Of vul zelf minuten in"
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                setMinutes(null);
              }}
              className="w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Preview */}
          {previewCalories > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              Verbranding:{" "}
              <span className="font-semibold text-[#191970]">
                {previewCalories.toLocaleString("nl-NL")} kcal
              </span>
            </div>
          )}

          {/* Toevoegen knop */}
          <button
            disabled={!selectedType || effectiveMinutes <= 0}
            onClick={() =>
              selectedType && onAdd(selectedType, effectiveMinutes)
            }
            className="w-full rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-sm font-semibold text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition disabled:opacity-40"
          >
            Activiteit toevoegen
          </button>

          {/* Overzicht vandaag */}
          {todayActivities.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="text-sm font-semibold text-[#191970] mb-3">
                Vandaag bewogen
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 mb-2">
                <div>Activiteit</div>
                <div className="text-right">Duur</div>
                <div className="text-right">kcal</div>
              </div>

              <div className="space-y-2 text-sm text-[#191970]">
                {todayActivities.map((a, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <div>{ACTIVITY_TYPES[a.activity_type].label}</div>
                    <div className="text-right">{a.duration_minutes} min</div>
                    <div className="text-right font-medium">
                      {a.calories.toLocaleString("nl-NL")} kcal
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-3 text-sm font-semibold text-[#191970] grid grid-cols-3 gap-2">
                <div>Totaal</div>
                <div className="text-right">{totalMinutes} min</div>
                <div className="text-right">
                  {totalCalories.toLocaleString("nl-NL")} kcal
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
