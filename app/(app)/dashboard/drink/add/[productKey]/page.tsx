// app/(app)/dashboard/drink/add/[productKey]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";
import { useLangContext } from "@/lib/LangProvider";
import { useDashboard } from "@/lib/DashboardStore";
import { useGoalContext } from "@/lib/GoalProvider";
import NutritionPreview from "@/components/ui/NutritionPreview";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useMemo } from "react";
import Image from "next/image";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import {
  selectDefaultPortion,
  sortPortionsForDisplay,
} from "@/lib/nutrition/portionSelection";

/* ───────────────── Types ───────────────── */

type Params = {
  productKey: string;
};

type ProductTranslationRow = {
  name: string;
};

type PreparationKeyRow = {
  preparation_key: string;
  nutrition_preparations?: {
    sort_order: number | null;
  };
};

type PreparationTranslationRow = {
  preparation_key: string;
  name: string;
};

type PortionRow = {
  unit_key: string;
  grams: number | null;
  ml: number | null;
  sort_order: number | null;
  is_default: boolean;
};

type Preparation = {
  preparation_key: string;
  label: string;
};

type Portion = {
  unit_key: string;
  grams: number | null;
  ml: number | null;
  label: string;
  sort_order: number | null;
  is_default: boolean;
};

type UnitTranslationRow = {
  unit_key: string;
  label: string;
};

type NutritionRow = {
  kcal_per_100g: number | null;
  kcal_per_100ml: number | null;
  protein_per_100g: number | null;
  carbs_per_100g: number | null;
  fat_per_100g: number | null;
  fiber_per_100g: number | null;
  sugar_per_100g: number | null;
  alcohol_per_100g: number | null;
  water_percent: number | null;
  sodium_per_100g: number | null;
};

type FavoriteRow = {
  isFavorite: boolean;
};

/* ───────────────── Component ───────────────── */

