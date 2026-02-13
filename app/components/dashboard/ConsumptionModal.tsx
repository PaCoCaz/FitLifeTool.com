// app/components/dashboard/ConsumptionModal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { formatNumber } from "@/lib/formatNumber";
import { dispatchDashboardEvent } from "@/lib/dispatchDashboardEvent";

type Props = {
  onClose: () => void;
  onSaved?: (calories: number) => void;
};

type Product = {
  id: string;
  name: string;
  kcal_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
};

type Portion = {
  id: string;
  grams: number | null;
  ml: number | null;
  unit_key: string;
  unit_label: string;
};

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export default function ConsumptionModal({ onClose, onSaved }: Props) {
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang];
  const dayKey = getLocalDayKey(useDayNow());

  const [mealType, setMealType] =
    useState<(typeof MEAL_TYPES)[number] | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] =
    useState<Portion | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  /* ================= DEBOUNCE ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 1 || !mealType) {
      setResults([]);
      return;
    }

    async function fetchProducts() {
      const { data } = await supabase.rpc(
        "search_food_products",
        {
          p_search: debouncedSearch,
          p_lang: lang,
          p_limit: 12,
        }
      );

      if (data) setResults(data);
    }

    fetchProducts();
  }, [debouncedSearch, lang, mealType]);

  /* ================= LOAD PORTIONS ================= */

  useEffect(() => {
    if (!selectedProduct) return;
  
    const productId = selectedProduct.id; // 👈 lokaal constant
  
    async function loadPortions() {
      const { data } = await supabase
        .from("food_portions")
        .select(`
          id,
          grams,
          ml,
          consumption_units (
            key,
            consumption_unit_translations (
              lang,
              label
            )
          )
        `)
        .eq("food_id", productId); // 👈 gebruik constante
  
      if (!data) return;
  
      const mapped: Portion[] = data.map((row: any) => {
        const unit = row.consumption_units;
        const translation =
          unit.consumption_unit_translations?.find(
            (tr: any) => tr.lang === lang
          ) ?? unit.consumption_unit_translations?.[0];
  
        return {
          id: row.id,
          grams: row.grams,
          ml: row.ml,
          unit_key: unit.key,
          unit_label: translation?.label ?? unit.key,
        };
      });
  
      setPortions(mapped);
      setSelectedPortion(null);
    }
  
    loadPortions();
  }, [selectedProduct, lang]);  

  /* ================= LABEL BUILDER ================= */

  function buildPortionLabel(p: Portion) {
    if (p.unit_key === "gram")
      return `${p.grams} ${p.unit_label}`;

    if (p.unit_key === "ml")
      return `${p.ml} ${p.unit_label}`;

    if (p.grams)
      return `1 ${p.unit_label} (${p.grams} g)`;

    if (p.ml)
      return `1 ${p.unit_label} (${p.ml} ml)`;

    return p.unit_label;
  }

  /* ================= PREVIEW ================= */

  const preview = useMemo(() => {
    if (!selectedProduct || !selectedPortion) {
      return {
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
  
    const base =
      selectedPortion.grams ??
      selectedPortion.ml ??
      0;
  
    const total = base * quantity;
    const factor = total / 100;
  
    return {
      kcal: factor * selectedProduct.kcal_per_100g,
      protein: factor * selectedProduct.protein_per_100g,
      carbs: factor * selectedProduct.carbs_per_100g,
      fat: factor * selectedProduct.fat_per_100g,
    };
  }, [selectedProduct, selectedPortion, quantity]);  

  /* ================= INSERT ================= */

  async function addConsumption() {
    if (!user || !selectedProduct || !selectedPortion || !mealType) {
      console.log("Missing required values");
      return;
    }
  
    const base =
      selectedPortion.grams ??
      selectedPortion.ml ??
      0;
  
    const total = base * quantity;
  
    const calories =
      (total / 100) *
      (selectedProduct.kcal_per_100g ?? 0);
  
    const { error } = await supabase
      .from("consumption_logs")
      .insert({
        user_id: user.id,
        food_id: selectedProduct.id,
        portion_id: selectedPortion.id,
        quantity,
        grams: selectedPortion.grams ? total : null,
        ml: selectedPortion.ml ? total : null,
        calories,
        meal_type: mealType,
        log_date: dayKey,
        log_time_local:
          new Date().toTimeString().slice(0, 8),
        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
  
    if (error) {
      console.error("INSERT ERROR:", error);
      alert(error.message);
      return;
    }
  
    if (onSaved) onSaved(calories);

// 🔥 trigger realtime refresh TodayConsumptionCard
dispatchDashboardEvent("nutrition-updated", {
  score: 0,
  color: "",
});

onClose();

  }

  function getMealLabel(type: string) {
    return t?.nutrition?.mealLabels?.[type] ?? type;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-3">
        <div className="w-full max-w-3xl rounded-[var(--radius)] bg-white p-6 shadow-xl my-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191970]">
              <Image src="/nutrition.svg" alt="" width={18} height={18} />
              {t?.nutrition?.addFood ?? "Voeding toevoegen"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-[var(--radius)] border border-[#191970] bg-[#191970] px-3 py-1 text-xs font-medium text-white"
            >
              {t?.common?.close ?? "Sluiten"}
            </button>
          </div>

          {/* ===== Moment ===== */}
          <div className="text-xs font-medium text-gray-500 mb-2">
            Selecteer je moment
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {MEAL_TYPES.map((m) => (
              <button
                key={m}
                onClick={() => setMealType(m)}
                className={`rounded-[var(--radius)] border px-3 py-2 text-sm font-medium transition ${
                  mealType === m
                    ? "bg-[#0095D3] text-white border-[#0095D3]"
                    : "border-[#0095D3] text-[#0095D3]"
                }`}
              >
                {getMealLabel(m)}
              </button>
            ))}
          </div>

          {/* ===== Product (blijft zichtbaar) ===== */}
          <div className="text-xs font-medium text-gray-500 mb-2">
            Product
          </div>

          {!selectedProduct && (
            <input
              type="text"
              disabled={!mealType}
              placeholder={
                !mealType
                  ? "Selecteer eerst een moment"
                  : t?.nutrition?.searchPlaceholder ?? "Zoek product..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-3 text-sm disabled:bg-gray-100"
            />
          )}

          {!selectedProduct &&
            results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {results.map((product) => (
                  <button
                    key={product.id}
                    disabled={!mealType}
                    onClick={() =>
                      setSelectedProduct(product)
                    }
                    className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-left text-sm font-medium text-[#0095D3]"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            )}

          {selectedProduct && (
            <>
              <div className="mt-4 p-4 border rounded-[var(--radius)] bg-[#0095D3]/10 flex justify-between">
                <span>{selectedProduct.name}</span>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSearch("");
                  }}
                  className="text-xs font-semibold text-[#0095D3]"
                >
                  Wijzigen
                </button>
              </div>

              {/* ===== Eenheid ===== */}
              <div className="text-xs font-medium text-gray-500 mt-6 mb-2">
                Eenheid
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      setSelectedPortion(p)
                    }
                    className={`rounded-[var(--radius)] border px-3 py-2 text-sm transition ${
                      selectedPortion?.id === p.id
                        ? "bg-[#0095D3] text-white border-[#0095D3]"
                        : "border-[#0095D3] text-[#0095D3]"
                    }`}
                  >
                    {buildPortionLabel(p)}
                  </button>
                ))}
              </div>

              {/* ===== Aantal ===== */}
              <div className="text-xs font-medium text-gray-500 mt-6 mb-2">
                Aantal
              </div>

              <input
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      parseInt(
                        e.target.value
                      ) || 1
                    )
                  )
                }
                className="w-full rounded-[var(--radius)] border border-[#0095D3] px-3 py-3 text-sm"
              />

              {/* ===== Preview ===== */}
              <div className="mt-4 rounded-xl bg-gray-100 p-4">
                <div className="text-lg font-semibold text-[#191970]">
                  {formatNumber(preview.kcal, lang)} kcal
                </div>

                <div className="mt-2 text-sm text-gray-700 flex gap-6">
                  <span>Eiwit: {formatNumber(preview.protein, lang)} g</span>
                  <span>Koolhydraten: {formatNumber(preview.carbs, lang)} g</span>
                  <span>Vet: {formatNumber(preview.fat, lang)} g</span>
                </div>
              </div>

              <button
                onClick={addConsumption}
                className="w-full mt-4 rounded-[var(--radius)] border border-[#0095D3] px-4 py-3 text-sm font-semibold text-[#0095D3] hover:bg-[#0095D3] hover:text-white transition"
              >
                {t?.nutrition?.addFood ?? "Voeding toevoegen"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
