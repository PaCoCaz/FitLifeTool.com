import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  changePasswordForAuthenticatedUser,
  PasswordChangeError,
} from "@/lib/auth/passwordChange";
import { createClient } from "@/lib/supabaseServer";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
};

function errorResponse(
  code:
    | "UNAUTHENTICATED"
    | "REAUTHENTICATION_FAILED"
    | "PASSWORD_TOO_SHORT"
    | "PASSWORD_MISMATCH"
    | "PASSWORD_CHANGE_FAILED",
  status: number
) {
  return NextResponse.json(
    { ok: false, code },
    { status, headers: RESPONSE_HEADERS }
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return errorResponse("PASSWORD_CHANGE_FAILED", 415);
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("PASSWORD_CHANGE_FAILED", 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return errorResponse("PASSWORD_CHANGE_FAILED", 500);
  }

  const normalAuth = (await createClient()).auth;
  const freshAuth = createSupabaseClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  }).auth;

  try {
    const outcome = await changePasswordForAuthenticatedUser(
      normalAuth,
      freshAuth,
      {
        currentPassword:
          typeof body.currentPassword === "string"
            ? body.currentPassword
            : "",
        newPassword:
          typeof body.newPassword === "string" ? body.newPassword : "",
        confirmation:
          typeof body.confirmation === "string" ? body.confirmation : "",
      }
    );

    return NextResponse.json(
      { ok: true, status: outcome.status },
      { headers: RESPONSE_HEADERS }
    );
  } catch (error) {
    if (error instanceof PasswordChangeError) {
      if (error.code === "UNAUTHENTICATED") {
        return errorResponse("UNAUTHENTICATED", 401);
      }

      if (
        error.code === "REAUTHENTICATION_FAILED" ||
        error.code === "REAUTHENTICATION_IDENTITY_MISMATCH"
      ) {
        return errorResponse("REAUTHENTICATION_FAILED", 403);
      }

      if (error.code === "PASSWORD_TOO_SHORT") {
        return errorResponse("PASSWORD_TOO_SHORT", 400);
      }

      if (error.code === "PASSWORD_MISMATCH") {
        return errorResponse("PASSWORD_MISMATCH", 400);
      }
    }

    return errorResponse("PASSWORD_CHANGE_FAILED", 500);
  }
}
