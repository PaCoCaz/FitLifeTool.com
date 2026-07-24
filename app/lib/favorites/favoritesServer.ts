// app/lib/favorites/favoritesServer.ts

import "server-only";

import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  applyFavoriteLimit,
  buildFavoriteDetails,
  isDrinkType,
  type FavoriteDetail,
  type FavoriteProductMetadata,
  type FavoriteProductPreparation,
  type FavoriteProductScore,
  type FavoriteProductTranslation,
  type FavoriteState,
  type FavoriteType,
} from "./favoriteRules";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

type FavoriteDbRow = {
  id: string;
  product_key: string;
  created_at: string;
};

type FavoriteProductRow = FavoriteProductMetadata & {
  is_drink?: boolean | null;
};

type FavoritePreparationRow = {
  product_key: string;
  preparation_key: string;
  nutrition_preparations?: {
    sort_order: number | null;
  } | null;
};

type PlanFeatureResult = {
  limits?: {
    max_favorite_foods?: number | null;
    max_favorite_drinks?: number | null;
  };
};

export class FavoriteLimitError extends Error {
  code = "FAVORITE_LIMIT_REACHED";

  constructor() {
    super("Favorite limit reached");
  }
}

export async function getFavoriteLimit(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType
) {
  const { data, error } = await supabase.rpc(
    "get_user_plan_features",
    {
      p_user_id: userId,
    }
  );

  if (error) {
    throw error;
  }

  const plan = Array.isArray(data)
    ? data[0]
    : data;

  const limits =
    (plan as PlanFeatureResult | null)?.limits ?? {};

  return type === "drink"
    ? limits.max_favorite_drinks ?? null
    : limits.max_favorite_foods ?? null;
}

async function ensureProductType(
  supabase: SupabaseClientLike,
  type: FavoriteType,
  productKey: string
) {
  const { data, error } = await supabase
    .from("nutrition_products")
    .select("product_key, is_drink")
    .eq("product_key", productKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Favorite product not found");
  }

  if (Boolean(data.is_drink) !== isDrinkType(type)) {
    throw new Error("Favorite product type mismatch");
  }
}

