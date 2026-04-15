// app/(app)/dashboard/drink/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLangContext } from "@/lib/LangProvider";
import { getLocalDayKey } from "@/lib/dayKey";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

/* ───────────────── Types ───────────────── */

type DrinkLog = {
  product_key: string;
  ml: number;
  preparation_key: string;
  unit_key: string;
};

type Product = {
  product_key: string;
  is_drink: boolean;
};

type Translation = {
  product_key?: string;
  preparation_key?: string;
  unit_key?: string;
  name: string;
};

type DrinkItem = {
  product_key: string;
  preparation_key: string;
  unit_key: string;
  name: string;
  total_ml: number;
  preparation: string;
  unit: string;
};

/* ───────────────── Page ───────────────── */

export default function DrinkTodayPage() {
  const { user } = useUser();
  const { lang } = useLangContext();

  const [items, setItems] = useState<DrinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !lang) return;

    const userId = user.id;
    const today = getLocalDayKey(new Date());

    async function load() {
      setLoading(true);

      /* ───── 1. logs ophalen ───── */
      const { data: logs } = await supabase
        .from("nutrition_logs")
        .select("product_key, ml, preparation_key, unit_key")
        .eq("user_id", userId)
        .eq("log_date", today) as {
        data: DrinkLog[] | null;
      };

      if (!logs || logs.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const productKeys = [
        ...new Set(logs.map((l: DrinkLog) => l.product_key)),
      ];

      /* ───── 2. filter op drinks ───── */
      const { data: products } = await supabase
        .from("nutrition_products")
        .select("product_key, is_drink")
        .in("product_key", productKeys) as {
        data: Product[] | null;
      };

      const drinkKeys = new Set(
        (products ?? [])
          .filter((p: Product) => p.is_drink)
          .map((p: Product) => p.product_key)
      );

      const drinkLogs = logs.filter((l: DrinkLog) =>
        drinkKeys.has(l.product_key)
      );

      if (drinkLogs.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      /* ───── 3. vertalingen ───── */
      const [
        { data: productTranslations },
        { data: prepTranslations },
        { data: unitTranslations },
      ] = await Promise.all([
        supabase
          .from("nutrition_product_translations")
          .select("product_key, name")
          .in("product_key", productKeys)
          .eq("lang", lang),

        supabase
          .from("nutrition_preparation_translations")
          .select("preparation_key, name")
          .eq("lang", lang),

        supabase
          .from("nutrition_unit_translations")
          .select("unit_key, name")
          .eq("lang", lang),
      ]);

      const nameMap = new Map<string, string>(
        (productTranslations ?? []).map((t: Translation) => [
          t.product_key as string,
          t.name,
        ])
      );

      const prepMap = new Map<string, string>(
        (prepTranslations ?? []).map((p: Translation) => [
          p.preparation_key as string,
          p.name,
        ])
      );

      const unitMap = new Map<string, string>(
        (unitTranslations ?? []).map((u: Translation) => [
          u.unit_key as string,
          u.name,
        ])
      );

      /* ───── 4. groeperen ───── */
      const grouped = new Map<
        string,
        { total_ml: number }
      >();

      drinkLogs.forEach((log: DrinkLog) => {
        const key = `${log.product_key}_${log.preparation_key}_${log.unit_key}`;

        const current = grouped.get(key);

        if (!current) {
          grouped.set(key, { total_ml: log.ml ?? 0 });
        } else {
          current.total_ml += log.ml ?? 0;
        }
      });

      /* ───── 5. mappen ───── */
      const result: DrinkItem[] = Array.from(grouped.entries()).map(
        ([key, value]) => {
          const [product_key, preparation_key, unit_key] = key.split("_");

          return {
            product_key,
            preparation_key,
            unit_key,
            name: nameMap.get(product_key) ?? product_key,
            total_ml: value.total_ml,
            preparation: prepMap.get(preparation_key) ?? "",
            unit: unitMap.get(unit_key) ?? "",
          };
        }
      );

      result.sort((a, b) => b.total_ml - a.total_ml);

      setItems(result);
      setLoading(false);
    }

    load();
  }, [user?.id, lang]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-6">

        <Card
          header={
            <CardHeader
              icon="/water_drop.svg"
              title="Vandaag gedronken"
            />
          }
        >
          {loading ? (
            <div className="text-sm text-gray-500">
              Laden…
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-500">
              Nog niets gedronken vandaag
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {items.map((item: DrinkItem) => (
                <div
                  key={`${item.product_key}-${item.preparation_key}-${item.unit_key}`}
                  className="
                    flex items-center justify-between
                    rounded-[var(--radius)]
                    border border-gray-200
                    px-3 py-2
                    hover:bg-gray-50
                    transition
                  "
                >
                  {/* LEFT */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#191970]">
                      {item.name}
                    </span>

                    {(item.preparation || item.unit) && (
                      <span className="text-xs text-gray-500">
                        {[item.preparation, item.unit]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="text-sm font-medium text-[#191970]">
                    {item.total_ml} ml
                  </div>
                </div>
              ))}

            </div>
          )}
        </Card>

      </div>
    </div>
  );
}