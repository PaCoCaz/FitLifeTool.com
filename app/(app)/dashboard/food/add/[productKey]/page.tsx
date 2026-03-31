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
import "@/styles/category.css";

/* ───────────────── Types ───────────────── */

type Params = {
  productKey: string;
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

/* ───────────────── Component ───────────────── */

export default function AddFoodPage() {
  const params = useParams() as Params;
  const productKey = params.productKey;

  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLangContext();
  const dayKey = getLocalDayKey(useDayNow());

  const { refreshDashboard, limits } = useDashboard();
  const { goal } = useGoalContext();

  const [productName, setProductName] = useState("");
  const [productScore, setProductScore] = useState<number | null>(null);

  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] =
    useState<string | null>(null);

  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] =
    useState<Portion | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);

  /* ───────── FAVORITE CHECK ───────── */

  useEffect(() => {
    if (!user || !productKey) return;

    supabase
      .from("nutrition_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_key", productKey)
      .maybeSingle()
      .then(({ data }: { data: { id: string } | null }) => {
        if (data) {
          setIsFavorite(true);
          setFavoriteId(data.id);
        }
      });
  }, [user, productKey]);

  /* ───────── FAVORITE COUNT ───────── */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("nutrition_favorites")
      .select("nutrition_products!inner(is_drink)", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("nutrition_products.is_drink", false)
      .then(({ count }: { count: number | null }) => {
        setFavoriteCount(count ?? 0);
      });
  }, [user, isFavorite]);

  /* ───────── PRODUCT NAME ───────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    supabase
      .from("nutrition_product_translations")
      .select("name")
      .eq("product_key", productKey)
      .eq("lang", lang)
      .single()
      .then(({ data }: { data: { name: string } | null }) => {
        if (data) setProductName(data.name);
      });
  }, [productKey, lang]);

  /* ───────── PRODUCT SCORE ───────── */

  useEffect(() => {
    if (!productKey || !selectedPreparation || goal === null) return;

    supabase
      .from("nutrition_product_scores")
      .select("score_numeric")
      .eq("product_key", productKey)
      .eq("preparation_key", selectedPreparation)
      .eq("goal_key", goal)
      .single()
      .then(({ data }: { data: { score_numeric: number } | null }) => {
        setProductScore(data?.score_numeric ?? null);
      });
  }, [productKey, selectedPreparation, goal]);

  /* ───────── PREPARATIONS ───────── */

  useEffect(() => {
    if (!productKey || !lang) return;

    supabase
      .from("nutrition_product_preparations")
      .select("preparation_key")
      .eq("product_key", productKey)
      .then(async ({ data }: { data: { preparation_key: string }[] | null }) => {
        if (!data) return;

        const keys = [...new Set(data.map(d => d.preparation_key))];

        const { data: translations } = await supabase
          .from("nutrition_preparation_translations")
          .select("preparation_key, name")
          .in("preparation_key", keys)
          .eq("lang", lang);

        const mapped: Preparation[] = keys.map((key) => {
          const found = translations?.find(
            (t: any) => t.preparation_key === key
          );

          return {
            preparation_key: key,
            label: found?.name ?? key,
          };
        });

        setPreparations(mapped);
        setSelectedPreparation(mapped[0]?.preparation_key ?? null);
      });
  }, [productKey, lang]);

  /* ───────── PORTIONS ───────── */

  useEffect(() => {
    if (!selectedPreparation || !lang) return;

    supabase
      .from("nutrition_portions")
      .select("unit_key, grams, ml")
      .eq("product_key", productKey)
      .eq("preparation_key", selectedPreparation)
      .then(async ({ data }: { data: any[] | null }) => {
        if (!data) return;

        const unitKeys = [...new Set(data.map(p => p.unit_key))];

        const { data: unitTranslations } = await supabase
          .from("nutrition_unit_translations")
          .select("unit_key, label")
          .in("unit_key", unitKeys)
          .eq("lang", lang);

        const unitMap = new Map(
          (unitTranslations ?? []).map((u: any) => [u.unit_key, u.label])
        );

        const mapped: Portion[] = data.map((row: any) => ({
          unit_key: row.unit_key,
          grams: row.grams,
          ml: row.ml,
          label: `${unitMap.get(row.unit_key) ?? row.unit_key} (${
            row.grams ? `${row.grams} g` : `${row.ml} ml`
          })`,
        }));

        setPortions(mapped);
        setSelectedPortion(mapped[0] ?? null);
      });
  }, [selectedPreparation, productKey, lang]);

  /* ───────── FAVORITE TOGGLE ───────── */

  async function toggleFavorite() {
    if (!user) return;

    if (isFavorite && favoriteId) {
      await supabase.from("nutrition_favorites").delete().eq("id", favoriteId);
      setIsFavorite(false);
      return;
    }

    if (
      limits.max_favorite_foods !== null &&
      favoriteCount >= limits.max_favorite_foods
    ) {
      alert("Limiet bereikt. Upgrade nodig.");
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

  /* ───────── SAVE ───────── */

  async function handleSave() {
    if (!user || !selectedPortion || !selectedPreparation) return;

    await supabase.from("nutrition_logs").insert({
      user_id: user.id,
      log_date: dayKey,
      product_key: productKey,
      preparation_key: selectedPreparation,
      unit_key: selectedPortion.unit_key,
      quantity,
    });

    await refreshDashboard();
    router.push("/dashboard");
  }

  /* ───────── UI ───────── */

  return (
    <div className="category-grid">
      <div className="category-span-full">
        <div className="category-card">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-2">
            <h2>{productName}</h2>

            <button onClick={toggleFavorite} className="text-xl">
              {isFavorite ? "★" : "☆"}
            </button>
          </div>

          {/* SCORE */}
          {productScore !== null && (
            <div className="flex justify-between items-start mb-2">
              ProductScore:
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  productScore >= 80
                    ? "bg-green-100 text-green-700"
                    : productScore >= 50
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {productScore}
              </span>
            </div>
          )}

          <hr className="mb-4" />

          {/* BEREIDING */}
          <h3>Bereiding</h3>
          <div className="space-y-2 mb-4">
            {preparations.map((p) => (
              <button
                key={p.preparation_key}
                onClick={() => setSelectedPreparation(p.preparation_key)}
                className="w-full text-left border rounded px-3 py-2"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* EENHEID */}
          <h3>Eenheid</h3>
          <div className="space-y-2 mb-4">
            {portions.map((p) => (
              <button
                key={p.unit_key}
                onClick={() => setSelectedPortion(p)}
                className="w-full text-left border rounded px-3 py-2"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* AANTAL */}
          <h3>Aantal</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            className="border rounded px-3 py-2 w-24 mb-6"
          />

          {/* BUTTON */}
          <button
            onClick={handleSave}
            className="category-card-button category-card-link"
          >
            <span>Toevoegen</span>
            <img src="/arrow_right_circle.svg" alt="" className="category-card-icon" aria-hidden="true" />
          </button>

        </div>
      </div>
    </div>
  );
}
