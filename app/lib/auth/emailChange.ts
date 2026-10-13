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

const EMAIL_CHANGE_STATUSES: Record<EmailChangeCode, number> = {
  INVALID_REQUEST: 400, ORIGIN_NOT_ALLOWED: 403, EMAIL_CHANGE_NOT_AVAILABLE: 403,
  EMAIL_CHANGE_REAUTH_REQUIRED: 401, EMAIL_CHANGE_REAUTH_FAILED: 403,
  EMAIL_CHANGE_IDENTITY_MISMATCH: 403, EMAIL_CHANGE_EMAIL_INVALID: 422,
  EMAIL_CHANGE_EMAIL_UNCHANGED: 422, EMAIL_CHANGE_REQUEST_BLOCKED: 409,
  EMAIL_CHANGE_REQUEST_ACCEPTED: 202, EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED: 202,
  EMAIL_CHANGE_UNAVAILABLE: 503, EMAIL_CHANGE_STATUS_UNKNOWN: 409, AUTH_STATE_UNAVAILABLE: 503,
};
export function emailChangeReply(code: EmailChangeCode) {
  return Response.json({ code }, { status: EMAIL_CHANGE_STATUSES[code], headers: EMAIL_CHANGE_RESPONSE_HEADERS });
}
type EmailChangeReservation = { generation: number; correlationId: string };
function readReservation(value: unknown): EmailChangeReservation | null {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return null;
  const generation = (row as Record<string, unknown>).generation;
  const correlationId = (row as Record<string, unknown>).correlation_id;
  if (typeof generation !== "number" || !Number.isSafeInteger(generation) || generation < 1) return null;
  if (typeof correlationId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(correlationId)) return null;
  return { generation, correlationId };
}
type EmailChangeQuery = {
  select(columns: string): EmailChangeQuery;
  eq(column: string, value: string): EmailChangeQuery;
  maybeSingle(): Promise<{ data: { status?: unknown } | null; error: unknown | null }>;
};
export type EmailChangeAdmin = {
  from(table: string): EmailChangeQuery;
  rpc(name: string, input: Record<string, unknown>): Promise<{ data: unknown; error: unknown | null }>;
};
export type EmailChangeConfiguration = { url: string; key: string; site: string };
export type EmailChangePostDependencies = {
  createNormalClient: () => Promise<EmailChangeNormalClient>;
  createAdminClient: () => EmailChangeAdmin;
  createFreshClient: (url: string, key: string) => EmailChangeFreshClient;
  readConfiguration: () => EmailChangeConfiguration | null;
};
export async function readEmailChangeState(admin: EmailChangeAdmin, userId: string) {
  const [request, job] = await Promise.all([
    admin.from("auth_email_change_requests").select("status").eq("user_id", userId).maybeSingle(),
    admin.from("auth_email_sync_jobs").select("status").eq("user_id", userId).maybeSingle(),
  ]);
  if (request.error || job.error) throw new Error("state unavailable");
  return { admin, requestStatus: request.data?.status ?? null, syncStatus: job.data?.status ?? null };
}

export function createEmailChangePostHandler(dependencies: EmailChangePostDependencies) {
  const { createNormalClient, createAdminClient, createFreshClient } = dependencies;
  const readConfig = dependencies.readConfiguration;
  return async function post(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) return emailChangeReply("ORIGIN_NOT_ALLOWED");
    if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") return emailChangeReply("INVALID_REQUEST");
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(declared) || declared > EMAIL_CHANGE_MAX_BODY_BYTES) return emailChangeReply("INVALID_REQUEST");
    let raw: string;
    try { raw = await request.text(); } catch { return emailChangeReply("INVALID_REQUEST"); }
    if (new TextEncoder().encode(raw).byteLength > EMAIL_CHANGE_MAX_BODY_BYTES) return emailChangeReply("INVALID_REQUEST");
    let body;
    try { body = parseEmailChangeBody(JSON.parse(raw)); } catch { body = null; }
    if (!body) return emailChangeReply("INVALID_REQUEST");
    if (!isValidEmailChange(body.newEmail)) return emailChangeReply("EMAIL_CHANGE_EMAIL_INVALID");
    let identity;
    try { identity = await resolveEmailChangeIdentity(await createNormalClient()); }
    catch { return emailChangeReply("AUTH_STATE_UNAVAILABLE"); }
    if (!identity.ok) return emailChangeReply(identity.code);
    if (identity.email.trim().toLowerCase() === body.newEmail.toLowerCase()) return emailChangeReply("EMAIL_CHANGE_EMAIL_UNCHANGED");
    const configuration = readConfig();
    if (!configuration) return emailChangeReply("EMAIL_CHANGE_UNAVAILABLE");
    let redirect: string;
    try { redirect = buildEmailChangeRedirect(configuration.site, body.language); }
    catch { return emailChangeReply("EMAIL_CHANGE_UNAVAILABLE"); }
    let admin: EmailChangeAdmin;
    try { admin = createAdminClient(); } catch { return emailChangeReply("EMAIL_CHANGE_UNAVAILABLE"); }
    let fresh: EmailChangeFreshClient;
    try { fresh = createFreshClient(configuration.url, configuration.key); }
    catch { return emailChangeReply("EMAIL_CHANGE_UNAVAILABLE"); }
    let current;
    let reservation: EmailChangeReservation;
    try {
      current = await readEmailChangeState(admin, identity.userId);
      const reserved = await current.admin.rpc("begin_auth_email_change_request", { p_user_id: identity.userId });
      const parsedReservation = reserved.error ? null : readReservation(reserved.data);
      if (!parsedReservation) return emailChangeReply("EMAIL_CHANGE_REQUEST_BLOCKED");
      reservation = parsedReservation;
    } catch { return emailChangeReply("AUTH_STATE_UNAVAILABLE"); }
    let markerAttempted = false;
    const action = createEmailChangeAction(fresh, identity, {
      currentPassword: body.currentPassword, newEmail: body.newEmail, redirect,
    }, async () => {
      markerAttempted = true;
      const started = await current.admin.rpc("mark_auth_email_change_provider_mutation_started", {
        p_user_id: identity.userId, p_generation: reservation.generation, p_correlation_id: reservation.correlationId,
      });
      return !started.error && started.data === true;
    });
    const code=await action();
    const transition = getEmailChangeRequestTransition(code);
    try {
      if (transition === "accept") {
        const accepted = await current.admin.rpc("accept_auth_email_change_request", { p_user_id: identity.userId, p_generation: reservation.generation, p_correlation_id: reservation.correlationId });
        if (accepted.error || accepted.data !== true) return emailChangeReply("EMAIL_CHANGE_STATUS_UNKNOWN");
      } else if (transition === "status_unknown") {
        const unknown = await current.admin.rpc("mark_auth_email_change_status_unknown", { p_user_id: identity.userId, p_generation: reservation.generation, p_correlation_id: reservation.correlationId });
        if (unknown.error || unknown.data !== true) return emailChangeReply("EMAIL_CHANGE_STATUS_UNKNOWN");
      } else {
        const transitionName = markerAttempted ? "fail_auth_email_change_request" : "release_auth_email_change_before_provider";
        const failed = await current.admin.rpc(transitionName, { p_user_id: identity.userId, p_generation: reservation.generation, p_correlation_id: reservation.correlationId });
        if (failed.error || failed.data !== true) return emailChangeReply("EMAIL_CHANGE_STATUS_UNKNOWN");
      }
    } catch { return emailChangeReply("EMAIL_CHANGE_STATUS_UNKNOWN"); }
    return emailChangeReply(code);
  };
}
