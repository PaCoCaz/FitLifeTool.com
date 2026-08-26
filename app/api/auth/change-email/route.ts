import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  buildEmailChangeRedirectUrl,
  EmailChangeError,
  requestEmailChangeForAuthenticatedUser,
} from "@/lib/auth/emailChange";
import { createIsolatedFreshAuthClient } from "@/lib/auth/freshAuthentication";
import {
  deriveEmailChangeStatus,
  emailChangeRequestIsBlocked,
} from "@/lib/auth/emailChangeValidation";

const HEADERS = { "Cache-Control": "no-store" };

function errorResponse(code: string, status: number) {
  return NextResponse.json(
    { ok: false, code },
    { status, headers: HEADERS }
  );
}

function requestHasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
      : null;
    const callerOrigin = new URL(origin).origin;

    return callerOrigin === requestOrigin || callerOrigin === siteOrigin;
  } catch {
    return false;
  }
}

async function readEmailChangeStatus(
  user: { id: string; email?: string | null; new_email?: string | null },
  admin: ReturnType<typeof createSupabaseServer>
) {
  const { data: job, error } = await admin
    .from("auth_email_sync_jobs")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Email change status is unavailable");

  const status = deriveEmailChangeStatus({
    newEmail: user.new_email,
    jobStatus: job?.status,
  });

  return {
    confirmedEmail: user.email ?? null,
    ...status,
  };
}

export async function GET() {
  const auth = (await createClient()).auth;
  const { data, error } = await auth.getUser();

  if (error || !data.user) return errorResponse("UNAUTHENTICATED", 401);

  const admin = createSupabaseServer();
  let status;
  try {
    status = await readEmailChangeStatus(data.user, admin);
  } catch {
    return errorResponse("STATUS_UNAVAILABLE", 503);
  }

  return NextResponse.json(
    {
      ok: true,
      ...status,
    },
    { headers: HEADERS }
  );
}

export async function POST(request: Request) {
  if (!requestHasTrustedOrigin(request)) {
    return errorResponse("REQUEST_REJECTED", 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return errorResponse("REQUEST_REJECTED", 415);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("REQUEST_REJECTED", 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!supabaseUrl || !anonKey || !siteUrl) {
    return errorResponse("EMAIL_CHANGE_FAILED", 500);
  }

  const normalAuth = (await createClient()).auth;
  const { data: normalData, error: normalError } = await normalAuth.getUser();
  if (normalError || !normalData.user) {
    return errorResponse("UNAUTHENTICATED", 401);
  }

  let currentStatus;
  try {
    currentStatus = await readEmailChangeStatus(
      normalData.user,
      createSupabaseServer()
    );
  } catch {
    return errorResponse("STATUS_UNAVAILABLE", 503);
  }

  if (emailChangeRequestIsBlocked(currentStatus)) {
    return errorResponse("EMAIL_CHANGE_BLOCKED", 409);
  }

  const freshAuth = createIsolatedFreshAuthClient(supabaseUrl, anonKey);
  const verifiedNormalAuth = {
    async getUser() {
      return { data: { user: normalData.user }, error: null };
    },
  };

  try {
    const result = await requestEmailChangeForAuthenticatedUser(
      verifiedNormalAuth,
      freshAuth,
      {
        currentPassword:
          typeof body.currentPassword === "string"
            ? body.currentPassword
            : "",
        newEmail: typeof body.newEmail === "string" ? body.newEmail : "",
        emailRedirectTo: buildEmailChangeRedirectUrl(siteUrl, body.language),
      }
    );

    return NextResponse.json(
      { ok: true, status: result.status },
      { headers: HEADERS }
    );
  } catch (error) {
    if (error instanceof EmailChangeError) {
      if (error.code === "UNAUTHENTICATED") {
        return errorResponse("UNAUTHENTICATED", 401);
      }
      if (
        error.code === "REAUTHENTICATION_FAILED" ||
        error.code === "REAUTHENTICATION_IDENTITY_MISMATCH"
      ) {
        return errorResponse("REAUTHENTICATION_FAILED", 403);
      }
      if (error.code === "INVALID_EMAIL" || error.code === "EMAIL_UNCHANGED") {
        return errorResponse(error.code, 400);
      }
    }

    return errorResponse("EMAIL_CHANGE_FAILED", 500);
  }
}
