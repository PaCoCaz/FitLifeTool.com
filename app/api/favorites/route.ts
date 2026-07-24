// app/api/favorites/route.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import {
  addFavorite,
  favoriteDetailResponse,
  favoriteResponse,
  FavoriteLimitError,
  listFavoriteDetails,
  removeFavorite,
} from "@/lib/favorites/favoritesServer";
import { parseFavoriteType } from "@/lib/favorites/favoriteRules";

async function getRequestUser() {
  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
    error,
  } = await supabaseUser.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

function badRequest(message: string) {
  return Response.json(
    {
      error: message,
    },
    {
      status: 400,
    }
  );
}

function serverError(error: unknown) {
  console.error("Favorites API error:", error);

  return Response.json(
    {
      error: "Could not update favorites",
    },
    {
      status: 500,
    }
  );
}

function parseLang(value: string | null) {
  if (
    value === "en" ||
    value === "nl" ||
    value === "fr" ||
    value === "de" ||
    value === "pl"
  ) {
    return value;
  }

  return "en";
}

export async function GET(req: Request) {
  const user = await getRequestUser();

  if (!user) {
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
  const lang = parseLang(
    url.searchParams.get("lang")
  );
  const goal =
    url.searchParams.get("goal");

  if (!type) {
    return badRequest("Invalid favorite type");
  }

  try {
    const supabase = createSupabaseServer();
    const result = await listFavoriteDetails(
      supabase,
      user.id,
      type,
      lang,
      goal
    );

    return Response.json({
      limit: result.limit,
      favorites: result.favorites.map(
        favoriteDetailResponse
      ),
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: Request) {
  const user = await getRequestUser();

  if (!user) {
    return Response.json(
      {
        error: "No user",
      },
      {
        status: 401,
      }
    );
  }

  const body = await req.json() as {
    type?: string;
    productKey?: string;
  };

  const type = parseFavoriteType(body.type);
  const productKey = body.productKey;

  if (!type || !productKey) {
    return badRequest("Invalid favorite request");
  }

  try {
    const supabase = createSupabaseServer();
    const result = await addFavorite(
      supabase,
      user.id,
      type,
      productKey
    );

    return Response.json({
      limit: result.limit,
      favorites: result.favorites.map(
        favoriteResponse
      ),
    });
  } catch (error) {
    if (error instanceof FavoriteLimitError) {
      return Response.json(
        {
          error: error.code,
          code: error.code,
        },
        {
          status: 409,
        }
      );
    }

    return serverError(error);
  }
}

export async function DELETE(req: Request) {
  const user = await getRequestUser();

  if (!user) {
    return Response.json(
      {
        error: "No user",
      },
      {
        status: 401,
      }
    );
  }

  const body = await req.json() as {
    type?: string;
    productKey?: string;
  };

  const type = parseFavoriteType(body.type);
  const productKey = body.productKey;

  if (!type || !productKey) {
    return badRequest("Invalid favorite request");
  }

  try {
    const supabase = createSupabaseServer();
    const result = await removeFavorite(
      supabase,
      user.id,
      type,
      productKey
    );

    return Response.json({
      limit: result.limit,
      favorites: result.favorites.map(
        favoriteResponse
      ),
    });
  } catch (error) {
    return serverError(error);
  }
}
