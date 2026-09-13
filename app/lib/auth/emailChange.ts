import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isAuthApiError, isAuthSessionMissingError } from "@supabase/auth-js";
import { asAppLanguage, type AppLanguage } from "../languagePreference";
import { validateRegistrationEmail } from "./registration";

export const EMAIL_CHANGE_MAX_BODY_BYTES = 8192;
export const EMAIL_CHANGE_MAX_LENGTH = 254;
export const EMAIL_CHANGE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Origin, Cookie",
  "Referrer-Policy": "no-referrer",
};
export type EmailChangeCode =
  | "INVALID_REQUEST" | "ORIGIN_NOT_ALLOWED" | "EMAIL_CHANGE_NOT_AVAILABLE"
  | "EMAIL_CHANGE_REAUTH_REQUIRED" | "EMAIL_CHANGE_REAUTH_FAILED"
  | "EMAIL_CHANGE_IDENTITY_MISMATCH" | "EMAIL_CHANGE_EMAIL_INVALID"
  | "EMAIL_CHANGE_EMAIL_UNCHANGED" | "EMAIL_CHANGE_REQUEST_BLOCKED"
  | "EMAIL_CHANGE_REQUEST_ACCEPTED" | "EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED"
  | "EMAIL_CHANGE_UNAVAILABLE" | "EMAIL_CHANGE_STATUS_UNKNOWN" | "AUTH_STATE_UNAVAILABLE";
