import { getSupportedRegionalMarketCodes } from "@/lib/markets/nutritionMarketSupport";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";

export async function GET() {
  try {
    const marketCodes = await getSupportedRegionalMarketCodes(createSupabaseServer());

    return Response.json({ market_codes: marketCodes }, {
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("Nutrition market reference API error:", error);
    return Response.json({ error: "Could not load nutrition markets" }, { status: 500 });
  }
}
