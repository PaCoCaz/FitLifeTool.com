import { getCountryOptions } from "@/lib/countries/countryReference";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function GET(request: Request) {
  const language = new URL(request.url).searchParams.get("lang");

  try {
    const countries = await getCountryOptions(createSupabaseServer(), language);

    return Response.json({ countries }, {
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("Country reference API error:", error);
    return Response.json({ error: "Could not load countries" }, { status: 500 });
  }
}
