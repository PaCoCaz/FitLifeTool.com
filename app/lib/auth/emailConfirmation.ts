import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import {
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference";

export const EMAIL_CONFIRMATION_COOLDOWN_SECONDS = 60;

export type EmailConfirmationCredential =
  | { kind: "code"; code: string }
  | { kind: "token_hash"; tokenHash: string };

export type EmailConfirmationRequest = {
  credential: EmailConfirmationCredential | null;
  language: AppLanguage;
};

export type EmailConfirmationPresentationState = "invalid" | "unavailable";

export type ConfirmationResendResult = "accepted" | "unavailable";

const ALLOWED_CONFIRMATION_PARAMETERS = new Set([
  "code",
  "token_hash",
  "type",
  "lang",
]);

const INFRASTRUCTURE_ERROR_CODES = new Set([
  "request_timeout",
  "hook_timeout",
  "hook_timeout_after_retry",
]);

export function resolveEmailConfirmationLanguage(value: unknown): AppLanguage {
  return asAppLanguage(value) ?? "en";
}

function parsePresentationLanguage(searchParams: URLSearchParams): AppLanguage {
  const values = searchParams.getAll("lang");
  return values.length === 1
    ? resolveEmailConfirmationLanguage(values[0])
    : "en";
}

export function buildEmailConfirmationRedirectUrl(
  baseUrl: string,
  language: unknown
): string {
  const url = new URL(baseUrl);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("Invalid trusted FitLifeTool site URL");
  }

  url.pathname = "/auth/confirm";
  url.search = "";
  url.hash = "";
  url.searchParams.set("lang", resolveEmailConfirmationLanguage(language));

  return url.toString();
}

export function parseEmailConfirmationRequest(
  searchParams: URLSearchParams
): EmailConfirmationRequest {
  const language = parsePresentationLanguage(searchParams);
  const hasUnknownParameter = [...searchParams.keys()].some(
    (key) => !ALLOWED_CONFIRMATION_PARAMETERS.has(key)
  );

  if (hasUnknownParameter) {
    return { credential: null, language };
  }

  const codes = searchParams.getAll("code");
  const tokenHashes = searchParams.getAll("token_hash");
  const types = searchParams.getAll("type");

  const hasSingleCode = codes.length === 1 && codes[0].trim().length > 0;
  const hasSingleTokenHash =
    tokenHashes.length === 1 && tokenHashes[0].trim().length > 0;

  if (
    hasSingleCode &&
    tokenHashes.length === 0 &&
    types.length === 0
  ) {
    return {
      credential: { kind: "code", code: codes[0] },
      language,
    };
  }

  if (
    codes.length === 0 &&
    hasSingleTokenHash &&
    types.length === 1 &&
    types[0] === "signup"
  ) {
    return {
      credential: {
        kind: "token_hash",
        tokenHash: tokenHashes[0],
      },
      language,
    };
  }

  return { credential: null, language };
}

export function resolveEmailConfirmationPresentationState(
  value: unknown
): EmailConfirmationPresentationState {
  return value === "unavailable" ? "unavailable" : "invalid";
}

export function normalizeConfirmationResendResult(
  error: unknown | null
): ConfirmationResendResult {
  if (error == null) return "accepted";

  if (isAuthRetryableFetchError(error)) return "unavailable";

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    INFRASTRUCTURE_ERROR_CODES.has(error.code)
  ) {
    return "unavailable";
  }

  // Account, eligibility, and rate-limit outcomes remain indistinguishable.
  return "accepted";
}

export function getEmailConfirmationCooldownDeadline(now: number): number {
  return now + EMAIL_CONFIRMATION_COOLDOWN_SECONDS * 1_000;
}

export function getEmailConfirmationCooldownSeconds(
  deadline: number,
  now: number
): number {
  return Math.max(0, Math.ceil((deadline - now) / 1_000));
}
