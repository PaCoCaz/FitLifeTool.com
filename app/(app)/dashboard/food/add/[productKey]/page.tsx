// app/(app)/dashboard/food/add/[productKey]/page.tsx

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
import "@/styles/category.css";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

/* ───────── TYPES ───────── */

type Params = {
  productKey: string;
};

type ProductTranslationRow = {
  name: string;
};

type PreparationKeyRow = {
  preparation_key: string;
};

type PreparationTranslationRow = {
  preparation_key: string;
  name: string;
};

type PortionRow = {
  unit_key: string;
  grams: number | null;
  ml: number | null;
};

type UnitTranslationRow = {
  unit_key: string;
  label: string;
};

type Preparation = {
  preparation_key: string;
  label: string;
  sort_order: number;
};

type PreparationMetaRow = {
  preparation_key: string;
  sort_order: number;
};

type PreparationWithMeta = {
  preparation_key: string;
  is_default: boolean;
};

type Portion = {
  unit_key: string;
  grams: number | null;
  ml: number | null;
  label: string;
  sort_order: number;
  is_default: boolean;
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
  salt_per_100g: number | null;
};

type FavoriteRow = {
  id: string;
};

/* ───────── COMPONENT ───────── */

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

  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] = useState<string | null>(null);

  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);

  const [quantity, setQuantity] = useState<number | null>(null);
  const [nutrition, setNutrition] = useState<NutritionRow | null>(null);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  /* ───────── FAVORITE CHECK ───────── */

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function checkFavorite() {
      const { data } = await supabase
        .from("nutrition_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("product_key", productKey)
        .maybeSingle<FavoriteRow>();

      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    }

    checkFavorite();
  }, [user, productKey]);

  /* ───────── FAVORITE COUNT ───────── */

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function loadCount() {
      const { count } = await supabase
        .from("nutrition_favorites")
        .select("nutrition_products!inner(is_drink)", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId)
        .eq("nutrition_products.is_drink", false);

      setFavoriteCount(count ?? 0);
    }

    loadCount();
  }, [user, isFavorite]);

  /* ───────── PRODUCT NAME ───────── */

  useEffect(() => {
    if (!lang) return;

    async function loadName() {
      const { data } = await supabase
        .from("nutrition_product_translations")
        .select("name")
        .eq("product_key", productKey)
        .eq("lang", lang)
        .single<ProductTranslationRow>();

      if (data) setProductName(data.name);
    }

    loadName();
  }, [productKey, lang]);

  /* ───────── PRODUCT SCORE ───────── */

  useEffect(() => {
    if (!selectedPreparation || goal === null) return;

    async function loadScore() {
      const { data } = await supabase
        .from("nutrition_product_scores")
        .select("score_numeric")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .eq("goal_key", goal)
        .single();

      setProductScore(data?.score_numeric ?? null);
    }

    loadScore();
  }, [productKey, selectedPreparation, goal]);

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

  /* ───────── PREPARATIONS ───────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    async function loadPreparations() {
      const { data: prepData } = await supabase
        .from("nutrition_product_preparations")
        .select("preparation_key")
        .eq("product_key", productKey);

      if (!prepData) return;

      const typedPrep = prepData as {
        preparation_key: string;
      }[];

      // unieke keys
      const uniqueKeys = Array.from(
        new Map<string, { preparation_key: string }>(
          typedPrep.map((d) => [d.preparation_key, d])
        ).values()
      );

      const keys = uniqueKeys.map((d) => d.preparation_key);

      if (keys.length === 0) return;

      // vertalingen
      const { data: translations } = await supabase
        .from("nutrition_preparation_translations")
        .select("preparation_key, name")
        .in("preparation_key", keys)
        .eq("lang", lang);

      const translationMap = new Map<string, string>(
        ((translations as PreparationTranslationRow[]) ?? []).map((t) => [
          t.preparation_key,
          t.name,
        ])
      );

      // sort_order
      const { data: meta } = await supabase
        .from("nutrition_preparations")
        .select("preparation_key, sort_order");

      const metaMap = new Map<string, number>(
        ((meta as { preparation_key: string; sort_order: number }[]) ?? []).map(
          (m) => [m.preparation_key, m.sort_order]
        )
      );

      // mappen + sorteren
      const mapped: Preparation[] = uniqueKeys
        .map((row) => ({
          preparation_key: row.preparation_key,
          label:
            translationMap.get(row.preparation_key) ??
            row.preparation_key,
          sort_order:
            metaMap.get(row.preparation_key) ?? 999,
        }))
        .sort((a, b) => a.sort_order - b.sort_order);

      setPreparations(mapped);

      // default = eerste
      setSelectedPreparation(mapped[0]?.preparation_key ?? null);
    }

    loadPreparations();
  }, [productKey, lang]);

  /* ───────── PORTIONS ───────── */

  useEffect(() => {
    if (!selectedPreparation || !lang) return;

    async function loadPortions() {
      const { data } = await supabase
        .from("nutrition_portions")
        .select("unit_key, grams, ml, sort_order, is_default")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .order("sort_order", { ascending: true });

      if (!data) return;

      const typed = data as {
        unit_key: string;
        grams: number | null;
        ml: number | null;
        sort_order: number;
        is_default: boolean;
      }[];

      const unitKeys = Array.from(
        new Set(typed.map((p) => p.unit_key))
      );

      const { data: unitTranslations } = await supabase
        .from("nutrition_unit_translations")
        .select("unit_key, label")
        .in("unit_key", unitKeys)
        .eq("lang", lang);

      const unitMap = new Map<string, string>(
        ((unitTranslations as UnitTranslationRow[]) ?? []).map((u) => [
          u.unit_key,
          u.label,
        ])
      );

      const mapped: Portion[] = typed.map((row) => {
        const unitLabel =
          unitMap.get(row.unit_key) ?? row.unit_key;

        let label = unitLabel;

        // ❗ geen suffix voor basis units
        const isBaseUnit =
          row.unit_key === "GRAM" || row.unit_key === "ML";

        if (!isBaseUnit) {
          if (row.grams) {
            label += ` (${row.grams} gram)`;
          } else if (row.ml) {
            label += ` (${row.ml} ml)`;
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

      setPortions(mapped);

      setSelectedPortion((prev) => {
        if (prev && mapped.some(p => p.unit_key === prev.unit_key)) {
          return prev;
        }
        return mapped[0] ?? null;
      });
    }

    loadPortions();
  }, [selectedPreparation, productKey, lang]);

  /* ───────── SAVE ───────── */

  async function toggleFavorite() {
    if (!user) return;

    const userId = user.id;

    if (isFavorite && favoriteId) {
      await supabase
        .from("nutrition_favorites")
        .delete()
        .eq("id", favoriteId);

      setIsFavorite(false);
      setFavoriteId(null);
      return;
    }

    if (
      limits.max_favorite_foods !== null &&
      favoriteCount >= limits.max_favorite_foods
    ) {
      alert(
        t.common.favoriteLimitUpgrade.replace(
          "{{limit}}",
          String(limits.max_favorite_foods)
        )
      );
      return;
    }

    const { data } = await supabase
      .from("nutrition_favorites")
      .insert({
        user_id: userId,
        product_key: productKey,
      })
      .select("id")
      .single();

    if (data) {
      setIsFavorite(true);
      setFavoriteId(data.id);
    }
  }

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

    const sodium = (nutrition.sodium_per_100g ?? 0) * factor;

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
      salt: (nutrition.salt_per_100g ?? 0) * factor,
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
  <div className="category-grid">
    <div className="category-span-full space-y-3">

      {/* CARD 1 — PRODUCT */}
      <Card
        header={
          <CardHeader
            icon="/nutrition.svg"
            title={t.common.product}
            scoreLabel="FitLifeScore"
            score={productScore ?? undefined}
            scoreColor={
              productScore !== null
                ? productScore >= 80
                  ? "bg-green-600 text-white"
                  : productScore >= 50
                  ? "bg-yellow-300 text-black"
                  : "bg-[#C80000] text-white"
                : undefined
            }
          />
        }
      >
        <div className="flex justify-between items-start">
          <div className="text-[#191970] font-semibold">
            {productName}
          </div>

          <button
            onClick={toggleFavorite}
            className="ml-2 transition-transform hover:scale-110"
          >
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
              className="flex-1 h-[42px] text-sm flex justify-between items-center px-4 rounded-[var(--radius)] bg-[#191970] text-white"
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
