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

type Props = {
  onClose: () => void;
  onAdd: (calories: number) => void;
};

type Product = {
  id: string;
  name: string;
  kcal_per_100g: number;
};

type Portion = {
  id: string;
  grams: number;
  label: string;
};

type TodayFood = {
  product_name: string;
  grams: number;
  calories: number;
};

export default function NutritionModal({ onClose, onAdd }: Props) {
  const { user } = useUser();
  const dayKey = getLocalDayKey(useDayNow());
  const lang = useLang();
  const t = uiText[lang];

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedGrams, setSelectedGrams] = useState<number | null>(null);
  const [customGrams, setCustomGrams] = useState("");
  const [todayFoods, setTodayFoods] = useState<TodayFood[]>([]);

  /* ESC sluiten */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* 🔎 Zoeken */
  useEffect(() => {
    if (search.length < 2 || selectedProduct) {
      setResults([]);
      return;
    }

    const load = async () => {
      const { data } = await supabase
        .from("food_products")
        .select(`id, kcal_per_100g, food_product_translations!inner(name, lang)`)
        .eq("food_product_translations.lang", lang)
        .ilike("food_product_translations.name", `%${search}%`)
        .limit(20);

      if (data) {
        setResults(
          data.map((p: any) => ({
            id: p.id,
            name: p.food_product_translations[0].name,
            kcal_per_100g: p.kcal_per_100g,
          }))
        );
      }
    };

    load();
  }, [search, lang, selectedProduct]);

  /* 🍽 Porties laden */
  useEffect(() => {
    if (!selectedProduct) return;

    const load = async () => {
      const { data } = await supabase
        .from("food_portions")
        .select(`id, grams, food_portion_translations!inner(name, lang)`)
        .eq("food_id", selectedProduct.id)
        .eq("food_portion_translations.lang", lang);

      if (data) {
        setPortions(
          data.map((p: any) => ({
            id: p.id,
            grams: p.grams,
            label: p.food_portion_translations[0].name,
          }))
        );
      }
    };

    load();
  }, [selectedProduct, lang]);

  /* 📋 Vandaag gegeten */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("nutrition_logs")
        .select(`
          grams,
          calories,
          food_id,
          food_products (
            food_product_translations ( name, lang )
          )
        `)
        .eq("user_id", user.id)
        .eq("log_date", dayKey);

      if (data) {
        setTodayFoods(
          data
            .filter((f: any) => f.food_id) // 🔥 voorkomt "Onbekend product"
            .map((f: any) => {
              const translations = f.food_products?.food_product_translations || [];
              const match = translations.find((t: any) => t.lang === lang);
              return {
                product_name: match?.name || "Onbekend product",
                grams: f.grams,
                calories: f.calories,
              };
            })
        );
      }
    };

    load();
  }, [user, dayKey, lang]);

  const totalCalories = todayFoods.reduce((s, f) => s + f.calories, 0);

  const activeGrams =
    customGrams.trim() !== ""
      ? Number(customGrams)
      : selectedGrams ?? null;

  const activeKcal =
    selectedProduct && activeGrams
      ? Math.round((activeGrams / 100) * selectedProduct.kcal_per_100g)
      : 0;

  async function confirmAdd() {
    if (!selectedProduct || !activeGrams || !user) return;

    const { error } = await supabase.from("nutrition_logs").insert({
      user_id: user.id,
      food_id: selectedProduct.id,
      grams: activeGrams,
      calories: activeKcal,
      log_date: dayKey,
      log_time_local: new Date().toTimeString().slice(0, 8),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (!error) {
      onAdd(activeKcal);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-3">
        <div className="w-full max-w-3xl rounded-[var(--radius)] bg-white p-6 shadow-xl my-4">

          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191970]">
              <Image src="/nutrition.svg" alt="" width={18} height={18} />
              {t.nutrition.addFood}
            </h2>
            <button onClick={onClose} className="rounded-[var(--radius)] border border-[#191970] bg-[#191970] px-3 py-1 text-xs text-white">
              {t.common.close}
            </button>
          </div>

          <input
            type="text"
            value={selectedProduct ? selectedProduct.name : search}
            onChange={(e) => {
              setSelectedProduct(null);
              setSelectedGrams(null);
              setCustomGrams("");
              setSearch(e.target.value);
            }}
            placeholder={t.nutrition.searchPlaceholder}
            className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 text-sm text-[#191970]"
          />

          {!selectedProduct && results.length > 0 && (
            <div className="mt-3 border rounded-[var(--radius)] overflow-hidden">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedProduct(r)}
                  className="w-full text-left px-3 py-2 border-b last:border-none hover:bg-[#E6F5FC]"
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}

          {selectedProduct && (
            <>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portions.map((p) => {
                  const kcal = Math.round((p.grams / 100) * selectedProduct.kcal_per_100g);
                  const active = selectedGrams === p.grams;

                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedGrams(p.grams);
                        setCustomGrams("");
                      }}
                      className={`rounded-[var(--radius)] border p-3 text-sm transition ${
                        active
                          ? "bg-[#0095D3] text-white border-[#0095D3]"
                          : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-xs opacity-70">
                        ({p.grams} g • {formatNumber(kcal, lang)} kcal)
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-500">Eigen hoeveelheid (gram)</label>
                <input
                  type="number"
                  value={customGrams}
                  onChange={(e) => {
                    setCustomGrams(e.target.value);
                    setSelectedGrams(null);
                  }}
                  className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-2 mt-1"
                />
                {customGrams && (
                  <div className="text-xs text-gray-500 mt-1">
                    {customGrams} g ({formatNumber(activeKcal, lang)} kcal)
                  </div>
                )}
              </div>

              {activeGrams && (
                <button
                  onClick={confirmAdd}
                  className="mt-6 w-full rounded-[var(--radius)] border border-[#0095D3] py-2 text-sm text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
                >
                  {t.nutrition.addFood}
                </button>
              )}
            </>
          )}

          {todayFoods.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <div className="text-sm font-semibold text-[#191970] mb-3">
                {t.nutrition.modalToday}
              </div>

              <div className="space-y-2 text-sm text-[#191970]">
                {todayFoods.map((f, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{f.product_name} ({f.grams} g)</span>
                    <span>{formatNumber(f.calories, lang)} kcal</span>
                  </div>
                ))}
                <div className="mt-3 pt-2 border-t font-semibold flex justify-between">
                  <span>{t.nutrition.modalTotal}</span>
                  <span>{formatNumber(totalCalories, lang)} kcal</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
