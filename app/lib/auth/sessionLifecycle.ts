import { asAppLanguage, type AppLanguage } from "../languagePreference";
import { getSafeProtectedReturnTo } from "./authRedirects";
import { getPublicPagePath } from "../publicWeb";
import { isAuthSessionMissingError } from "@supabase/auth-js";

export const AUTH_CONTEXT_COOKIE = "__Host-flt-auth-context";
export const AUTH_CONTEXT_VERSION = 1;
export const AUTH_CONTEXT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export type AuthContextMarker = {
  version: 1;
  onboarding: "complete" | "incomplete";
  locale: AppLanguage;
};

export type SessionFailureCode =
  | "AUTHENTICATION_REQUIRED"
  | "SESSION_EXPIRED"
  | "AUTH_STATE_UNAVAILABLE";

export function serializeAuthContextMarker(
  onboarding: AuthContextMarker["onboarding"],
  locale: AppLanguage
) {
  return encodeURIComponent(JSON.stringify({ version: 1, onboarding, locale }));
}

export function parseAuthContextMarker(value: unknown): AuthContextMarker | null {
  if (typeof value !== "string" || value.length > 256) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const marker = parsed as Record<string, unknown>;
    if (
      Object.keys(marker).sort().join(",") !== "locale,onboarding,version" ||
      marker.version !== AUTH_CONTEXT_VERSION ||
      (marker.onboarding !== "complete" && marker.onboarding !== "incomplete")
    ) return null;
    const locale = asAppLanguage(marker.locale);
    return locale
      ? { version: AUTH_CONTEXT_VERSION, onboarding: marker.onboarding, locale }
      : null;
  } catch {
    return null;
  }
}

export function getLocalizedPublicHome(locale: unknown) {
  return getPublicPagePath("home", asAppLanguage(locale) ?? "en");
}

export function buildSessionExpiredLoginPath(
  marker: AuthContextMarker,
  requestedReturnTo?: unknown
) {
  const params = new URLSearchParams({
    lang: marker.locale,
    auth_notice: "session_expired",
  });
  if (marker.onboarding === "complete") {
    const returnTo = getSafeProtectedReturnTo(requestedReturnTo);
    if (returnTo) params.set("returnTo", returnTo);
  }
  return `/login?${params.toString()}`;
}

export function classifyReliableMissingSession(markerValue: unknown): {
  code: "AUTHENTICATION_REQUIRED" | "SESSION_EXPIRED";
  marker: AuthContextMarker | null;
} {
  const marker = parseAuthContextMarker(markerValue);
  return marker
    ? { code: "SESSION_EXPIRED", marker }
    : { code: "AUTHENTICATION_REQUIRED", marker: null };
}

export function classifyIdentityResult(
  error: unknown,
  user: unknown,
  markerValue: unknown
): "AUTHENTICATED" | SessionFailureCode {
  if (error && !isAuthSessionMissingError(error)) return "AUTH_STATE_UNAVAILABLE";
  if (user) return "AUTHENTICATED";
  return classifyReliableMissingSession(markerValue).code;
}
