import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { asAppLanguage, type AppLanguage } from "../languagePreference";
import { validateRegistrationEmail } from "./registration";

export const PASSWORD_RECOVERY_COOLDOWN_SECONDS = 60;
export const PASSWORD_RECOVERY_EMAIL_MAX_LENGTH = 254;
export const PASSWORD_RECOVERY_TOKEN_MAX_LENGTH = 4096;

export type PasswordRecoveryRequestResult = "accepted" | "unavailable";
export type PasswordRecoveryLinkState =
  | { valid: true; language: AppLanguage; tokenHash: string; sanitizedPath: string }
  | { valid: false; language: AppLanguage; sanitizedPath: string };

type PasswordRecoveryClient = {
  auth: {
    resetPasswordForEmail(
      email: string,
      options: { redirectTo: string }
    ): Promise<{ error: unknown | null }>;
  };
};

type PasswordRecoveryHandlerDependencies = {
  configuration(): { supabaseUrl?: string; anonKey?: string; siteUrl?: string };
  createAnonClient(
    supabaseUrl: string,
    anonKey: string,
    options: {
      auth: {
        autoRefreshToken: false;
        detectSessionInUrl: false;
        persistSession: false;
      };
    }
  ): PasswordRecoveryClient;
};

const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  Vary: "Origin",
};
const INFRASTRUCTURE_ERROR_CODES = new Set([
  "request_timeout",
  "hook_timeout",
  "hook_timeout_after_retry",
]);
const RECOVERY_PARAMETER_KEYS = new Set(["token_hash", "type", "lang"]);
const RECOVERY_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;

export function resolvePasswordRecoveryLanguage(value: unknown): AppLanguage {
  return asAppLanguage(value) ?? "en";
}

export function buildRecoveryRedirectUrl(siteUrl: string, language: unknown): string {
  const url = new URL(siteUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Invalid trusted FitLifeTool site URL");
  }
  url.pathname = "/reset-password";
  url.search = "";
  url.hash = "";
  url.searchParams.set("lang", resolvePasswordRecoveryLanguage(language));
  return url.toString();
}

export function buildPasswordResetLoginPath(language: unknown): string {
  return `/login?${new URLSearchParams({
    lang: resolvePasswordRecoveryLanguage(language),
    auth_notice: "password_reset",
  }).toString()}`;
}

export function getSanitizedRecoveryPath(language: unknown): string {
  return `/reset-password?lang=${resolvePasswordRecoveryLanguage(language)}`;
}

export function parsePasswordRecoveryLink(url: URL): PasswordRecoveryLinkState {
  const languageValues = url.searchParams.getAll("lang");
  const language = languageValues.length <= 1
    ? resolvePasswordRecoveryLanguage(languageValues[0])
    : "en";
  const invalidResult: PasswordRecoveryLinkState = {
    valid: false,
    language,
    sanitizedPath: getSanitizedRecoveryPath(language),
  };

  if (
    url.hash ||
    languageValues.length > 1 ||
    [...url.searchParams.keys()].some((key) => !RECOVERY_PARAMETER_KEYS.has(key))
  ) return invalidResult;

  const tokenHashes = url.searchParams.getAll("token_hash");
  const types = url.searchParams.getAll("type");
  if (tokenHashes.length !== 1 || types.length !== 1 || types[0] !== "recovery") {
    return invalidResult;
  }

  const tokenHash = tokenHashes[0];
  if (
    tokenHash.length === 0 ||
    tokenHash.length > PASSWORD_RECOVERY_TOKEN_MAX_LENGTH ||
    !RECOVERY_TOKEN_PATTERN.test(tokenHash)
  ) return invalidResult;

  return {
    valid: true,
    language,
    tokenHash,
    sanitizedPath: getSanitizedRecoveryPath(language),
  };
}

export function initializePasswordRecoveryLocation(
  href: string,
  replacePath: (path: string) => void
): PasswordRecoveryLinkState {
  const parsed = parsePasswordRecoveryLink(new URL(href));
  replacePath(parsed.sanitizedPath);
  return parsed;
}

