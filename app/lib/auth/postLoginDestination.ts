import { getSafeProtectedReturnTo } from "./authRedirects";
import type { ServerAuthState } from "./serverAuthState";

export type PostLoginResolution =
  | { ok: true; destination: string }
  | {
      ok: false;
      code: "AUTHENTICATION_REQUIRED" | "AUTH_STATE_UNAVAILABLE";
    };

export function isAllowedPostLoginDestination(
  value: unknown
): value is string {
  return (
    value === "/onboarding" ||
    value === "/dashboard" ||
    getSafeProtectedReturnTo(value) != null
  );
}

export function resolvePostLoginDestination(
  state: ServerAuthState,
  returnTo: unknown
): PostLoginResolution {
  if (state.kind === "ANONYMOUS") {
    return { ok: false, code: "AUTHENTICATION_REQUIRED" };
  }
  if (state.kind === "RESOLUTION_FAILURE") {
    return { ok: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE") {
    return { ok: true, destination: "/onboarding" };
  }

  return {
    ok: true,
    destination: getSafeProtectedReturnTo(returnTo) ?? "/dashboard",
  };
}
