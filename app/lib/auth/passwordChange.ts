import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isAuthSessionMissingError } from "@supabase/auth-js";
import { asAppLanguage, type AppLanguage } from "../languagePreference";
import {
  validatePassword,
  validatePasswordConfirmation,
  type PasswordErrorCode,
} from "./passwordPolicy";

export const PASSWORD_CHANGE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Origin, Cookie",
  "Referrer-Policy": "no-referrer",
};

export type PasswordChangeCode =
  | "INVALID_REQUEST"
  | "ORIGIN_NOT_ALLOWED"
  | "PASSWORD_CHANGE_NOT_AVAILABLE"
  | "PASSWORD_CHANGE_REAUTH_REQUIRED"
  | "PASSWORD_CHANGE_REAUTH_FAILED"
  | "PASSWORD_VALIDATION_FAILED"
  | "PASSWORD_CHANGE_UNAVAILABLE"
  | "PASSWORD_CHANGE_STATUS_UNKNOWN"
  | "PASSWORD_CHANGE_COMPLETED"
  | "PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED"
  | "AUTH_STATE_UNAVAILABLE";

type AuthUser = { id: string; email?: string | null };
type Assurance = {
  currentLevel: "aal1" | "aal2" | null;
  nextLevel: "aal1" | "aal2" | null;
  currentAuthenticationMethods: unknown;
};

export type PasswordChangeNormalClient = {
  auth: {
    getUser(): Promise<{ data: { user: AuthUser | null }; error: unknown | null }>;
    getClaims(): Promise<{
      data: { claims: { sub?: unknown; amr?: unknown } } | null;
      error: unknown | null;
    }>;
    mfa: {
      getAuthenticatorAssuranceLevel(): Promise<{
        data: Assurance | null;
        error: unknown | null;
      }>;
    };
  };
};

export type PasswordChangeFreshClient = {
  auth: {
    signInWithPassword(input: { email: string; password: string }): Promise<{
      data: { user: AuthUser | null; session: { user: AuthUser } | null };
      error: unknown | null;
    }>;
    updateUser(input: { password: string; current_password: string }): Promise<{
      data: { user: AuthUser | null };
      error: unknown | null;
    }>;
    signOut(input: { scope: "global" | "local" }): Promise<{ error: unknown | null }>;
    mfa: {
      getAuthenticatorAssuranceLevel(): Promise<{
        data: Assurance | null;
        error: unknown | null;
      }>;
    };
  };
};

type PasswordChangeDependencies = {
  configuration(): { supabaseUrl?: string; anonKey?: string };
  createNormalClient(): Promise<PasswordChangeNormalClient>;
  createFreshClient(
    supabaseUrl: string,
    anonKey: string,
    options: {
      auth: {
        persistSession: false;
        autoRefreshToken: false;
        detectSessionInUrl: false;
      };
    }
  ): PasswordChangeFreshClient;
};

type PasswordChangeInput = {
  currentPassword: string;
  newPassword: string;
  confirmation: string;
};

type PasswordChangeAvailability =
  | { available: true; userId: string; email: string }
  | { available: false; code: "PASSWORD_CHANGE_REAUTH_REQUIRED" | "PASSWORD_CHANGE_NOT_AVAILABLE" | "AUTH_STATE_UNAVAILABLE" };

const SIGN_IN_REAUTHENTICATION_CODES = new Set([
  "invalid_credentials",
  "reauthentication_needed",
  "reauth_nonce_missing",
  "reauthentication_not_valid",
]);
const UPDATE_REAUTHENTICATION_CODES = new Set([
  "reauthentication_needed",
  "reauth_nonce_missing",
  "reauthentication_not_valid",
]);
const VALIDATION_CODES = new Set(["weak_password", "same_password"]);

function providerCode(error: unknown): string | null {
  return typeof error === "object" && error !== null && "code" in error &&
    typeof error.code === "string"
    ? error.code
    : null;
}

function normalizeAmr(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const methods: string[] = [];
  for (const entry of value) {
    if (typeof entry === "string") {
      if (!entry) return null;
      methods.push(entry);
      continue;
    }
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const record = entry as Record<string, unknown>;
    if (
      typeof record.method !== "string" || !record.method ||
      typeof record.timestamp !== "number" || !Number.isFinite(record.timestamp)
    ) return null;
    methods.push(record.method);
  }
  return methods;
}

function isPasswordOnlyAmr(value: unknown): boolean {
  const methods = normalizeAmr(value);
  return methods?.length === 1 && methods[0] === "password";
}

function isSupportedAal(value: Assurance | null): boolean {
  return value?.currentLevel === "aal1" && value.nextLevel === "aal1";
}

