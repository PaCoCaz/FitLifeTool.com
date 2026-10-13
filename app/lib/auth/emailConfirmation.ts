import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import {
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference";
import { validateRegistrationEmail } from "./registration";
import {
  resolveServerAuthState,
  type ServerAuthClient,
  type ServerAuthState,
} from "./serverAuthState";

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

type ConfirmationClient = ServerAuthClient & {
  auth: ServerAuthClient["auth"] & {
    exchangeCodeForSession(code: string): Promise<{ error: unknown | null }>;
    verifyOtp(input: { token_hash: string; type: "signup" }): Promise<{ error: unknown | null }>;
  };
};
type CreateConfirmationClient = () => Promise<ConfirmationClient>;

function confirmationRedirect(requestUrl: string, destination: string) {
  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(destination, requestUrl).toString(),
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
    },
  });
}

function confirmationPage(requestUrl: string, language: string, state: "invalid" | "unavailable") {
  const url = new URL("/auth/confirmation", requestUrl);
  url.searchParams.set("lang", language);
  url.searchParams.set("state", state);
  return confirmationRedirect(requestUrl, url.toString());
}

export function getEmailConfirmationAuthenticatedDestination(state: ServerAuthState): string | null {
  if (state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE") return "/onboarding";
  if (state.kind === "AUTHENTICATED_ONBOARDING_COMPLETE") return "/dashboard";
  return null;
}

async function verifyConfirmation(client: ConfirmationClient, credential: EmailConfirmationCredential) {
  if (credential.kind === "code") return client.auth.exchangeCodeForSession(credential.code);
  return client.auth.verifyOtp({ token_hash: credential.tokenHash, type: "signup" });
}

type ConfirmationHandlerDependencies = {
  parse: typeof parseEmailConfirmationRequest;
  resolveState: typeof resolveServerAuthState;
  authenticatedDestination: typeof getEmailConfirmationAuthenticatedDestination;
};

export function createEmailConfirmationHandler(
  createServerAuthClient: CreateConfirmationClient,
  dependencies: ConfirmationHandlerDependencies = {
    parse: parseEmailConfirmationRequest,
    resolveState: resolveServerAuthState,
    authenticatedDestination: getEmailConfirmationAuthenticatedDestination,
  }
) {
  return async function confirmEmail(request: Request) {
    const parsed = dependencies.parse(new URL(request.url).searchParams);
    if (!parsed.credential) return confirmationPage(request.url, parsed.language, "invalid");
    let client: ConfirmationClient;
    try { client = await createServerAuthClient(); }
    catch { return confirmationPage(request.url, parsed.language, "unavailable"); }
    let verificationSucceeded = false;
    try { verificationSucceeded = (await verifyConfirmation(client, parsed.credential)).error == null; }
    catch { verificationSucceeded = false; }
    let state: ServerAuthState;
    try { state = await dependencies.resolveState(client); }
    catch { return confirmationPage(request.url, parsed.language, "unavailable"); }
    const destination = dependencies.authenticatedDestination(state);
    if (destination) return confirmationRedirect(request.url, destination);
    if (state.kind === "RESOLUTION_FAILURE" || verificationSucceeded) {
      return confirmationPage(request.url, parsed.language, "unavailable");
    }
    return confirmationPage(request.url, parsed.language, "invalid");
  };
}

type ResendClient = {
  auth: {
    resend(input: { type: "signup"; email: string; options: { emailRedirectTo: string } }): Promise<{ error: unknown | null }>;
  };
};
export type ResendDependencies = {
  configuration(): { supabaseUrl?: string; anonKey?: string; siteUrl?: string };
  createAnonClient(supabaseUrl: string, anonKey: string, options: {
    auth: { autoRefreshToken: false; detectSessionInUrl: false; persistSession: false };
  }): ResendClient;
};

function resendResponse(code: "CONFIRMATION_RESEND_ACCEPTED" | "CONFIRMATION_RESEND_UNAVAILABLE" | "INVALID_REQUEST" | "ORIGIN_NOT_ALLOWED", status: number) {
  return Response.json({ code }, { status, headers: { "Cache-Control": "no-store" } });
}

export function createResendConfirmationHandler(dependencies: ResendDependencies) {
  return async function resendConfirmation(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) return resendResponse("ORIGIN_NOT_ALLOWED", 403);
    if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") return resendResponse("INVALID_REQUEST", 400);
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return resendResponse("INVALID_REQUEST", 400);
      body = parsed as Record<string, unknown>;
    } catch { return resendResponse("INVALID_REQUEST", 400); }
    if (Object.keys(body).some((key) => key !== "email" && key !== "language")) return resendResponse("INVALID_REQUEST", 400);
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (validateRegistrationEmail(email) != null) return resendResponse("INVALID_REQUEST", 400);
    const { supabaseUrl, anonKey, siteUrl } = dependencies.configuration();
    if (!supabaseUrl || !anonKey || !siteUrl) return resendResponse("CONFIRMATION_RESEND_UNAVAILABLE", 503);
    try {
      const emailRedirectTo = buildEmailConfirmationRedirectUrl(siteUrl, body.language);
      const supabase = dependencies.createAnonClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
      });
      const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo } });
      return normalizeConfirmationResendResult(error) === "unavailable"
        ? resendResponse("CONFIRMATION_RESEND_UNAVAILABLE", 503)
        : resendResponse("CONFIRMATION_RESEND_ACCEPTED", 202);
    } catch { return resendResponse("CONFIRMATION_RESEND_UNAVAILABLE", 503); }
  };
}
