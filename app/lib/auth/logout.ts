import { isAuthSessionMissingError } from "@supabase/auth-js";
import { asAppLanguage } from "../languagePreference";
import { getLocalizedPublicHome, parseAuthContextMarker } from "./sessionLifecycle";

export const LOGOUT_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};

export type LogoutClient = {
  auth: {
    signOut(input: { scope: "local" }): Promise<{ error: unknown | null }>;
    getUser(): Promise<{ data: { user: unknown | null }; error: unknown | null }>;
  };
};

function json(code: string, status: number, destination?: string) {
  return Response.json(
    destination ? { code, destination } : { code },
    { status, headers: LOGOUT_RESPONSE_HEADERS }
  );
}

export function createLogoutHandler(
  createClient: () => Promise<LogoutClient>,
  markerValue: () => string | undefined,
  clearMarker: () => void
) {
  return async function logout(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return json("ORIGIN_NOT_ALLOWED", 403);
    }
    if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") {
      return json("INVALID_REQUEST", 400);
    }

    let body: unknown;
    try { body = await request.json(); } catch { return json("INVALID_REQUEST", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json("INVALID_REQUEST", 400);
    const record = body as Record<string, unknown>;
    if (Object.keys(record).some((key) => key !== "language")) return json("INVALID_REQUEST", 400);
    const suppliedLocale = Object.hasOwn(record, "language") ? asAppLanguage(record.language) : null;
    if (Object.hasOwn(record, "language") && !suppliedLocale) return json("INVALID_REQUEST", 400);
    const marker = parseAuthContextMarker(markerValue());
    const locale = suppliedLocale ?? marker?.locale ?? "en";

    let client: LogoutClient;
    try { client = await createClient(); } catch { return json("AUTH_STATE_UNAVAILABLE", 503); }
    try { await client.auth.signOut({ scope: "local" }); } catch { /* terminal readback decides */ }

    try {
      const { data, error } = await client.auth.getUser();
      if (data.user) return json("LOGOUT_UNAVAILABLE", 503);
      if (error && !isAuthSessionMissingError(error)) return json("AUTH_STATE_UNAVAILABLE", 503);
      clearMarker();
      return json("LOGOUT_COMPLETED", 200, getLocalizedPublicHome(locale));
    } catch {
      return json("AUTH_STATE_UNAVAILABLE", 503);
    }
  };
}
