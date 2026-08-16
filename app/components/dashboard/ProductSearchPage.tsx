// app/components/dashboard/ProductSearchPage.tsx

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthProvider";
import { useLangContext } from "@/lib/LangProvider";
import { useDashboard } from "@/lib/DashboardStore";
import { useGoalContext } from "@/lib/GoalProvider";
import FavoritesCard, {
  FavoritesCardSkeleton,
} from "@/components/dashboard/FavoritesCard";
import SearchCard from "@/components/dashboard/SearchCard";
import type { Grade } from "@/components/ui/GradeBadge";
import {
  applyProductSearchFilters,
  rankAndLimitProductSearchResults,
} from "@/lib/search/productSearchFilters";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

/* ───────────────── Types ───────────────── */

type Product = {
  product_key: string;
  name: string;
  is_drink: boolean;
  is_basic: boolean;
  grade?: Grade | null;
  category_key?: string | null;
  created_at?: string;
  position?: number;
  locked?: boolean;
};

type FavoriteApiItem = {
  product_key: string;
  display_name: string;
  group_display_key: string | null;
  is_basic: boolean;
  grade: Grade | null;
  created_at: string;
  position: number;
  locked: boolean;
};

type FavoritesApiResponse = {
  limit: number | null;
  favorites: FavoriteApiItem[];
};

type ProductLookupRow = {
  product_key: string;
  is_drink: boolean;
  is_basic?: boolean | null;
  group_display_key?: string | null;
};

type ProductSearchRow = Product & {
  is_exact_search_match?: boolean;
};

type ProductPreparationRow = {
  product_key: string;
  preparation_key: string;
  nutrition_preparations?: {
    sort_order: number | null;
  } | null;
};

type ProductScoreRow = {
  product_key: string;
  preparation_key: string;
  score_grade: string | null;
};

type CategoryOption = {
  key: string;
  label: string;
};

type ProductSearchApiResponse = {
  results: ProductSearchRow[];
};

type ProductCategoriesApiResponse = {
  categories: CategoryOption[];
};

type Props = {
  type: "food" | "drink";
};

function isSupportedGoal(
  value: string | null
): value is "LOSE" | "MAINTAIN" | "GAIN" {
  return (
    value === "LOSE" ||
    value === "MAINTAIN" ||
    value === "GAIN"
  );
}

function isGrade(
  value: string | null | undefined
): value is Grade {
  return (
    value === "A" ||
    value === "B" ||
    value === "C" ||
    value === "D" ||
    value === "E"
  );
}

/* ───────────────── Component ───────────────── */

