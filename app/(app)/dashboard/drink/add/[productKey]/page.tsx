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

/* ───────────────── Types ───────────────── */

type Params = {
  productKey: string;
};

type ProfileRow = {
  goal: string;
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
  sort_order: number | null;
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
  id: string;
};

/* ───────────────── Component ───────────────── */

export default function AddFoodPage() {
  const params = useParams() as Params;
  const productKey = params.productKey;

  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLangContext();
  const dayKey = getLocalDayKey(useDayNow());

  const { refreshDashboard } = useDashboard();

  const [goal, setGoal] = useState<string>("maintain");
  const [productName, setProductName] = useState<string>("");
  const [productScore, setProductScore] = useState<number | null>(null);

  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] =
    useState<string | null>(null);

  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] =
    useState<Portion | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  /* ───────────────── LOAD GOAL ───────────────── */

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("goal")
        .eq("id", user!.id)
        .single<ProfileRow>();

      if (data?.goal) setGoal(data.goal);
    }

    loadProfile();
  }, [user]);

  /* ⭐ CHECK FAVORITE */

  useEffect(() => {
    if (!user || !productKey) return;

    async function checkFavorite() {
      const { data } = await supabase
        .from("nutrition_favorites")
        .select("id")
        .eq("user_id", user!.id)
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
    if (!productKey || !goal || !selectedPreparation) return;

    async function loadProductScore() {
      const { data } = await supabase
        .from("nutrition_product_scores")
        .select("score_numeric")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .eq("goal_key", goal)
        .single();

      if (data?.score_numeric !== undefined) {
        setProductScore(data.score_numeric);
      } else {
        setProductScore(null);
      }
    }

    loadProductScore();
  }, [productKey, goal, selectedPreparation]);

  /* ───────────────── PREPARATIONS ───────────────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    async function loadPreparations() {
      const { data } = await supabase
        .from("nutrition_product_preparations")
        .select("preparation_key")
        .eq("product_key", productKey);

      if (!data) return;

      const typedKeys = data as PreparationKeyRow[];

      const uniqueKeys = Array.from(
        new Set(typedKeys.map((d) => d.preparation_key))
      );

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

    async function loadPortions() {
      setPortions([]);
      setSelectedPortion(null);

      const { data: portionsRaw } = await supabase
        .from("nutrition_portions")
        .select("unit_key, grams, ml, sort_order")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation)
        .order("sort_order", { ascending: true });

      if (!portionsRaw) return;

      const portionsData = portionsRaw as PortionRow[];
      if (portionsData.length === 0) return;

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
        const unitLabel = unitMap.get(row.unit_key);

        const amount =
          row.grams !== null
            ? `${row.grams} g`
            : `${row.ml} ml`;

        return {
          unit_key: row.unit_key,
          grams: row.grams,
          ml: row.ml,
          label: unitLabel
            ? `${unitLabel} (${amount})`
            : amount,
        };
      });

      setPortions(mapped);
      setSelectedPortion(mapped[0] ?? null);
    }

    loadPortions();
  }, [selectedPreparation, productKey, lang]);

  /* ───────────────── SAVE ───────────────── */

  /* ⭐ TOGGLE FAVORITE */

  async function toggleFavorite() {
    if (!user) return;

    if (isFavorite && favoriteId) {
      await supabase
        .from("nutrition_favorites")
        .delete()
        .eq("id", favoriteId);

      setIsFavorite(false);
      setFavoriteId(null);
      return;
    }

    const { data } = await supabase
      .from("nutrition_favorites")
      .insert({
        user_id: user.id,
        product_key: productKey,
      })
      .select("id")
      .single();

    if (data) {
      setIsFavorite(true);
      setFavoriteId(data.id);
    }
  }

  async function handleSave() {
    if (!user || !selectedPortion || !selectedPreparation) return;

    const { data: nutrition } = await supabase
      .from("nutrition_product_preparations")
      .select("*")
      .eq("product_key", productKey)
      .eq("preparation_key", selectedPreparation)
      .single<NutritionRow>();

    if (!nutrition) return;

    const totalGrams = selectedPortion.grams
      ? selectedPortion.grams * quantity
      : null;

    const totalMl = selectedPortion.ml
      ? selectedPortion.ml * quantity
      : null;

    const factor =
      totalGrams !== null
        ? totalGrams / 100
        : totalMl !== null
        ? totalMl / 100
        : 0;

    const kcal =
      (nutrition.kcal_per_100g ??
        nutrition.kcal_per_100ml ??
        0) * factor;

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

    await supabase.from("nutrition_logs").insert({
      user_id: user.id,
      log_date: dayKey,
      product_key: productKey,
      preparation_key: selectedPreparation,
      unit_key: selectedPortion.unit_key,
      quantity,
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

    await refreshDashboard();

    window.dispatchEvent(new Event("consumption-changed"));
    router.push("/dashboard");
  }

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="bg-white rounded-[var(--radius)] shadow-sm border">

          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              {productName}
            </h1>

            <div className="flex items-center gap-3">

              {productScore !== null && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    productScore >= 80
                      ? "bg-green-100 text-green-700"
                      : productScore >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Score {productScore} / 100
                </div>
              )}

              <button
                onClick={toggleFavorite}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  isFavorite
                    ? "bg-[#0095D3] text-white border-[#0095D3]"
                    : "border-gray-300 text-gray-600 hover:border-[#0095D3] hover:text-[#0095D3]"
                }`}
              >
                {isFavorite ? "★ Favoriet" : "☆ Favoriet"}
              </button>

            </div>
          </div>

          <div className="px-6 py-6 space-y-10">

            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-4">
                Bereiding
              </h2>

              <div className="space-y-3">
                {preparations.map((p) => (
                  <button
                    key={p.preparation_key}
                    onClick={() =>
                      setSelectedPreparation(p.preparation_key)
                    }
                    className={`w-full text-left px-4 py-3 rounded-[var(--radius)] border transition ${
                      selectedPreparation === p.preparation_key
                        ? "border-[#0095D3] bg-[#E6F4FA] text-[#0095D3]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-4">
                Eenheid
              </h2>

              <div className="space-y-3">
                {portions.map((p) => (
                  <button
                    key={p.unit_key}
                    onClick={() => setSelectedPortion(p)}
                    className={`w-full text-left px-4 py-3 rounded-[var(--radius)] border transition ${
                      selectedPortion?.unit_key === p.unit_key
                        ? "border-[#0095D3] bg-[#E6F4FA] text-[#0095D3]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-4">
                Aantal
              </h2>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                className="w-32 border rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0095D3] focus:border-[#0095D3]"
              />
            </div>

          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-[#0095D3] text-white px-6 py-3 rounded-[var(--radius)] font-medium hover:opacity-90 transition"
            >
              Gereed
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}