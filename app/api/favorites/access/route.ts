// app/api/favorites/access/route.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import {
  favoriteResponse,
  getFavoriteAccess,
} from "@/lib/favorites/favoritesServer";
import { parseFavoriteType } from "@/lib/favorites/favoriteRules";

export async function GET(req: Request) {
  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
    error,
  } = await supabaseUser.auth.getUser();

  if (error || !user) {
    return Response.json(
      {
        error: "No user",
      },
      {
        status: 401,
      }
    );
  }

  const url = new URL(req.url);
  const type = parseFavoriteType(
    url.searchParams.get("type")
  );
  const productKey =
    url.searchParams.get("productKey");

  if (!type || !productKey) {
    return Response.json(
      {
        error: "Invalid favorite access request",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const supabase = createSupabaseServer();
    const access = await getFavoriteAccess(
      supabase,
      user.id,
      type,
      productKey
    );

    return Response.json({
      limit: access.limit,
      isFavorite: access.isFavorite,
      locked: access.locked,
      canUse: access.canUse,
      favorite: access.favorite
        ? favoriteResponse(access.favorite)
        : null,
    });
  } catch (accessError) {
    console.error(
      "Favorite access API error:",
      accessError
    );

    return Response.json(
      {
        error: "Could not load favorite access",
      },
      {
        status: 500,
      }
    );
  }
}