export function parsePasswordRecoveryRequestBody(value: unknown): {
  email: string;
  language: AppLanguage;
} | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (
    Object.keys(body).some((key) => key !== "email" && key !== "language") ||
    typeof body.email !== "string" ||
    (Object.hasOwn(body, "language") && typeof body.language !== "string")
  ) return null;

  const email = body.email.trim();
  if (
    email.length > PASSWORD_RECOVERY_EMAIL_MAX_LENGTH ||
    validateRegistrationEmail(email) != null
  ) return null;

  return { email, language: resolvePasswordRecoveryLanguage(body.language) };
}

export function normalizePasswordRecoveryRequestResult(
  error: unknown | null
): PasswordRecoveryRequestResult {
  if (error == null) return "accepted";
  if (isAuthRetryableFetchError(error)) return "unavailable";
  if (
    typeof error === "object" && error !== null && "code" in error &&
    typeof error.code === "string" && INFRASTRUCTURE_ERROR_CODES.has(error.code)
  ) return "unavailable";
  return "accepted";
}

function response(
  code: "RECOVERY_REQUEST_ACCEPTED" | "RECOVERY_REQUEST_UNAVAILABLE" |
    "INVALID_REQUEST" | "ORIGIN_NOT_ALLOWED",
  status: number
) {
  return Response.json({ code }, { status, headers: RESPONSE_HEADERS });
}

type PasswordRecoveryLogoutResponse = {
  ok: boolean;
  json(): Promise<unknown>;
};

export async function completePasswordRecoveryApplicationCleanup(
  language: unknown,
  dependencies: {
    requestLogout(
      endpoint: "/auth/logout",
      init: {
        method: "POST";
        credentials: "include";
        cache: "no-store";
        headers: { "Content-Type": "application/json" };
        body: string;
      }
    ): Promise<PasswordRecoveryLogoutResponse>;
    notifyLogout(): void;
    clearSensitiveState(): void;
    navigate(destination: string): void;
  }
): Promise<"completed" | "cleanup_required"> {
  try {
    const logoutResponse = await dependencies.requestLogout("/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: resolvePasswordRecoveryLanguage(language) }),
    });
    const body = await logoutResponse.json();
    const code = body && typeof body === "object" && "code" in body
      ? (body as { code?: unknown }).code
      : null;
    if (!logoutResponse.ok || code !== "LOGOUT_COMPLETED") return "cleanup_required";

    dependencies.notifyLogout();
    dependencies.clearSensitiveState();
    dependencies.navigate(buildPasswordResetLoginPath(language));
    return "completed";
  } catch {
    return "cleanup_required";
  }
}

export function createPasswordRecoveryHandler(
  dependencies: PasswordRecoveryHandlerDependencies
) {
  return async function passwordRecovery(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return response("ORIGIN_NOT_ALLOWED", 403);
    }
    if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") {
      return response("INVALID_REQUEST", 400);
    }

    let body: unknown;
    try { body = await request.json(); }
    catch { return response("INVALID_REQUEST", 400); }
    const input = parsePasswordRecoveryRequestBody(body);
    if (!input) return response("INVALID_REQUEST", 400);

    const { supabaseUrl, anonKey, siteUrl } = dependencies.configuration();
    if (!supabaseUrl || !anonKey || !siteUrl) {
      return response("RECOVERY_REQUEST_UNAVAILABLE", 503);
    }

    try {
      const client = dependencies.createAnonClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
      });
      const { error } = await client.auth.resetPasswordForEmail(input.email, {
        redirectTo: buildRecoveryRedirectUrl(siteUrl, input.language),
      });
      return normalizePasswordRecoveryRequestResult(error) === "unavailable"
        ? response("RECOVERY_REQUEST_UNAVAILABLE", 503)
        : response("RECOVERY_REQUEST_ACCEPTED", 202);
    } catch {
      return response("RECOVERY_REQUEST_UNAVAILABLE", 503);
    }
  };
}

export function getPasswordRecoveryCooldownDeadline(now: number): number {
  return now + PASSWORD_RECOVERY_COOLDOWN_SECONDS * 1_000;
}

export function getPasswordRecoveryCooldownSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1_000));
}
