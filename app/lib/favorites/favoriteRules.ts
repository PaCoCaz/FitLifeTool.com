// app/lib/favorites/favoriteRules.ts

export type FavoriteType = "food" | "drink";

export type FavoriteRow = {
  id: string;
  product_key: string;
  created_at: string;
};

export type FavoriteState = FavoriteRow & {
  position: number;
  locked: boolean;
};

export type FavoriteGrade =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E";

export type FavoriteProductMetadata = {
  product_key: string;
  is_basic?: boolean | null;
  group_display_key?: string | null;
};

export type FavoriteProductTranslation = {
  product_key: string;
  name: string;
};

export type FavoriteProductPreparation = {
  product_key: string;
  preparation_key: string;
  sort_order?: number | null;
};

export type FavoriteProductScore = {
  product_key: string;
  preparation_key: string;
  score_grade?: string | null;
};

export type FavoriteDetail = FavoriteState & {
  display_name: string;
  group_display_key: string | null;
  is_basic: boolean;
  grade: FavoriteGrade | null;
};

export function parseFavoriteType(
  value: string | null | undefined
): FavoriteType | null {
  if (value === "food" || value === "drink") {
    return value;
  }

  return null;
}

export function isDrinkType(type: FavoriteType) {
  return type === "drink";
}

export function sortFavoriteRows(
  rows: FavoriteRow[]
) {
  return [...rows].sort((a, b) => {
    const byCreatedAt =
      a.created_at.localeCompare(b.created_at);

    if (byCreatedAt !== 0) {
      return byCreatedAt;
    }

    return a.id.localeCompare(b.id);
  });
}

export function applyFavoriteLimit(
  rows: FavoriteRow[],
  limit: number | null
): FavoriteState[] {
  return sortFavoriteRows(rows).map((row, index) => ({
    ...row,
    position: index + 1,
    locked:
      limit === null
        ? false
        : index >= limit,
  }));
}

function isFavoriteGrade(
  value: string | null | undefined
): value is FavoriteGrade {
  return (
    value === "A" ||
    value === "B" ||
    value === "C" ||
    value === "D" ||
    value === "E"
  );
}

function firstPreparationByProduct(
  preparations: FavoriteProductPreparation[]
) {
  const map = new Map<string, string>();

  const sorted = [...preparations].sort((a, b) => {
    const orderDiff =
      (a.sort_order ?? 999) - (b.sort_order ?? 999);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return a.preparation_key.localeCompare(
      b.preparation_key
    );
  });

  for (const preparation of sorted) {
    if (!map.has(preparation.product_key)) {
      map.set(
        preparation.product_key,
        preparation.preparation_key
      );
    }
  }

  return map;
}

export function buildFavoriteDetails(
  favorites: FavoriteState[],
  products: FavoriteProductMetadata[],
  translations: FavoriteProductTranslation[],
  preparations: FavoriteProductPreparation[],
  scores: FavoriteProductScore[]
): FavoriteDetail[] {
  const productMap = new Map(
    products.map((product) => [
      product.product_key,
      product,
    ])
  );

  const nameMap = new Map(
    translations.map((translation) => [
      translation.product_key,
      translation.name,
    ])
  );

  const firstPreparationMap =
    firstPreparationByProduct(preparations);

  const gradeMap = new Map<string, FavoriteGrade>();

  for (const score of scores) {
    const firstPreparation = firstPreparationMap.get(
      score.product_key
    );

    if (
      firstPreparation === score.preparation_key &&
      isFavoriteGrade(score.score_grade)
    ) {
      gradeMap.set(
        score.product_key,
        score.score_grade
      );
    }
  }

  return favorites.flatMap((favorite) => {
    const product = productMap.get(favorite.product_key);

    if (!product) {
      return [];
    }

    return [
      {
        ...favorite,
        display_name:
          nameMap.get(favorite.product_key) ??
          favorite.product_key,
        group_display_key:
          product.group_display_key ?? null,
        is_basic: Boolean(product.is_basic),
        grade:
          gradeMap.get(favorite.product_key) ?? null,
      },
    ];
  });
}
