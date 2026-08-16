import {
  listNutritionDiscoveryCategories,
  loadNutritionProductDiscoveryContext,
  parseNutritionDiscoveryLanguage,
  parseNutritionDiscoveryType,
  searchNutritionProducts,
} from "@/lib/search/nutritionProductDiscovery";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

function badRequest(message: string) {
  return Response.json(
    { error: message },
    { status: 400, headers: NO_STORE_HEADERS }
  );
}

export async function GET(request: Request) {
  const client = await createSupabaseServerUser();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    return Response.json(
      { error: "Unauthenticated" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const url = new URL(request.url);
  const type = parseNutritionDiscoveryType(
    url.searchParams.get("type")
  );
  const lang = parseNutritionDiscoveryLanguage(
    url.searchParams.get("lang")
  );

  if (!type || !lang) {
    return badRequest("Invalid nutrition discovery request");
  }

  try {
    const context = await loadNutritionProductDiscoveryContext(
      client,
      user.id
    );

    if (url.searchParams.get("mode") === "categories") {
      const categories = await listNutritionDiscoveryCategories(
        client,
        context,
        { type, lang }
      );

      return Response.json(
        { categories },
        { headers: NO_STORE_HEADERS }
      );
    }

    const results = await searchNutritionProducts(
      client,
      context,
      {
        type,
        lang,
        query: url.searchParams.get("q") ?? "",
      }
    );

    return Response.json(
      { results },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Nutrition product discovery error:", error);

    return Response.json(
      { error: "Could not load nutrition products" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
