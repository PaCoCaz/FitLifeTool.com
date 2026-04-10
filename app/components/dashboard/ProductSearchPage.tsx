// app/components/dashboard/ProductSearchPage.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";
import { useLangContext } from "@/lib/LangProvider";
import { useDashboard } from "@/lib/DashboardStore";
import FavoritesCard from "@/components/dashboard/FavoritesCard";
import SearchCard from "@/components/dashboard/SearchCard";

/* ───────────────── Types ───────────────── */

type Product = {
  product_key: string;
  name: string;
  is_drink: boolean;
  is_basic: boolean;
};

type Props = {
  type: "food" | "drink";
};

/* ───────────────── Component ───────────────── */

export default function ProductSearchPage({ type }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLangContext();
  const { features, limits } = useDashboard();

  const isDrink = type === "drink";

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  /* ───────────────── LOAD FAVORITES ───────────────── */

  async function loadFavorites() {
    if (!user?.id) return;

    const { data: favoritesRaw } = await supabase
      .from("nutrition_favorites")
      .select("product_key")
      .eq("user_id", user.id);

    if (!favoritesRaw || favoritesRaw.length === 0) {
      setFavorites([]);
      return;
    }

    const productKeys = favoritesRaw.map((f: any) => f.product_key);

    const { data: products } = await supabase
      .from("nutrition_products")
      .select("product_key, is_drink")
      .in("product_key", productKeys);

    const { data: translations } = await supabase
      .from("nutrition_product_translations")
      .select("product_key, name")
      .in("product_key", productKeys)
      .eq("lang", lang);

    const nameMap = new Map(
      (translations ?? []).map((t: any) => [t.product_key, t.name])
    );

    const mapped: Product[] = (products ?? []).map((p: any) => ({
      product_key: p.product_key,
      name: nameMap.get(p.product_key) ?? p.product_key,
      is_drink: Boolean(p.is_drink),
      is_basic: true,
    }));

    // 🔥 filter op type
    setFavorites(mapped.filter((p) => p.is_drink === isDrink));
  }

  useEffect(() => {
    loadFavorites();
  }, [user?.id, lang]);

  /* ───────────────── TOGGLE FAVORITE ───────────────── */

  async function toggleFavorite(productKey: string) {
    if (!user) return;

    const { data: existing } = await supabase
      .from("nutrition_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_key", productKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("nutrition_favorites")
        .delete()
        .eq("id", existing.id);
    } else {
      const limit = isDrink
        ? limits.max_favorite_drinks
        : limits.max_favorite_foods;

      if (limit !== null && favorites.length >= limit) {
        alert(`Je hebt je limiet van ${limit} favorieten bereikt`);
        return;
      }

      await supabase.from("nutrition_favorites").insert({
        user_id: user.id,
        product_key: productKey,
      });
    }

    await loadFavorites();
  }

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
        .select("product_key, name, is_drink, is_basic")
        .eq("lang", lang)
        .eq("is_drink", isDrink)
        .ilike("name", `%${search}%`);

      if (!data) {
        setResults([]);
        return;
      }

      const sorted = data.sort((a: any, b: any) => {
        const aStarts = a.name.toLowerCase().startsWith(search.toLowerCase());
        const bStarts = b.name.toLowerCase().startsWith(search.toLowerCase());

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.name.localeCompare(b.name, lang, {
          sensitivity: "base",
        });
      });

      setResults(sorted);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, lang, isDrink]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-6">

        <FavoritesCard
          title="Favorieten"
          items={favorites}
          onSelect={(key) =>
            router.push(`/dashboard/${type}/add/${key}`)
          }
          onToggleFavorite={toggleFavorite}
        />

        <SearchCard
          title="Zoeken"
          search={search}
          setSearch={setSearch}
          results={results}
          features={features}
          favorites={favorites}
          onSelect={(key) =>
            router.push(`/dashboard/${type}/add/${key}`)
          }
          onToggleFavorite={toggleFavorite}
        />

      </div>
    </div>
  );
}