export default function ProductSearchPage({ type }: Props) {
  const langCode = useLang();
  const t = uiText[langCode];

  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const {
    lang,
    isLoading: langLoading,
  } = useLangContext();
  const { features, limits } = useDashboard();
  const {
    goal,
    isLoading: goalLoading,
  } = useGoalContext();

  const isDrink = type === "drink";
  const hasAdvancedSearchFilters =
    features.has_advanced_search_filters;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoriteLimit, setFavoriteLimit] =
    useState<number | null>(null);
  const [
    hasCompletedInitialFavoritesLoad,
    setHasCompletedInitialFavoritesLoad,
  ] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] =
    useState(false);
  const [selectedGrades, setSelectedGrades] =
    useState<Grade[]>([]);
  const [
    selectedCategoryKeys,
    setSelectedCategoryKeys,
  ] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] =
    useState<CategoryOption[]>([]);
  const favoritesRequestSequenceRef = useRef(0);
  const categoryRequestSequenceRef = useRef(0);
  const searchRequestSequenceRef = useRef(0);

  const activeFilterCount = hasAdvancedSearchFilters
    ? selectedGrades.length + selectedCategoryKeys.length
    : 0;

  const loadGradeMap = useCallback(
    async (productKeys: string[]) => {
      const gradeMap = new Map<string, Grade>();

      if (
        productKeys.length === 0 ||
        !isSupportedGoal(goal)
      ) {
        return gradeMap;
      }

      const { data: preparations } = await supabase
        .from("nutrition_product_preparations")
        .select(`
          product_key,
          preparation_key,
          nutrition_preparations (
            sort_order
          )
        `)
        .in("product_key", productKeys);

      const preparationRows =
        ((preparations ?? []) as ProductPreparationRow[])
          .sort((a, b) => {
            const orderDiff =
              (a.nutrition_preparations?.sort_order ?? 999) -
              (b.nutrition_preparations?.sort_order ?? 999);

            if (orderDiff !== 0) {
              return orderDiff;
            }

            return a.preparation_key.localeCompare(
              b.preparation_key
            );
          });

      const firstPreparationByProduct = new Map<
        string,
        string
      >();

      for (const row of preparationRows) {
        if (!firstPreparationByProduct.has(row.product_key)) {
          firstPreparationByProduct.set(
            row.product_key,
            row.preparation_key
          );
        }
      }

      const { data: scores } = await supabase
        .from("nutrition_product_scores")
        .select("product_key, preparation_key, score_grade")
        .in("product_key", productKeys)
        .eq("goal_key", goal);

      for (const score of (scores ?? []) as ProductScoreRow[]) {
        const firstPreparation =
          firstPreparationByProduct.get(score.product_key);

        if (
          firstPreparation === score.preparation_key &&
          isGrade(score.score_grade)
        ) {
          gradeMap.set(
            score.product_key,
            score.score_grade
          );
        }
      }

      return gradeMap;
    },
    [goal]
  );

  useEffect(() => {
    if (authLoading || !user?.id || !lang) return;

    const controller = new AbortController();
    const requestSequence =
      ++categoryRequestSequenceRef.current;

    async function loadCategories() {
      const params = new URLSearchParams({
        type,
        lang,
        mode: "categories",
      });

      try {
        const response = await fetch(
          `/api/nutrition/products/search?${params.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Nutrition categories request failed: ${response.status}`
          );
        }

        const payload =
          (await response.json()) as ProductCategoriesApiResponse;

        if (
          controller.signal.aborted ||
          requestSequence !== categoryRequestSequenceRef.current
        ) {
          return;
        }

        const categoryKeys = payload.categories.map(
          ({ key }) => key
        );

        setCategoryOptions(payload.categories);
        setSelectedCategoryKeys((current) =>
          current.filter((key) => categoryKeys.includes(key))
        );
      } catch (error) {
        if (
          controller.signal.aborted ||
          (
            error instanceof Error &&
            error.name === "AbortError"
          )
        ) {
          return;
        }

        if (requestSequence === categoryRequestSequenceRef.current) {
          setCategoryOptions([]);
          setSelectedCategoryKeys([]);
        }

        console.error("Nutrition categories load failed:", error);
      }
    }

    void loadCategories();

    return () => {
      controller.abort();
      categoryRequestSequenceRef.current += 1;
    };
  }, [authLoading, user?.id, lang, type]);

  const toggleGrade = useCallback(
    (grade: Grade) => {
      if (!hasAdvancedSearchFilters) return;

      setSelectedGrades((current) =>
        current.includes(grade)
          ? current.filter((item) => item !== grade)
          : [...current, grade]
      );
    },
    [hasAdvancedSearchFilters]
  );

  const toggleCategory = useCallback(
    (categoryKey: string) => {
      if (!hasAdvancedSearchFilters) return;

      setSelectedCategoryKeys((current) =>
        current.includes(categoryKey)
          ? current.filter((item) => item !== categoryKey)
          : [...current, categoryKey]
      );
    },
    [hasAdvancedSearchFilters]
  );

  const resetFilters = useCallback(() => {
    setSelectedGrades([]);
    setSelectedCategoryKeys([]);
  }, []);

  /* ───────────────── LOAD FAVORITES ───────────────── */

  const loadFavorites = useCallback(
    async (signal?: AbortSignal) => {
      if (
        authLoading ||
        langLoading ||
        goalLoading ||
        !user?.id
      ) {
        return;
      }

      const requestSequence =
        ++favoritesRequestSequenceRef.current;

      const params = new URLSearchParams({
        type,
        lang,
      });

      if (goal) {
        params.set("goal", goal);
      }

      try {
        const res = await fetch(
          `/api/favorites?${params.toString()}`,
          {
            cache: "no-store",
            signal,
          }
        );

        if (!res.ok) {
          throw new Error(
            `Favorites request failed: ${res.status}`
          );
        }

        const payload =
          (await res.json()) as FavoritesApiResponse;

        if (
          signal?.aborted ||
          requestSequence !==
            favoritesRequestSequenceRef.current
        ) {
          return;
        }

        setFavoriteLimit(payload.limit);
        setFavorites(
          payload.favorites.map((favorite) => ({
            product_key: favorite.product_key,
            name: favorite.display_name,
            is_drink: isDrink,
            is_basic: favorite.is_basic,
            grade: favorite.grade,
            category_key: favorite.group_display_key,
            created_at: favorite.created_at,
            position: favorite.position,
            locked: favorite.locked,
          }))
        );
        setHasCompletedInitialFavoritesLoad(true);
      } catch (error) {
        if (
          signal?.aborted ||
          (
            error instanceof Error &&
            error.name === "AbortError"
          )
        ) {
          return;
        }

        if (
          requestSequence ===
          favoritesRequestSequenceRef.current
        ) {
          setHasCompletedInitialFavoritesLoad(true);
        }

        throw error;
      }
    },
    [
      authLoading,
      langLoading,
      goalLoading,
      user?.id,
      type,
      lang,
      goal,
      isDrink,
    ]
  );

  useEffect(() => {
    if (
      authLoading ||
      langLoading ||
      goalLoading ||
      !user?.id
    ) {
      return;
    }

    const controller = new AbortController();
    const startRequest = window.setTimeout(() => {
      void loadFavorites(controller.signal).catch((error) => {
        console.error("Favorites load failed:", error);
      });
    }, 0);

    return () => {
      window.clearTimeout(startRequest);
      controller.abort();
      favoritesRequestSequenceRef.current += 1;
    };
  }, [
    authLoading,
    langLoading,
    goalLoading,
    user?.id,
    loadFavorites,
  ]);

  /* ───────────────── TOGGLE FAVORITE ───────────────── */

  async function toggleFavorite(productKey: string) {
    if (!user) return;

    const existing = favorites.find(
      (favorite) => favorite.product_key === productKey
    );

    const method = existing ? "DELETE" : "POST";

    const res = await fetch("/api/favorites", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        productKey,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null) as {
        code?: string;
      } | null;

      if (error?.code === "FAVORITE_LIMIT_REACHED") {
        const limit = isDrink
          ? limits.max_favorite_drinks
          : limits.max_favorite_foods;

        alert(
          t.common.favoriteLimitUpgrade.replace(
            "{{limit}}",
            String(limit ?? "")
          )
        );
        return;
      }

      throw new Error(
        `Favorite update failed: ${res.status}`
      );
    }

    await loadFavorites();
  }

  /* ───────────────── SEARCH ───────────────── */

  useEffect(() => {
    const requestSequence =
      ++searchRequestSequenceRef.current;

    if (authLoading || !user?.id || !lang) {
      setResults([]);
      return;
    }

    if (search.length < 1) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      const params = new URLSearchParams({
        type,
        lang,
        q: search,
      });

      try {
        const response = await fetch(
          `/api/nutrition/products/search?${params.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Nutrition search request failed: ${response.status}`
          );
        }

        const payload =
          (await response.json()) as ProductSearchApiResponse;
        const resultRows = payload.results;
        const resultKeys = resultRows.map(
          (product) => product.product_key
        );

        if (
          controller.signal.aborted ||
          requestSequence !== searchRequestSequenceRef.current
        ) {
          return;
        }

        if (resultKeys.length === 0) {
          setResults([]);
          return;
        }

        const [{ data: products }, gradeMap] =
          await Promise.all([
            supabase
              .from("nutrition_products")
              .select(
                "product_key, is_drink, is_basic, group_display_key"
              )
              .in("product_key", resultKeys),
            loadGradeMap(resultKeys),
          ]);

        if (
          controller.signal.aborted ||
          requestSequence !== searchRequestSequenceRef.current
        ) {
          return;
        }

        const productMap = new Map(
          ((products ?? []) as ProductLookupRow[]).map(
            (product) => [product.product_key, product]
          )
        );

        const withMetadata = resultRows.map((product) => {
          const productMeta = productMap.get(product.product_key);

          return {
            ...product,
            is_basic:
              productMeta?.is_basic ?? product.is_basic,
            category_key:
              productMeta?.group_display_key ?? null,
            grade:
              gradeMap.get(product.product_key) ?? null,
          };
        });

        const filtered = applyProductSearchFilters(
          withMetadata,
          {
            enabled: hasAdvancedSearchFilters,
            grades: selectedGrades,
            categories: selectedCategoryKeys,
          }
        );

        setResults(
          rankAndLimitProductSearchResults(
            filtered,
            search,
            lang
          )
        );
      } catch (error) {
        if (
          controller.signal.aborted ||
          (
            error instanceof Error &&
            error.name === "AbortError"
          )
        ) {
          return;
        }

        if (requestSequence === searchRequestSequenceRef.current) {
          setResults([]);
        }

        console.error("Nutrition search failed:", error);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
      searchRequestSequenceRef.current += 1;
    };
  }, [
    search,
    lang,
    type,
    authLoading,
    user?.id,
    goal,
    loadGradeMap,
    hasAdvancedSearchFilters,
    selectedGrades,
    selectedCategoryKeys,
  ]);

  /* ───────────────── UI ───────────────── */

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-6">

        {!hasCompletedInitialFavoritesLoad ? (
          <FavoritesCardSkeleton
            title={t.common.favorites}
          />
        ) : favorites.length > 0 ? (
          <FavoritesCard
            title={t.common.favorites}
            items={favorites}
            limit={favoriteLimit}
            lockedMessage={
              favoriteLimit !== null &&
              favorites.length > favoriteLimit
                ? t.common.favoriteActiveNotice
                    .replace(
                      "{{total}}",
                      String(favorites.length)
                    )
                    .replace(
                      "{{limit}}",
                      String(favoriteLimit)
                    )
                : null
            }
            onSelect={(key) =>
              router.push(`/dashboard/${type}/add/${key}`)
            }
            onLockedSelect={() => {
              const limit = favoriteLimit ?? 0;

              alert(
                t.common.favoriteLimitUpgrade.replace(
                  "{{limit}}",
                  String(limit)
                )
              );
            }}
            onToggleFavorite={toggleFavorite}
          />
        ) : null}

        <SearchCard
          title={t.common.search}
          search={search}
          setSearch={setSearch}
          results={results}
          features={features}
          favorites={favorites}
          filtersEnabled={hasAdvancedSearchFilters}
          filterPanelOpen={filterPanelOpen}
          activeFilterCount={activeFilterCount}
          selectedGrades={selectedGrades}
          selectedCategoryKeys={selectedCategoryKeys}
          categoryOptions={categoryOptions}
          hasSearched={search.length > 0}
          onSelect={(key) =>
            router.push(`/dashboard/${type}/add/${key}`)
          }
          onToggleFavorite={toggleFavorite}
          onFilterClick={() => {
            if (!hasAdvancedSearchFilters) {
              alert(t.common.premiumFeature);
              return;
            }

            setFilterPanelOpen((open) => !open);
          }}
          onToggleGrade={toggleGrade}
          onToggleCategory={toggleCategory}
          onResetFilters={resetFilters}
        />

      </div>
    </div>
  );
}