export function parsePasswordChangeRequest(value: unknown): PasswordChangeInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).sort().join(",") !== "confirmation,currentPassword,newPassword") {
    return null;
  }
  return typeof input.currentPassword === "string" &&
    typeof input.newPassword === "string" &&
    typeof input.confirmation === "string"
    ? {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        confirmation: input.confirmation,
      }
    : null;
}

export async function resolvePasswordChangeAvailability(
  client: PasswordChangeNormalClient
): Promise<PasswordChangeAvailability> {
  let userResult;
  try {
    userResult = await client.auth.getUser();
  } catch {
    return { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (userResult.error) {
    return isAuthSessionMissingError(userResult.error)
      ? { available: false, code: "PASSWORD_CHANGE_REAUTH_REQUIRED" }
      : { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  const user = userResult.data.user;
  if (!user) return { available: false, code: "PASSWORD_CHANGE_REAUTH_REQUIRED" };
  if (!user.id || !user.email) {
    return { available: false, code: "PASSWORD_CHANGE_NOT_AVAILABLE" };
  }

  let claimsResult;
  try {
    claimsResult = await client.auth.getClaims();
  } catch {
    return { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (claimsResult.error || !claimsResult.data) {
    return { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (
    claimsResult.data.claims.sub !== user.id ||
    !isPasswordOnlyAmr(claimsResult.data.claims.amr)
  ) {
    return { available: false, code: "PASSWORD_CHANGE_NOT_AVAILABLE" };
  }

  let assuranceResult;
  try {
    assuranceResult = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  } catch {
    return { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (assuranceResult.error || !assuranceResult.data) {
    return { available: false, code: "AUTH_STATE_UNAVAILABLE" };
  }
  if (!isSupportedAal(assuranceResult.data)) {
    return { available: false, code: "PASSWORD_CHANGE_NOT_AVAILABLE" };
  }

  return { available: true, userId: user.id, email: user.email };
}

function validationError(input: PasswordChangeInput): PasswordErrorCode | "CURRENT_PASSWORD_REQUIRED" | null {
  if (!input.currentPassword) return "CURRENT_PASSWORD_REQUIRED";
  const password = validatePassword(input.newPassword);
  if (!password.valid) return password.code;
  const confirmation = validatePasswordConfirmation(input.newPassword, input.confirmation);
  return confirmation.valid ? null : confirmation.code;
}

async function closeFreshSession(client: PasswordChangeFreshClient) {
  try { await client.auth.signOut({ scope: "local" }); }
  catch { /* The action-scoped client is discarded after this request. */ }
}

export function createPasswordChangeAction(
  freshClient: PasswordChangeFreshClient,
  identity: { userId: string; email: string },
  input: PasswordChangeInput
) {
  let phase: "idle" | "in_flight" | "mutation_locked" | "password_changed" = "idle";

  return async function execute(): Promise<PasswordChangeCode> {
    if (phase !== "idle") return "PASSWORD_CHANGE_STATUS_UNKNOWN";
    phase = "in_flight";

    let signInResult;
    try {
      signInResult = await freshClient.auth.signInWithPassword({
        email: identity.email,
        password: input.currentPassword,
      });
    } catch {
      await closeFreshSession(freshClient);
      return "PASSWORD_CHANGE_UNAVAILABLE";
    }
    if (signInResult.error) {
      await closeFreshSession(freshClient);
      return SIGN_IN_REAUTHENTICATION_CODES.has(providerCode(signInResult.error) ?? "")
        ? "PASSWORD_CHANGE_REAUTH_FAILED"
        : "PASSWORD_CHANGE_UNAVAILABLE";
    }
    if (
      !signInResult.data.user?.id ||
      !signInResult.data.session?.user.id ||
      signInResult.data.user.id !== identity.userId ||
      signInResult.data.session.user.id !== identity.userId
    ) {
      await closeFreshSession(freshClient);
      return "PASSWORD_CHANGE_NOT_AVAILABLE";
    }

    let freshAssurance;
    try {
      freshAssurance = await freshClient.auth.mfa.getAuthenticatorAssuranceLevel();
    } catch {
      await closeFreshSession(freshClient);
      return "AUTH_STATE_UNAVAILABLE";
    }
    if (freshAssurance.error || !freshAssurance.data) {
      await closeFreshSession(freshClient);
      return "AUTH_STATE_UNAVAILABLE";
    }
    if (!isSupportedAal(freshAssurance.data)) {
      await closeFreshSession(freshClient);
      return "PASSWORD_CHANGE_NOT_AVAILABLE";
    }

    phase = "mutation_locked";
    let updateResult;
    try {
      updateResult = await freshClient.auth.updateUser({
        password: input.newPassword,
        current_password: input.currentPassword,
      });
    } catch {
      await closeFreshSession(freshClient);
      return "PASSWORD_CHANGE_STATUS_UNKNOWN";
    }
    if (updateResult.error) {
      await closeFreshSession(freshClient);
      const code = providerCode(updateResult.error);
      if (VALIDATION_CODES.has(code ?? "")) return "PASSWORD_VALIDATION_FAILED";
      if (UPDATE_REAUTHENTICATION_CODES.has(code ?? "")) return "PASSWORD_CHANGE_REAUTH_FAILED";
      if (code === "insufficient_aal") return "PASSWORD_CHANGE_NOT_AVAILABLE";
      return "PASSWORD_CHANGE_STATUS_UNKNOWN";
    }
    if (!updateResult.data.user?.id || updateResult.data.user.id !== identity.userId) {
      await closeFreshSession(freshClient);
      return "PASSWORD_CHANGE_STATUS_UNKNOWN";
    }

    phase = "password_changed";
    try {
      const { error } = await freshClient.auth.signOut({ scope: "global" });
      return error
        ? "PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED"
        : "PASSWORD_CHANGE_COMPLETED";
    } catch {
      return "PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED";
    }
  };
}

const STATUS_BY_CODE: Record<PasswordChangeCode, number> = {
  INVALID_REQUEST: 400,
  ORIGIN_NOT_ALLOWED: 403,
  PASSWORD_CHANGE_NOT_AVAILABLE: 403,
  PASSWORD_CHANGE_REAUTH_REQUIRED: 401,
  PASSWORD_CHANGE_REAUTH_FAILED: 403,
  PASSWORD_VALIDATION_FAILED: 422,
  PASSWORD_CHANGE_UNAVAILABLE: 503,
  PASSWORD_CHANGE_STATUS_UNKNOWN: 409,
  PASSWORD_CHANGE_COMPLETED: 200,
  PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED: 200,
  AUTH_STATE_UNAVAILABLE: 503,
};

function response(code: PasswordChangeCode) {
  return Response.json(
    { code },
    { status: STATUS_BY_CODE[code], headers: PASSWORD_CHANGE_RESPONSE_HEADERS }
  );
}

export function createPasswordChangeHandler(dependencies: PasswordChangeDependencies) {
  return async function passwordChange(request: Request) {
    if (request.method !== "POST") return response("INVALID_REQUEST");
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return response("ORIGIN_NOT_ALLOWED");
    }
    if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") {
      return response("INVALID_REQUEST");
    }

    let parsed: unknown;
    try { parsed = await request.json(); }
    catch { return response("INVALID_REQUEST"); }
    const input = parsePasswordChangeRequest(parsed);
    if (!input) return response("INVALID_REQUEST");

    const invalid = validationError(input);
    if (invalid === "CURRENT_PASSWORD_REQUIRED") {
      return response("PASSWORD_CHANGE_REAUTH_FAILED");
    }
    if (invalid) return response("PASSWORD_VALIDATION_FAILED");

    let normalClient: PasswordChangeNormalClient;
    try { normalClient = await dependencies.createNormalClient(); }
    catch { return response("AUTH_STATE_UNAVAILABLE"); }
    const availability = await resolvePasswordChangeAvailability(normalClient);
    if (!availability.available) return response(availability.code);

    const { supabaseUrl, anonKey } = dependencies.configuration();
    if (!supabaseUrl || !anonKey) return response("AUTH_STATE_UNAVAILABLE");

    let freshClient: PasswordChangeFreshClient;
    try {
      freshClient = dependencies.createFreshClient(supabaseUrl, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
    } catch {
      return response("AUTH_STATE_UNAVAILABLE");
    }
    return response(await createPasswordChangeAction(freshClient, availability, input)());
  };
}

export function createDefaultFreshPasswordChangeClient(
  supabaseUrl: string,
  anonKey: string,
  options: {
    auth: {
      persistSession: false;
      autoRefreshToken: false;
      detectSessionInUrl: false;
    };
  },
  transport: typeof fetch = globalThis.fetch.bind(globalThis)
) {
  const boundedTransport: typeof fetch = async (input, init) => {
    try {
      return await transport(input, init);
    } catch {
      throw new Error("Password change transport unavailable");
    }
  };
  return createSupabaseClient(supabaseUrl, anonKey, {
    auth: options.auth,
    global: { fetch: boundedTransport },
  }) as unknown as PasswordChangeFreshClient;
}

export function buildPasswordChangedLoginPath(language: unknown) {
  const locale: AppLanguage = asAppLanguage(language) ?? "en";
  return `/login?${new URLSearchParams({ lang: locale, auth_notice: "password_changed" })}`;
}