export default function AddFoodPage() {
  const langCode = useLang();
  const t = uiText[langCode];

  const params = useParams() as Params;
  const productKey = params.productKey;
  
  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLangContext();
  const dayKey = getLocalDayKey(useDayNow());
  
  const { refreshDashboard, limits } = useDashboard();
  const { goal } = useGoalContext();
  
  const [productName, setProductName] = useState<string>("");
  const [productScore, setProductScore] = useState<number | null>(null);
  const [productGrade, setProductGrade] = useState<string | null>(null);
  
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] = useState<string | null>(null);
  
  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  
  const [quantity, setQuantity] = useState<number | null>(null);
  const [nutrition, setNutrition] = useState<NutritionRow | null>(null);
  
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  /* ⭐ CHECK FAVORITE */

  useEffect(() => {
    if (!user || !productKey) return;

    async function checkFavorite() {
      const res = await fetch(
        `/api/favorites/access?type=drink&productKey=${encodeURIComponent(productKey)}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        return;
      }

      const data =
        (await res.json()) as FavoriteRow;

      setIsFavorite(data.isFavorite);
    }

    checkFavorite();
  }, [user, productKey]);

  /* ───────────────── PRODUCT NAME ───────────────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    async function loadProduct() {
      const { data } = await supabase
        .from("nutrition_product_translations")
        .select("name")
        .eq("product_key", productKey)
        .eq("lang", lang)
        .single<ProductTranslationRow>();

      if (data) {
        setProductName(data.name);
      }
    }

    loadProduct();
  }, [productKey, lang]);

  /* ───────────────── PRODUCT SCORE ───────────────── */

  useEffect(() => {
    if (!productKey || !selectedPreparation || goal === null) return;

    async function loadProductScore() {
      const { data } = await supabase
        .from("nutrition_product_scores")
        .select("score_numeric, score_grade")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .eq("goal_key", goal)
        .single();

      if (data) {
        setProductScore(data.score_numeric ?? null);
        setProductGrade(data.score_grade ?? null);
      } else {
        setProductScore(null);
        setProductGrade(null);
      }
    }

    loadProductScore();
  }, [productKey, goal, selectedPreparation]);

  useEffect(() => {
    if (!productKey || !selectedPreparation) return;

    async function loadNutrition() {
      const { data } = await supabase
        .from("nutrition_product_preparations")
        .select("*")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .single<NutritionRow>();

      setNutrition(data ?? null);
    }

    loadNutrition();
  }, [productKey, selectedPreparation]);

  /* ───────────────── PREPARATIONS ───────────────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    async function loadPreparations() {
      const { data } = await supabase
        .from("nutrition_product_preparations")
        .select(`
          preparation_key,
          nutrition_preparations (
            sort_order
          )
        `)
        .eq("product_key", productKey);

      if (!data) return;

      const sortedKeys = [...((data ?? []) as PreparationKeyRow[])]
        .sort((a, b) => {
          const aOrder =
            a.nutrition_preparations?.sort_order ?? 999;

          const bOrder =
            b.nutrition_preparations?.sort_order ?? 999;

          return aOrder - bOrder;
        })
        .map((d) => d.preparation_key);

      const uniqueKeys = Array.from(new Set(sortedKeys));

      if (uniqueKeys.length === 0) return;

      const { data: translations } = await supabase
        .from("nutrition_preparation_translations")
        .select("preparation_key, name")
        .in("preparation_key", uniqueKeys)
        .eq("lang", lang);

      const typedTranslations =
        (translations as PreparationTranslationRow[]) ?? [];

      const mapped: Preparation[] = uniqueKeys.map((key) => {
        const found = typedTranslations.find(
          (t) => t.preparation_key === key
        );

        return {
          preparation_key: key,
          label: found?.name ?? key,
        };
      });

      setPreparations(mapped);

      setSelectedPreparation((prev) => {
        if (prev && mapped.some(p => p.preparation_key === prev)) {
          return prev;
        }
        return mapped[0]?.preparation_key ?? null;
      });
    }

    loadPreparations();
  }, [productKey, lang]);

  /* ───────────────── PORTIONS ───────────────── */

  useEffect(() => {
    if (!selectedPreparation || !lang) return;

    let cancelled = false;

    async function loadPortions() {


      const { data: portionsRaw } = await supabase
        .from("nutrition_portions")
        .select("unit_key, grams, ml, sort_order, is_default")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .order("sort_order", { ascending: true });

      if (!portionsRaw) {
        if (!cancelled) {
          setPortions([]);
          setSelectedPortion(null);
        }
        return;
      }

      const portionsData = portionsRaw as PortionRow[];
      if (portionsData.length === 0) {
        if (!cancelled) {
          setPortions([]);
          setSelectedPortion(null);
        }
        return;
      }

      const unitKeys = Array.from(
        new Set(portionsData.map((p) => p.unit_key))
      );

      const { data: unitTranslationsRaw } = await supabase
        .from("nutrition_unit_translations")
        .select("unit_key, label")
        .in("unit_key", unitKeys)
        .eq("lang", lang);

      const unitTranslations =
        (unitTranslationsRaw as UnitTranslationRow[]) ?? [];

      const unitMap = new Map<string, string>(
        unitTranslations.map((u) => [u.unit_key, u.label])
      );

      const mapped: Portion[] = portionsData.map((row) => {
        const unitLabel = unitMap.get(row.unit_key) ?? row.unit_key;

        const isBaseUnit =
          row.unit_key === "GRAM" || row.unit_key === "ML";

        let label = unitLabel;

        if (!isBaseUnit) {
          const amount =
            row.grams !== null
              ? `${row.grams} g`
              : row.ml !== null
              ? `${row.ml} ml`
              : "";

          if (amount) {
            label += ` (${amount})`;
          }
        }

        return {
          unit_key: row.unit_key,
          grams: row.grams,
          ml: row.ml,
          label,
          sort_order: row.sort_order,
          is_default: row.is_default,
        };
      });

      const displayPortions = sortPortionsForDisplay(mapped);

      if (cancelled) return;

      setPortions(displayPortions);
      setSelectedPortion(selectDefaultPortion(displayPortions));
    }

    loadPortions();

    return () => {
      cancelled = true;
    };
  }, [selectedPreparation, productKey, lang]);

  /* ⭐ TOGGLE FAVORITE */

  async function toggleFavorite(productKeyInput: string) {
    if (!user) return;

    const method = isFavorite ? "DELETE" : "POST";

    const res = await fetch("/api/favorites", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "drink",
        productKey: productKeyInput,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null) as {
        code?: string;
      } | null;

      if (error?.code === "FAVORITE_LIMIT_REACHED") {
        alert(
          t.common.favoriteLimitUpgrade.replace(
            "{{limit}}",
            String(limits.max_favorite_drinks ?? "")
          )
        );
        return;
      }

      throw new Error(
        `Favorite update failed: ${res.status}`
      );
    }

    const access = await fetch(
      `/api/favorites/access?type=drink&productKey=${encodeURIComponent(productKeyInput)}`,
      {
        cache: "no-store",
      }
    );

    if (access.ok) {
      const data =
        (await access.json()) as FavoriteRow;

      setIsFavorite(data.isFavorite);
    }

    await refreshDashboard();
  }

  /* ───────────────── SAVE ───────────────── */

  const nutritionPreview = useMemo(() => {
    if (!nutrition || !selectedPortion) return null;

    const qty = quantity ?? 1;

    const totalGrams = selectedPortion.grams
      ? selectedPortion.grams * qty
      : null;

    const totalMl = selectedPortion.ml
      ? selectedPortion.ml * qty
      : null;

    const factor =
      totalGrams !== null
        ? totalGrams / 100
        : totalMl !== null
        ? totalMl / 100
        : 0;

    return {
      kcal:
        (nutrition.kcal_per_100g ??
          nutrition.kcal_per_100ml ??
          0) * factor,

      protein: (nutrition.protein_per_100g ?? 0) * factor,
      carbs: (nutrition.carbs_per_100g ?? 0) * factor,
      fat: (nutrition.fat_per_100g ?? 0) * factor,
      fiber: (nutrition.fiber_per_100g ?? 0) * factor,
      sugar: (nutrition.sugar_per_100g ?? 0) * factor,
      salt: 0,
    };
  }, [nutrition, selectedPortion, quantity]);

  async function handleSave() {
      if (!user || !selectedPortion || !selectedPreparation) return;
  
      const finalQuantity = quantity ?? 1;
  
      const { data: nutrition } = await supabase
        .from("nutrition_product_preparations")
        .select("*")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .single<NutritionRow>();
  
      if (!nutrition) return;
  
      const totalGrams = selectedPortion.grams
        ? selectedPortion.grams * finalQuantity
        : null;
  
      const totalMl = selectedPortion.ml
        ? selectedPortion.ml * finalQuantity
        : null;
  
      const factor =
        totalGrams !== null
          ? totalGrams / 100
          : totalMl !== null
          ? totalMl / 100
          : 0;
  
      const kcal =
        (nutrition.kcal_per_100g ?? nutrition.kcal_per_100ml ?? 0) * factor;
  
      const protein = (nutrition.protein_per_100g ?? 0) * factor;
      const carbs = (nutrition.carbs_per_100g ?? 0) * factor;
      const fat = (nutrition.fat_per_100g ?? 0) * factor;
      const fiber = (nutrition.fiber_per_100g ?? 0) * factor;
      const sugar = (nutrition.sugar_per_100g ?? 0) * factor;
      const alcohol = (nutrition.alcohol_per_100g ?? 0) * factor;
      const sodium = (nutrition.sodium_per_100g ?? 0) * factor;
  
      const water =
        nutrition.water_percent !== null && totalGrams !== null
          ? (nutrition.water_percent / 100) * totalGrams
          : null;
  
      const { error } = await supabase.from("nutrition_logs").insert({
        user_id: user.id,
        log_date: dayKey,
        product_key: productKey,
        preparation_key: selectedPreparation,
        unit_key: selectedPortion.unit_key,
        quantity: finalQuantity, // 👈 BELANGRIJK
        grams: totalGrams,
        ml: totalMl,
        kcal,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        alcohol,
        water,
        sodium,
      });
  
      if (error) {
        console.error(error);
        alert(error.message);
        return;
     }
  
      await refreshDashboard();
      router.push("/dashboard");
    }

  /* ───────── UI ───────── */
  
    return (
      <div className="grid grid-cols-12 gap-4 items-stretch auto-rows-fr">
        <div className="col-span-12 space-y-3">
  
        {/* CARD 1 — PRODUCT */}
        <Card
          header={
            <CardHeader
              icon="/nutrition.svg"
              title={t.common.product}
              scoreLabel="FitLifeScore"
              score={productScore ?? undefined}
              grade={productGrade ?? undefined}
              scoreColor={
                productGrade === "A"
                  ? "bg-green-600 text-white"
                  : productGrade === "B"
                  ? "bg-green-200 text-green-800"
                  : productGrade === "C"
                  ? "bg-yellow-300 text-[#191970]"
                  : productGrade === "D"
                  ? "bg-orange-500 text-white"
                  : productGrade === "E"
                  ? "bg-[#C80000] text-white"
                  : undefined
              }
            />
          }
        >
          <div className="flex justify-between items-start">
            <div className="text-[#191970] font-semibold">
              {productName}
            </div>

            <button onClick={() => toggleFavorite(productKey)} className="ml-2 transition-transform hover:scale-110">
              <Image
                src={isFavorite ? "/favorite-active.svg" : "/favorite-not-active.svg"}
                alt=""
                width={23}
                height={23}
              />
            </button>
          </div>
        </Card>
  
        {/* CARD 2 — BEREIDING */}
        {preparations.length > 1 && (
          <Card
            header={<CardHeader title={t.nutrition.preparation} />}
            headerSpacing="compact"
          >
            <div className="-mx-4">
              {preparations.map((p) => {
                const active = selectedPreparation === p.preparation_key;

                return (
                  <button
                    key={p.preparation_key}
                    onClick={() => setSelectedPreparation(p.preparation_key)}
                    className={`
                      w-full text-left px-4 py-2
                      flex items-center gap-3
                      border-b border-[#DBE4F0]
                      leading-tight
                      ${active ? "text-[#0BA4E0] font-medium" : ""}
                    `}
                  >
                    <div className="w-4 flex items-center justify-center">
                      <span className={active ? "" : "invisible"}>✓</span>
                    </div>

                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}
  
        {/* CARD 3 — EENHEID */}
        {portions.length > 1 && (
          <Card
            header={<CardHeader title={t.nutrition.unit} />}
            headerSpacing="compact"
          >
            <div className="-mx-4">
              {portions.map((p) => {
                const active = selectedPortion?.unit_key === p.unit_key;

                return (
                  <button
                    key={p.unit_key}
                    onClick={() => setSelectedPortion(p)}
                    className={`
                      w-full text-left px-4 py-2
                      flex items-center gap-3
                      border-b border-[#DBE4F0]
                      leading-tight
                      ${active ? "text-[#0BA4E0] font-medium" : ""}
                    `}
                  >
                    <div className="w-4 flex items-center justify-center">
                      <span className={active ? "" : "invisible"}>✓</span>
                    </div>

                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}
  
        {/* CARD 4 — AANTAL */}
        <Card
          header={<CardHeader title={t.nutrition.amount} />}
        >
          <div className="space-y-3">

            {/* PREVIEW */}
            <NutritionPreview data={nutritionPreview} />

            {/* INPUT + BUTTON */}
            <div className="flex items-stretch gap-3">
              <input
                type="number"
                placeholder="1"
                value={quantity ?? ""}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === ""
                      ? null
                      : Math.max(1, Number(e.target.value))
                  )
                }
                className="text-right border border-[#191970] rounded px-4 w-24 h-[42px]"
              />

              <button
                onClick={handleSave}
                className="flex-1 h-[42px] text-sm flex justify-between items-center px-4 rounded-[var(--radius)] bg-[#191970] text-white hover:bg-[#0BA4E0] transition-colors"
              >
                <span>{t.common.add}</span>
                <Image
                  src="/arrow_right_circle.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
            </div>

          </div>
        </Card>
  
      </div>
    </div>
  );
}