async function loadFavoriteRows(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType
) {
  const { data, error } = await supabase
    .from("nutrition_favorites")
    .select(`
      id,
      product_key,
      created_at,
      nutrition_products!inner (
        is_drink
      )
    `)
    .eq("user_id", userId)
    .eq(
      "nutrition_products.is_drink",
      isDrinkType(type)
    )
    .order("created_at", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as FavoriteDbRow[];
}

export async function listFavorites(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType
) {
  const [limit, rows] = await Promise.all([
    getFavoriteLimit(supabase, userId, type),
    loadFavoriteRows(supabase, userId, type),
  ]);

  return {
    limit,
    favorites: applyFavoriteLimit(rows, limit),
  };
}

function isSupportedGoal(
  value: string | null | undefined
): value is "LOSE" | "MAINTAIN" | "GAIN" {
  return (
    value === "LOSE" ||
    value === "MAINTAIN" ||
    value === "GAIN"
  );
}

export async function listFavoriteDetails(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType,
  lang: string,
  goal: string | null
): Promise<{
  limit: number | null;
  favorites: FavoriteDetail[];
}> {
  const { limit, favorites } = await listFavorites(
    supabase,
    userId,
    type
  );

  if (favorites.length === 0) {
    return {
      limit,
      favorites: [],
    };
  }

  const productKeys = favorites.map(
    (favorite) => favorite.product_key
  );

  const [
    productsResult,
    translationsResult,
    preparationsResult,
    scoresResult,
  ] = await Promise.all([
    supabase
      .from("nutrition_products")
      .select("product_key, is_drink, is_basic, group_display_key")
      .in("product_key", productKeys),

    supabase
      .from("nutrition_product_translations")
      .select("product_key, name")
      .in("product_key", productKeys)
      .eq("lang", lang),

    supabase
      .from("nutrition_product_preparations")
      .select(`
        product_key,
        preparation_key,
        nutrition_preparations (
          sort_order
        )
      `)
      .in("product_key", productKeys),

    isSupportedGoal(goal)
      ? supabase
          .from("nutrition_product_scores")
          .select("product_key, preparation_key, score_grade")
          .in("product_key", productKeys)
          .eq("goal_key", goal)
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);

  if (productsResult.error) {
    throw productsResult.error;
  }

  if (translationsResult.error) {
    throw translationsResult.error;
  }

  if (preparationsResult.error) {
    throw preparationsResult.error;
  }

  if (scoresResult.error) {
    throw scoresResult.error;
  }

  const products =
    ((productsResult.data ?? []) as FavoriteProductRow[])
      .filter(
        (product) =>
          Boolean(product.is_drink) === isDrinkType(type)
      );

  const preparations =
    ((preparationsResult.data ?? []) as FavoritePreparationRow[])
      .map((preparation) => ({
        product_key: preparation.product_key,
        preparation_key: preparation.preparation_key,
        sort_order:
          preparation.nutrition_preparations?.sort_order ??
          null,
      })) satisfies FavoriteProductPreparation[];

  return {
    limit,
    favorites: buildFavoriteDetails(
      favorites,
      products,
      (translationsResult.data ??
        []) as FavoriteProductTranslation[],
      preparations,
      (scoresResult.data ?? []) as FavoriteProductScore[]
    ),
  };
}

export async function getFavoriteAccess(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType,
  productKey: string
) {
  const { limit, favorites } = await listFavorites(
    supabase,
    userId,
    type
  );

  const favorite =
    favorites.find(
      (item) => item.product_key === productKey
    ) ?? null;

  return {
    limit,
    isFavorite: Boolean(favorite),
    favorite,
    locked: favorite?.locked ?? false,
    canUse: !favorite?.locked,
  };
}

export async function addFavorite(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType,
  productKey: string
) {
  await ensureProductType(
    supabase,
    type,
    productKey
  );

  const before = await listFavorites(
    supabase,
    userId,
    type
  );

  const existing = before.favorites.find(
    (favorite) => favorite.product_key === productKey
  );

  if (existing) {
    return before;
  }

  if (
    before.limit !== null &&
    before.favorites.length >= before.limit
  ) {
    throw new FavoriteLimitError();
  }

  const { error } = await supabase
    .from("nutrition_favorites")
    .insert({
      user_id: userId,
      product_key: productKey,
    });

  if (error && error.code !== "23505") {
    throw error;
  }

  const after = await listFavorites(
    supabase,
    userId,
    type
  );

  const inserted = after.favorites.find(
    (favorite) => favorite.product_key === productKey
  );

  if (inserted?.locked) {
    await removeFavorite(
      supabase,
      userId,
      type,
      productKey
    );

    throw new FavoriteLimitError();
  }

  return after;
}

export async function removeFavorite(
  supabase: SupabaseClientLike,
  userId: string,
  type: FavoriteType,
  productKey: string
) {
  await ensureProductType(
    supabase,
    type,
    productKey
  );

  const { error } = await supabase
    .from("nutrition_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_key", productKey);

  if (error) {
    throw error;
  }

  return listFavorites(supabase, userId, type);
}

export function favoriteResponse(
  favorite: FavoriteState
) {
  return {
    product_key: favorite.product_key,
    created_at: favorite.created_at,
    position: favorite.position,
    locked: favorite.locked,
  };
}

export function favoriteDetailResponse(
  favorite: FavoriteDetail
) {
  return {
    product_key: favorite.product_key,
    display_name: favorite.display_name,
    group_display_key: favorite.group_display_key,
    is_basic: favorite.is_basic,
    locked: favorite.locked,
    grade: favorite.grade,
    created_at: favorite.created_at,
    position: favorite.position,
  };
}
