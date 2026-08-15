import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const supabase = await createClient();

  let error: { message: string } | null = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type === "signup") {
    ({ error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "signup",
    }));
  } else {
    return NextResponse.redirect(new URL("/?auth_error=invalid_confirmation", request.url));
  }

  if (error) {
    return NextResponse.redirect(new URL("/?auth_error=confirmation_failed", request.url));
  }

  return NextResponse.redirect(new URL("/onboarding", request.url));
}
