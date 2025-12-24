"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";
import { FOODS } from "../../data/foods";
import type { FoodProduct, FoodEntry } from "../../types/food";

const DAILY_CALORIE_GOAL = 2200;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function calculateEntry(food: FoodProduct, amount: number): FoodEntry {
  const factor = amount / 100;

  return {
    name: food.name,
    calories: Math.round(food.calories * factor),
    protein: +(food.protein * factor).toFixed(1),
    carbs: +(food.carbs * factor).toFixed(1),
    fat: +(food.fat * factor).toFixed(1),
  };
}

export default function NutritionCard() {
  const t = useLabels("nl").nutrition;

  const [dayKey, setDayKey] = useState(getTodayKey);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [editing, setEditing] = useState(false);

  const [foodId, setFoodId] = useState("");
  const [portion, setPortion] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  /* Dagwissel detectie */
  useEffect(() => {
    const today = getTodayKey();
    if (today !== dayKey) {
      setDayKey(today);
      setEntries([]);
      setEditing(false);
      setFoodId("");
      setPortion(null);
      setQuantity(1);
    }
  }, [dayKey]);

  function saveEntry() {
    const food = FOODS.find((f) => f.id === foodId);
    if (!food || !portion || quantity <= 0) return;

    const totalAmount = portion * quantity;

    setEntries((prev) => [
      ...prev,
      calculateEntry(food, totalAmount),
    ]);

    setFoodId("");
    setPortion(null);
    setQuantity(1);
    setEditing(false);
  }

  function undoLast() {
    setEntries((prev) => prev.slice(0, -1));
  }

  function resetToday() {
    setEntries([]);
  }

  const totals = entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const progress = Math.min(totals.calories / DAILY_CALORIE_GOAL, 1);
  const isEmpty = totals.calories === 0;
  const isComplete = totals.calories >= DAILY_CALORIE_GOAL;

  const selectedFood = FOODS.find((f) => f.id === foodId);

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
        <div>
          <div className="text-2xl font-semibold text-[#191970]">
            {totals.calories} {t.calories}
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
            <div className="font-semibold">{totals.protein}g</div>
            <div className="text-gray-500">{t.protein}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{totals.carbs}g</div>
            <div className="text-gray-500">{t.carbs}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{totals.fat}g</div>
            <div className="text-gray-500">{t.fat}</div>
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

              {/* Product */}
              <select
                value={foodId}
                onChange={(e) => {
                  setFoodId(e.target.value);
                  setPortion(null);
                  setQuantity(1);
                }}
                className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm"
              >
                <option value="">Selecteer product</option>
                {FOODS.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </select>

              {/* Portie */}
              {selectedFood && (
                <select
                  value={portion ?? ""}
                  onChange={(e) => {
                    setPortion(Number(e.target.value));
                    setQuantity(1);
                  }}
                  className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm"
                >
                  <option value="">Selecteer portie</option>
                  {Object.entries(selectedFood.portions).map(
                    ([label, amount]) => (
                      <option key={label} value={amount}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              )}

              {/* Aantal */}
              {selectedFood && portion && (
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm"
                  placeholder="Aantal"
                />
              )}

              {/* Actieknoppen */}
              <div className="flex gap-2">
                <button
                  onClick={saveEntry}
                  className="flex-1 rounded-[var(--radius)] bg-[#0095D3] px-3 py-2 text-xs text-white hover:opacity-90"
                >
                  {t.save}
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setFoodId("");
                    setPortion(null);
                    setQuantity(1);
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
