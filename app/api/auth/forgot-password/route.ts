import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requestPasswordRecovery } from "@/lib/auth/passwordRecovery";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // Keep the public response indistinguishable from every other request.
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!supabaseUrl || !anonKey || !siteUrl) {
    console.error("Password recovery configuration is unavailable");
  } else {
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });

    await requestPasswordRecovery(
      {
        email: typeof body.email === "string" ? body.email : "",
        language: body.language,
        siteUrl,
      },
      (email, options) =>
        supabase.auth.resetPasswordForEmail(email, options),
      () => {
        console.error("Password recovery request failed");
      }
    );
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
