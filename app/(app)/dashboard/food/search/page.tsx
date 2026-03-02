// app/(app)/dashboard/food/search/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";

/* ───────────────── Types ───────────────── */

type Product = {
  product_key: string;
  name: string;
};

type ProfileRow = {
  language: string;
};

/* ───────────────── Component ───────────────── */

export default function FoodSearchPage() {
  const router = useRouter();
  const { user } = useUser();

  const [language, setLanguage] = useState<string>("nl");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  /* ───────────────── LOAD LANGUAGE ───────────────── */

  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    async function loadLanguage() {
      const { data } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", userId)
        .single<ProfileRow>();

      if (data?.language) {
        setLanguage(data.language);
      }
    }

    loadLanguage();
  }, [user]);

  /* ───────────────── SEARCH ───────────────── */

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const { data } = await supabase.rpc(
        "search_nutrition_products",
        {
          p_search: search,
          p_lang: language,
          p_goal: "maintain", // later dynamisch uit profile
          p_limit: 20,
        }
      );

      setResults((data ?? []) as Product[]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, language]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">
          Product zoeken
        </h1>
      </div>

      <div className="p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek product..."
          className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0095D3]"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-2">
        {results.map((product) => (
          <button
            key={product.product_key}
            onClick={() =>
              router.push(
                `/dashboard/food/add/${product.product_key}`
              )
            }
            className="w-full text-left px-4 py-3 border rounded hover:bg-gray-100 transition"
          >
            {product.name}
          </button>
        ))}
      </div>

    </div>
  );
}