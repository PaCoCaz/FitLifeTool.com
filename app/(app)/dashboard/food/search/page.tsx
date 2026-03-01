//  app/(app)/dashboard/food/search/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Product = {
  product_key: string;
  name: string;
};

export default function FoodSearchPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);

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
          p_lang: "nl",
          p_goal: "maintain",
          p_limit: 20,
        }
      );

      setResults((data ?? []) as Product[]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

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
          className="w-full border rounded px-4 py-3"
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
            className="w-full text-left px-4 py-3 border rounded hover:bg-gray-100"
          >
            {product.name}
          </button>
        ))}
      </div>

    </div>
  );
}