// app/lib/search/productSearchFilters.ts

import type { Grade } from "@/components/ui/GradeBadge";

export type SearchFilterProduct = {
  product_key: string;
  name: string;
  grade?: Grade | null;
  category_key?: string | null;
};

export type SearchFilters = {
  grades: Grade[];
  categories: string[];
  enabled: boolean;
};

const SEARCH_RESULT_LIMIT = 20;

export function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function getSearchRank(
  productName: string,
  searchValue: string
) {
  const name = normalizeSearchValue(productName);
  const query = normalizeSearchValue(searchValue);

  if (name === query) {
    return 0;
  }

  if (name.startsWith(query)) {
    return 1;
  }

  return 2;
}

export function applyProductSearchFilters<T extends SearchFilterProduct>(
  products: T[],
  filters: SearchFilters
) {
  if (!filters.enabled) {
    return products;
  }

  return products.filter((product) => {
    if (
      filters.grades.length > 0 &&
      (!product.grade ||
        !filters.grades.includes(product.grade))
    ) {
      return false;
    }

    if (
      filters.categories.length > 0 &&
      (!product.category_key ||
        !filters.categories.includes(product.category_key))
    ) {
      return false;
    }

    return true;
  });
}

export function rankAndLimitProductSearchResults<T extends SearchFilterProduct>(
  products: T[],
  search: string,
  locale: string
) {
  return [...products]
    .sort((a, b) => {
      const rankDiff =
        getSearchRank(a.name, search) -
        getSearchRank(b.name, search);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return a.name.localeCompare(b.name, locale, {
        sensitivity: "base",
      });
    })
    .slice(0, SEARCH_RESULT_LIMIT);
}
