// app/(app)/dashboard/food/search/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";
import { useLangContext } from "@/lib/LangProvider";

/* ───────────────── Types ───────────────── */

type Product = {
  product_key: string;
  name: string;
  is_drink: boolean;
};

type FavoriteKeyRow = {
  product_key: string;
};

type ProductRow = {
  product_key: string;
  is_drink: boolean;
};

type TranslationRow = {
  product_key: string;
  name: string;
};

/* ───────────────── Component ───────────────── */

export default function FoodSearchPage() {
  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLangContext();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const [drinkFavorites, setDrinkFavorites] = useState<Product[]>([]);
  const [foodFavorites, setFoodFavorites] = useState<Product[]>([]);

  /* ───────────────── LOAD FAVORITES ───────────────── */

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    async function loadFavorites() {
      const { data: favorites } = await supabase
        .from("nutrition_favorites")
        .select("product_key")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true });

      const typedFavorites = (favorites ?? []) as FavoriteKeyRow[];

      if (typedFavorites.length === 0) {
        setDrinkFavorites([]);
        setFoodFavorites([]);
        return;
      }

      const productKeys = typedFavorites.map(
        (f: FavoriteKeyRow) => f.product_key
      );

      const { data: products } = await supabase
        .from("nutrition_products")
        .select("product_key, is_drink")
        .in("product_key", productKeys);

      const typedProducts = (products ?? []) as ProductRow[];

      const { data: translations } = await supabase
        .from("nutrition_product_translations")
        .select("product_key, name")
        .in("product_key", productKeys)
        .eq("lang", lang);

      const typedTranslations =
        (translations ?? []) as TranslationRow[];

      const nameMap = new Map<string, string>(
        typedTranslations.map(
          (t: TranslationRow) => [t.product_key, t.name]
        )
      );

      const mapped: Product[] = typedProducts.map(
        (p: ProductRow) => ({
          product_key: p.product_key,
          name: nameMap.get(p.product_key) ?? p.product_key,
          is_drink: Boolean(p.is_drink),
        })
      );

      setDrinkFavorites(mapped.filter((p) => p.is_drink));
      setFoodFavorites(mapped.filter((p) => !p.is_drink));
    }

    loadFavorites();
  }, [user?.id, lang]);

  /* ───────────────── SEARCH ───────────────── */

  useEffect(() => {
    if (!lang) return;

    if (search.length < 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {

      const { data } = await supabase
        .from("nutrition_products_search")
        .select("product_key, name, is_drink")
        .eq("lang", lang)
        .ilike("name", `%${search}%`);

      if (!data || data.length === 0) {
        setResults([]);
        return;
      }

      const sorted = data.sort((a: any, b: any) => {

        const aStarts = a.name
          .toLowerCase()
          .startsWith(search.toLowerCase());

        const bStarts = b.name
          .toLowerCase()
          .startsWith(search.toLowerCase());

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.name.localeCompare(b.name, lang, {
          sensitivity: "base",
        });

      });

      const mapped: Product[] = sorted.map((p: any) => ({
        product_key: p.product_key,
        name: p.name,
        is_drink: Boolean(p.is_drink),
      }));

      setResults(mapped);

    }, 300);

    return () => clearTimeout(timeout);

  }, [search, lang]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="bg-white rounded-[var(--radius)] shadow-sm border">

          <div className="px-6 py-4 border-b">
            <h1 className="text-lg font-semibold">
              Voeding toevoegen
            </h1>
          </div>

          <div className="px-6 py-6 space-y-10">

            {drinkFavorites.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-4">
                  Drinken
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {drinkFavorites.map((product) => (
                    <button
                      key={product.product_key}
                      onClick={() =>
                        router.push(
                          `/dashboard/food/add/${product.product_key}`
                        )
                      }
                      className="group flex items-center justify-center rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {foodFavorites.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-4">
                  Eten
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {foodFavorites.map((product) => (
                    <button
                      key={product.product_key}
                      onClick={() =>
                        router.push(
                          `/dashboard/food/add/${product.product_key}`
                        )
                      }
                      className="group flex items-center justify-center rounded-[var(--radius)] border px-3 py-2 text-xs font-medium transition border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek product..."
                className="w-full border border-[#0095D3] rounded-t-[var(--radius)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0095D3]/30"
              />

              {results.length > 0 && (
                <div className="border border-t-0 border-[#0095D3] rounded-b-[var(--radius)] max-h-[400px] overflow-y-auto">
                  {results.map((product) => (
                    <div
                      key={product.product_key}
                      className="flex items-center justify-between px-4 py-3 text-sm border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <span
                        onClick={() =>
                          router.push(
                            `/dashboard/food/add/${product.product_key}`
                          )
                        }
                      >
                        {product.name}
                      </span>

                      <button className="text-gray-400 hover:text-[#0095D3] text-lg">
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}