export type EmailChangeActionCode = EmailChangeCode;
export type EmailChangeRequestTransition = "accept" | "status_unknown" | "fail";
type User = { id: string; email?: string | null };
type Aal = { currentLevel: "aal1" | "aal2" | null; nextLevel: "aal1" | "aal2" | null };
export type EmailChangeNormalClient = { auth: {
  getUser(): Promise<{ data: { user: User | null }; error: unknown | null }>;
  getClaims(): Promise<{ data: { claims: { sub?: unknown; amr?: unknown } } | null; error: unknown | null }>;
  mfa: { getAuthenticatorAssuranceLevel(): Promise<{ data: Aal | null; error: unknown | null }> };
} };
export type EmailChangeFreshClient = { auth: {
  signInWithPassword(input: { email: string; password: string }): Promise<{ data: { user: User | null; session: { user: User } | null }; error: unknown | null }>;
  updateUser(input: { email: string }, options: { emailRedirectTo: string }): Promise<{ data: { user: User | null }; error: unknown | null }>;
  signOut(input: { scope: "global" | "local" }): Promise<{ error: unknown | null }>;
  mfa: { getAuthenticatorAssuranceLevel(): Promise<{ data: Aal | null; error: unknown | null }> };
} };
export function normalizeEmailChange(value: string) { return value.trim(); }
export function isValidEmailChange(value: string) {
  const email = normalizeEmailChange(value);
  return email.length <= EMAIL_CHANGE_MAX_LENGTH && validateRegistrationEmail(email) === null;
}
export function parseEmailChangeBody(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (Object.keys(body).sort().join(",") !== "currentPassword,language,newEmail") return null;
  const language = asAppLanguage(body.language);
  return typeof body.currentPassword === "string" && typeof body.newEmail === "string" && language
    ? { currentPassword: body.currentPassword, newEmail: normalizeEmailChange(body.newEmail), language }
    : null;
}
export function buildEmailChangeRedirect(siteUrl: string, language: AppLanguage) {
  const base = new URL(siteUrl);
  if (base.protocol !== "https:" || base.username || base.password) throw new Error("invalid site");
  return new URL("/auth/change-email/confirm?lang=" + language, base.origin).toString();
}
function passwordOnly(amr: unknown) {
  if (!Array.isArray(amr) || amr.length !== 1) return false;
  const item = amr[0];
  return item === "password" ||
    (!!item && typeof item === "object" && (item as { method?: unknown }).method === "password");
}
function isDefinitiveProviderRejection(error: unknown) {
  try {
    if (!isAuthApiError(error)) return false;
    const status: unknown = error.status;
    return typeof status === "number" && Number.isFinite(status) && status >= 400 && status < 500;
  } catch {
    return false;
  }
}
function readProviderUpdateResult(value: unknown): {
  error: unknown | null;
  userId: string | null;
} | null {
  try {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const result = value as Record<string, unknown>;
    if (!("error" in result)) return null;
    if (result.error !== null) {
      return result.error === undefined ? null : { error: result.error, userId: null };
    }
    if (!("data" in result)) return null;
    const data = result.data;
    if (!data || typeof data !== "object" || Array.isArray(data) || !("user" in data)) {
      return null;
    }
    const user = (data as Record<string, unknown>).user;
    if (user === null) return { error: null, userId: null };
    if (!user || typeof user !== "object" || Array.isArray(user)) return null;
    const userId = (user as Record<string, unknown>).id;
    return typeof userId === "string" ? { error: null, userId } : null;
  } catch {
    return null;
  }
}
export function getEmailChangeRequestTransition(code: EmailChangeActionCode): EmailChangeRequestTransition {
  if (code === "EMAIL_CHANGE_REQUEST_ACCEPTED" || code === "EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED") return "accept";
  return code === "EMAIL_CHANGE_STATUS_UNKNOWN" ? "status_unknown" : "fail";
}
async function close(client: EmailChangeFreshClient) {
  try { await client.auth.signOut({ scope: "local" }); } catch { /* isolated client discarded */ }
}
export type EmailChangeIdentityResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; code: "AUTH_STATE_UNAVAILABLE" | "EMAIL_CHANGE_REAUTH_REQUIRED" | "EMAIL_CHANGE_NOT_AVAILABLE" };
export async function resolveEmailChangeIdentity(client: EmailChangeNormalClient): Promise<EmailChangeIdentityResult> {
  let userResult;
  try { userResult = await client.auth.getUser(); }
  catch { return { ok: false, code: "AUTH_STATE_UNAVAILABLE" as const }; }
  if (userResult.error) return { ok: false, code: isAuthSessionMissingError(userResult.error)
    ? "EMAIL_CHANGE_REAUTH_REQUIRED" as const : "AUTH_STATE_UNAVAILABLE" as const };
  const user = userResult.data.user;
  if (!user?.id || !user.email) return { ok: false, code: "EMAIL_CHANGE_REAUTH_REQUIRED" as const };
  let claims;
  try { claims = await client.auth.getClaims(); }
  catch { return { ok: false, code: "AUTH_STATE_UNAVAILABLE" as const }; }
  if (claims.error || !claims.data) return { ok: false, code: "AUTH_STATE_UNAVAILABLE" as const };
  if (claims.data.claims.sub !== user.id || !passwordOnly(claims.data.claims.amr)) {
    return { ok: false, code: "EMAIL_CHANGE_NOT_AVAILABLE" as const };
  }
  let aal;
  try { aal = await client.auth.mfa.getAuthenticatorAssuranceLevel(); }
  catch { return { ok: false, code: "AUTH_STATE_UNAVAILABLE" as const }; }
  if (aal.error || aal.data?.currentLevel !== "aal1" || aal.data.nextLevel !== "aal1") {
    return { ok: false, code: "EMAIL_CHANGE_NOT_AVAILABLE" as const };
  }
  return { ok: true, userId: user.id, email: user.email };
}
export function createEmailChangeAction(
  fresh: EmailChangeFreshClient,
  identity: { userId: string; email: string },
  input: { currentPassword: string; newEmail: string; redirect: string },
  markProviderMutationStarted: () => Promise<boolean>
) {
  let used = false;
  return async (): Promise<EmailChangeActionCode> => {
    if (used) return "EMAIL_CHANGE_STATUS_UNKNOWN";
    used = true;
    let login;
    try { login = await fresh.auth.signInWithPassword({ email: identity.email, password: input.currentPassword }); }
    catch { await close(fresh); return "EMAIL_CHANGE_UNAVAILABLE"; }
    if (login.error) { await close(fresh); return "EMAIL_CHANGE_REAUTH_FAILED"; }
    if (login.data.user?.id !== identity.userId || login.data.session?.user.id !== identity.userId) {
      await close(fresh); return "EMAIL_CHANGE_IDENTITY_MISMATCH";
    }
    let aal;
    try { aal = await fresh.auth.mfa.getAuthenticatorAssuranceLevel(); }
    catch { await close(fresh); return "AUTH_STATE_UNAVAILABLE"; }
    if (aal.error || aal.data?.currentLevel !== "aal1" || aal.data.nextLevel !== "aal1") {
      await close(fresh); return "EMAIL_CHANGE_NOT_AVAILABLE";
    }
    let mutationStarted = false;
    try { mutationStarted = await markProviderMutationStarted(); }
    catch { await close(fresh); return "EMAIL_CHANGE_STATUS_UNKNOWN"; }
    if (!mutationStarted) { await close(fresh); return "EMAIL_CHANGE_STATUS_UNKNOWN"; }
    let update: unknown;
    try { update = await fresh.auth.updateUser({ email: input.newEmail }, { emailRedirectTo: input.redirect }); }
    catch { return "EMAIL_CHANGE_STATUS_UNKNOWN"; }
    const result = readProviderUpdateResult(update);
    if (!result) return "EMAIL_CHANGE_STATUS_UNKNOWN";
    if (result.error) {
      if (!isDefinitiveProviderRejection(result.error)) return "EMAIL_CHANGE_STATUS_UNKNOWN";
      await close(fresh);
      return "EMAIL_CHANGE_UNAVAILABLE";
    }
    if (result.userId !== identity.userId) {
      return "EMAIL_CHANGE_STATUS_UNKNOWN";
    }
    try {
      const result = await fresh.auth.signOut({ scope: "global" });
      return result.error ? "EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED" : "EMAIL_CHANGE_REQUEST_ACCEPTED";
    } catch { return "EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED"; }
  };
}
export function createDefaultEmailChangeFreshClient(url: string, key: string) {
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }) as unknown as EmailChangeFreshClient;
}
