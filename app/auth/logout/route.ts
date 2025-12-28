import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";

export async function POST() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll: ((cookiesToSet) => {
          cookiesToSet.forEach((cookie) => {
            cookieStore.set(cookie);
          });
        }) as SetAllCookies,
      },
    }
  );

  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
