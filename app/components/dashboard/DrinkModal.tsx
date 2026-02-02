// /app/components/dashboard/DrinkModal.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

type Props = {
  onClose: () => void;
  onAdd: (amountMl: number, factor: number, label: string) => void;
};

type DrinkOption = {
  label: string;
  factor: number;
  icon: string;
};

const DRINK_OPTIONS: DrinkOption[] = [
  { label: "Water", factor: 1.0, icon: "water" },
  { label: "Thee", factor: 0.95, icon: "tea" },
  { label: "Koffie", factor: 0.8, icon: "coffee" },
  { label: "Melk", factor: 0.9, icon: "milk" },
  { label: "Frisdrank", factor: 0.9, icon: "soda" },
  { label: "Sap / Smoothie", factor: 0.85, icon: "juice" },
  { label: "Sportdrank", factor: 0.9, icon: "sports" },
  { label: "Energy drink", factor: 0.7, icon: "energy" },
  { label: "Bier", factor: 0.6, icon: "beer" },
  { label: "Wijn", factor: 0.5, icon: "wine" },
  { label: "Cocktail", factor: 0.4, icon: "cocktail" },
  { label: "Sterke drank", factor: 0.3, icon: "liquor" },
];

const QUICK_VOLUMES = [50, 100, 150, 200, 250, 300, 500, 1000];

type TodayDrink = {
  drink_type: string;
  total_input_ml: number;
  total_ml: number;
  factor: number;
};

type HydrationRow = {
  drink_type: string;
  amount_ml: number;
  hydration_factor: number;
};

function getHydrationColor(factor: number) {
  if (factor >= 0.9) return "text-green-600";
  if (factor >= 0.7) return "text-[#0095D3]";
  return "text-red-600";
}

export default function DrinkModal({ onClose, onAdd }: Props) {
  const { user } = useUser();
  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const [selectedDrink, setSelectedDrink] = useState<DrinkOption | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [todayDrinks, setTodayDrinks] = useState<TodayDrink[]>([]);

  const finalAmount =
    customAmount.trim() !== "" ? Number(customAmount) : amount;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function loadToday() {
      const response = await supabase
        .from("hydration_logs")
        .select("drink_type, amount_ml, hydration_factor")
        .eq("user_id", userId)
        .eq("log_date", dayKey);

      const rows: HydrationRow[] = response?.data ?? [];

      const grouped: Record<string, { input: number; hydrated: number; factor: number }> = {};

      for (const row of rows) {
        const input = row.amount_ml;
        const hydrated = row.amount_ml * row.hydration_factor;

        if (!grouped[row.drink_type]) {
          grouped[row.drink_type] = { input: 0, hydrated: 0, factor: row.hydration_factor };
        }

        grouped[row.drink_type].input += input;
        grouped[row.drink_type].hydrated += hydrated;
      }

      const sortedDrinks = Object.entries(grouped)
        .map(([type, values]) => ({
          drink_type: type,
          total_input_ml: Math.round(values.input),
          total_ml: Math.round(values.hydrated),
          factor: values.factor,
        }))
        .sort((a, b) => b.total_ml - a.total_ml); // 🔽 Hoog → laag hydratatie

      setTodayDrinks(sortedDrinks);

    }

    loadToday();
  }, [user, dayKey]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-3">
        <div className="w-full max-w-3xl rounded-[var(--radius)] bg-white p-6 shadow-xl my-4">

          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191970]">
              <Image src="/water_drop.svg" alt="" width={18} height={18} aria-hidden />
              Drinken toevoegen
            </h2>
            <button
              onClick={onClose}
              className="rounded-[var(--radius)] border border-[#191970] bg-[#191970] px-3 py-1 text-xs font-medium text-white hover:bg-[#0095D3] hover:border-[#0095D3] transition"
            >
              Sluiten
            </button>
          </div>

          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">Wat heb je gedronken?</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {DRINK_OPTIONS.map((drink) => {
                const isActive = selectedDrink?.label === drink.label;
                return (
                  <button
                    key={drink.label}
                    onClick={() => setSelectedDrink(drink)}
                    className={`group flex items-center gap-2 rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#0095D3] text-white border-[#0095D3]"
                        : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    }`}
                  >
                    <span className="relative w-[16px] h-[16px]">
                      <Image src={`/images/drinks/${drink.icon}.svg`} alt="" fill className={`${isActive ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`} />
                      <Image src={`/images/drinks/${drink.icon}_hover.svg`} alt="" fill className={`${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                    </span>
                    {drink.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 mb-2">Hoeveel heb je gedronken?</div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {QUICK_VOLUMES.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setAmount(v);
                    setCustomAmount("");
                  }}
                  className={`w-full rounded-[var(--radius)] border py-2 text-xs font-medium transition ${
                    amount === v
                      ? "bg-[#0095D3] text-white border-[#0095D3]"
                      : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                  }`}
                >
                  {v.toLocaleString("nl-NL")} ml
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Of voer zelf een hoeveelheid in (ml)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="Bijv. 275"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(null);
                }}
                className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-sm text-[#191970] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095D3]/30"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!selectedDrink || !finalAmount || finalAmount <= 0) return;
              onAdd(finalAmount, selectedDrink.factor, selectedDrink.label);
            }}
            className="w-full rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-sm font-semibold text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
          >
            Toevoegen
          </button>

          {todayDrinks.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <div className="text-sm font-semibold text-[#191970] mb-3">Vandaag gedronken</div>

              <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-500 mb-2">
                <div>Drank</div>
                <div className="text-right">Hoeveelheid</div>
                <div className="text-right">Factor</div>
                <div className="text-right">Hydratatie</div>
              </div>

              <div className="space-y-2 text-sm text-[#191970]">
                {todayDrinks.map((d) => (
                  <div key={d.drink_type} className="grid grid-cols-4 gap-2">
                    <div className="capitalize">{d.drink_type}</div>
                    <div className="text-right">{d.total_input_ml.toLocaleString("nl-NL")} ml</div>
                    <div className={`text-right ${getHydrationColor(d.factor)}`}>{d.factor.toFixed(2)}</div>
                    <div className={`text-right font-medium ${getHydrationColor(d.factor)}`}>{d.total_ml.toLocaleString("nl-NL")} ml</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 leading-relaxed">
                <span className="font-semibold">Hydratatiefactor:</span><br />
                Niet alle dranken hydrateren even sterk als water, de hydratatiefactor van water is 1.<br />
                Dranken met cafeïne, suiker of alcohol dragen minder bij aan je hydratatie.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
