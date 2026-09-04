import { resolveServerAuthState } from "@/lib/auth/serverAuthState";
import { createClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { AUTH_CONTEXT_COOKIE, AUTH_CONTEXT_COOKIE_OPTIONS, buildSessionExpiredLoginPath, parseAuthContextMarker } from "@/lib/auth/sessionLifecycle";

const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };

export async function GET() {
  const cookieStore = await cookies();
  let state;
  try { state = await resolveServerAuthState(await createClient()); }
  catch { return Response.json({ code: "AUTH_STATE_UNAVAILABLE" }, { status: 503, headers }); }

  if (state.kind === "ANONYMOUS") {
    const marker = parseAuthContextMarker(cookieStore.get(AUTH_CONTEXT_COOKIE)?.value);
    if (marker) {
      cookieStore.set(AUTH_CONTEXT_COOKIE, "", { ...AUTH_CONTEXT_COOKIE_OPTIONS, maxAge: 0 });
      return Response.json({ code: "SESSION_EXPIRED", destination: buildSessionExpiredLoginPath(marker) }, { status: 401, headers });
    }
    return Response.json({ code: "AUTHENTICATION_REQUIRED" }, { status: 401, headers });
  }
  if (state.kind === "RESOLUTION_FAILURE") {
    return Response.json({ code: "AUTH_STATE_UNAVAILABLE" }, { status: 503, headers });
  }

  return Response.json({
    step: state.onboardingStep,
    profile: state.profile,
  });
}
