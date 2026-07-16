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
