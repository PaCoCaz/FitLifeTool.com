// app/components/dashboard/NutritionModal.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";

/* ───────────────── Types ───────────────── */

type FoodType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "drink_calories"
  | "dessert"
  | "fast_food"
  | "other";

type Props = {
  onClose: () => void;
  onAdd: (calories: number, type: FoodType) => void;
};

type NutritionRow = {
  meal_type: FoodType;
  calories: number;
};

/* ───────────────── Constants ───────────────── */

const FOOD_TYPES: { key: FoodType; label: string }[] = [
  { key: "breakfast", label: "Ontbijt" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Diner" },
  { key: "snack", label: "Snack" },
  { key: "drink_calories", label: "Calorische drank" },
  { key: "dessert", label: "Dessert" },
  { key: "fast_food", label: "Fastfood" },
  { key: "other", label: "Overig" },
];

const QUICK_CALORIES = [100, 200, 300, 400, 500, 600, 800, 1000];

/* ───────────────── Component ───────────────── */

export default function NutritionModal({ onClose, onAdd }: Props) {
  const { user } = useUser();
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const lang = useLang();
  const t = uiText[lang];

  const [selectedType, setSelectedType] = useState<FoodType | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [customCalories, setCustomCalories] = useState("");
  const [todayFoods, setTodayFoods] = useState<NutritionRow[]>([]);

  const finalCalories =
    customCalories.trim() !== "" ? Number(customCalories) : calories;

  /* ESC sluiten */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Vandaag laden + GROEPEREN */
  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    async function loadToday() {
      const { data } = await supabase
        .from("nutrition_logs")
        .select("meal_type, calories")
        .eq("user_id", userId)
        .eq("log_date", dayKey);

      const rows = (data as NutritionRow[]) ?? [];

      const grouped: Record<string, number> = {};

      for (const row of rows) {
        if (!grouped[row.meal_type]) grouped[row.meal_type] = 0;
        grouped[row.meal_type] += row.calories;
      }

      const merged = Object.entries(grouped).map(([meal_type, calories]) => ({
        meal_type: meal_type as FoodType,
        calories: Math.round(calories),
      }));

      merged.sort((a, b) => b.calories - a.calories);

      setTodayFoods(merged);
    }

    loadToday();
  }, [user, dayKey]);

  const totalCalories = todayFoods.reduce((sum, f) => sum + f.calories, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-3">
        <div className="w-full max-w-3xl rounded-[var(--radius)] bg-white p-6 shadow-xl my-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191970]">
              <Image src="/nutrition.svg" alt="" width={18} height={18} />
              {t.nutrition.addFood}
            </h2>

            <button
              onClick={onClose}
              className="rounded-[var(--radius)] border border-[#191970] bg-[#191970] px-3 py-1 text-xs font-medium text-white hover:bg-[#0095D3] hover:border-[#0095D3] transition"
            >
              {t.common.close}
            </button>
          </div>

          {/* Food Type */}
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">
              {t.nutrition.modalWhatDidYouEat}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {FOOD_TYPES.map((type) => {
                const isActive = selectedType === type.key;
                return (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key)}
                    className={`rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#0095D3] text-white border-[#0095D3]"
                        : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    }`}
                  >
                    {t.nutrition.mealLabels[type.key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calories */}
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">
              {t.nutrition.modalHowMuch}
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {QUICK_CALORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCalories(c);
                    setCustomCalories("");
                  }}
                  className={`w-full rounded-[var(--radius)] border py-2 text-xs font-medium transition ${
                    calories === c
                      ? "bg-[#0095D3] text-white border-[#0095D3]"
                      : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                  }`}
                >
                  {formatNumber(c, lang)} kcal
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                {t.nutrition.modalCustomAmount}
              </label>
              <input
                type="number"
                min={1}
                value={customCalories}
                onChange={(e) => {
                  setCustomCalories(e.target.value);
                  setCalories(null);
                }}
                className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-sm text-[#191970]"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!selectedType || !finalCalories || finalCalories <= 0) return;
              onAdd(finalCalories, selectedType);
            }}
            className="w-full rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-sm font-semibold text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
          >
            {t.nutrition.addFood}
          </button>

          {/* Vandaag gegeten */}
          {todayFoods.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <div className="text-sm font-semibold text-[#191970] mb-3">
                {t.nutrition.modalToday}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500 mb-2">
                <div>{t.nutrition.modalMeal}</div>
                <div className="text-right">{t.nutrition.modalCalories}</div>
              </div>

              <div className="space-y-2 text-sm text-[#191970]">
                {todayFoods.map((f, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <div>{t.nutrition.mealLabels[f.meal_type]}</div>
                    <div className="text-right">{formatNumber(f.calories, lang)} kcal</div>
                  </div>
                ))}

                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm font-semibold text-[#191970]">
                  <div>{t.nutrition.modalTotal}</div>
                  <div className="text-right">{formatNumber(totalCalories, lang)} kcal</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
