import { resolveProfileBootstrapValues } from "@/lib/auth/profileBootstrap";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";
import { cookies } from "next/headers";
import { AUTH_CONTEXT_COOKIE, AUTH_CONTEXT_COOKIE_OPTIONS, buildSessionExpiredLoginPath, classifyIdentityResult, parseAuthContextMarker } from "@/lib/auth/sessionLifecycle";

const authFailureHeaders = { "Cache-Control": "private, no-store", Vary: "Cookie" };

export async function POST(request: Request) {
  const cookieStore = await cookies();
  let user: { id: string; user_metadata?: Record<string, unknown> } | null = null;
  let userError: unknown = null;
  try {
    const sessionClient = await createSupabaseServerUser();
    const result = await sessionClient.auth.getUser();
    user = result.data.user;
    userError = result.error;
  } catch {
    return Response.json({ code: "AUTH_STATE_UNAVAILABLE" }, { status: 503, headers: authFailureHeaders });
  }

  const identity = classifyIdentityResult(userError, user, cookieStore.get(AUTH_CONTEXT_COOKIE)?.value);
  if (identity !== "AUTHENTICATED") {
    if (identity === "SESSION_EXPIRED") {
      const marker = parseAuthContextMarker(cookieStore.get(AUTH_CONTEXT_COOKIE)?.value)!;
      cookieStore.set(AUTH_CONTEXT_COOKIE, "", { ...AUTH_CONTEXT_COOKIE_OPTIONS, maxAge: 0 });
      return Response.json({ code: identity, destination: buildSessionExpiredLoginPath(marker) }, { status: 401, headers: authFailureHeaders });
    }
    return Response.json({ code: identity }, { status: identity === "AUTH_STATE_UNAVAILABLE" ? 503 : 401, headers: authFailureHeaders });
  }
  if (!user) return Response.json({ code: "AUTH_STATE_UNAVAILABLE" }, { status: 503, headers: authFailureHeaders });

  const admin = createSupabaseServer();
  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingError) {
    return Response.json({ error: "Could not inspect profile" }, { status: 500 });
  }
  if (existing) return Response.json({ status: "exists" });

  let recovery: Record<string, unknown> = {};
  try {
    recovery = (await request.json()) as Record<string, unknown>;
  } catch {
    // An empty body is valid when signup metadata is complete.
  }

  const values = resolveProfileBootstrapValues(user.user_metadata ?? {}, recovery);
  if (!values) {
    return Response.json({ status: "needs_input" }, { status: 422 });
  }

  const codes = [...new Set([values.country_code, values.food_region])];
  const { data: validCountries, error: countriesError } = await admin
    .from("countries")
    .select("country_code")
    .eq("is_active", true)
    .in("country_code", codes);

  if (countriesError) {
    return Response.json({ error: "Could not validate countries" }, { status: 500 });
  }
  if ((validCountries ?? []).length !== codes.length) {
    return Response.json({ status: "needs_input" }, { status: 422 });
  }

  const { error: insertError } = await admin.from("profiles").insert({
    id: user.id,
    ...values,
  });

  if (insertError) {
    const { data: concurrentProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (concurrentProfile) return Response.json({ status: "exists" });
    console.error("Profile bootstrap error:", insertError);
    return Response.json({ error: "Could not create profile" }, { status: 500 });
  }

  return Response.json({ status: "created" }, { status: 201 });
}
