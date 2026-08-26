import { NextResponse } from "next/server";
import { processAuthEmailSyncBatch } from "@/lib/auth/emailSync";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { stripe } from "@/lib/stripe/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const result = await processAuthEmailSyncBatch({ supabase: createSupabaseServer(), stripe, limit: 10 });
    return NextResponse.json({ ok: true, claimed: result.claimed }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
