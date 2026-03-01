//  app/(app)/dashboard/food/add/[productKey]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";
import { useDayNow } from "@/lib/useDayNow";
import { getLocalDayKey } from "@/lib/dayKey";

/* ───────────────── Types ───────────────── */

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
  const dayKey = getLocalDayKey(useDayNow());

  const [productName, setProductName] = useState<string>("");

  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] =
    useState<string | null>(null);

  const [portions, setPortions] = useState<Portion[]>([]);
  const [selectedPortion, setSelectedPortion] =
    useState<Portion | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  /* ───────────────── PRODUCT NAME ───────────────── */

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase
        .from("nutrition_product_translations")
        .select("name")
        .eq("product_key", productKey)
        .eq("lang", "nl")
        .single<ProductTranslationRow>();

      if (data) {
        setProductName(data.name);
      }
    }

    loadProduct();
  }, [productKey]);

  /* ───────────────── PREPARATIONS ───────────────── */

  useEffect(() => {
    async function loadPreparations() {
      const { data } = await supabase
        .from("nutrition_portions")
        .select("preparation_key")
        .eq("product_key", productKey);

      if (!data) return;

      const typedKeys = data as PreparationKeyRow[];

      const uniqueKeys: string[] = Array.from(
        new Set(typedKeys.map((d: PreparationKeyRow) => d.preparation_key))
      );

      const { data: translations } = await supabase
        .from("preparation_translations")
        .select("preparation_key, name")
        .in("preparation_key", uniqueKeys)
        .eq("lang", "nl");

      const typedTranslations =
        (translations as PreparationTranslationRow[]) ?? [];

      const mapped: Preparation[] = uniqueKeys.map((key: string) => {
        const found = typedTranslations.find(
          (t: PreparationTranslationRow) =>
            t.preparation_key === key
        );

        return {
          preparation_key: key,
          label: found?.name ?? key,
        };
      });

      setPreparations(mapped);
      setSelectedPreparation(mapped[0]?.preparation_key ?? null);
    }

    loadPreparations();
  }, [productKey]);

  /* ───────────────── PORTIONS ───────────────── */

  useEffect(() => {
    if (!selectedPreparation) return;

    async function loadPortions() {
      const { data } = await supabase
        .from("nutrition_portions")
        .select("unit_key, grams, ml")
        .eq("product_key", productKey)
        .eq("preparation_key", selectedPreparation);

      if (!data) return;

      const typedData = data as PortionRow[];

      const mapped: Portion[] = typedData.map(
        (row: PortionRow) => ({
          unit_key: row.unit_key,
          grams: row.grams,
          ml: row.ml,
          label:
            row.grams !== null
              ? `${row.grams} g`
              : `${row.ml} ml`,
        })
      );

      setPortions(mapped);
      setSelectedPortion(mapped[0] ?? null);
    }

    loadPortions();
  }, [selectedPreparation, productKey]);

  /* ───────────────── SAVE ───────────────── */

  async function handleSave() {
    if (!user || !selectedPortion) return;

    const base =
      selectedPortion.grams ??
      selectedPortion.ml ??
      0;

    const total = base * quantity;

    await supabase.from("consumption_logs").insert({
        user_id: user.id,
        product_key: productKey,
        preparation_key: selectedPreparation,
        unit_key: selectedPortion.unit_key,
        grams: selectedPortion.grams ? total : null,
        ml: selectedPortion.ml ? total : null,
        quantity,
        log_date: dayKey,
      });
  
      window.dispatchEvent(
        new Event("consumption-changed")
      );
  
      router.push("/dashboard");
    }
  
    /* ───────────────── UI ───────────────── */
  
    return (
        <div className="grid grid-cols-12 gap-6">
      
          <div className="col-span-12">
      
            <div className="bg-white rounded-[var(--radius)] shadow-sm border">
      
              {/* Header */}
              <div className="px-6 py-4 border-b">
                <h1 className="text-lg font-semibold">
                  {productName}
                </h1>
              </div>
      
              {/* Content */}
              <div className="px-6 py-6 space-y-10">
      
                {/* Bereiding */}
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
      
                {/* Eenheid */}
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
      
                {/* Aantal */}
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
      
              {/* Action bar */}
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