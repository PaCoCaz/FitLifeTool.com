import { getLocalizedPublicHome } from "./sessionLifecycle";
export function createEmailChangeSubmissionGate() {
  let inFlight = false, terminal = false;
  return { begin() { if (inFlight || terminal) return false; inFlight = true; return true; }, finish() { inFlight = false; }, lock() { terminal = true; } };
}
export function parseEmailChangeResponse(status: number, body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).join(",") !== "code") return null;
  const code = (body as { code?: unknown }).code;
  if (status === 202 && (code === "EMAIL_CHANGE_REQUEST_ACCEPTED" || code === "EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED")) return code;
  return status === 409 && code === "EMAIL_CHANGE_STATUS_UNKNOWN" ? code : null;
}
export function parseLocalCleanup(status: number, body: unknown, language: unknown) {
  if (status !== 200 || !body || typeof body !== "object" || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>, destination = getLocalizedPublicHome(language);
  return Object.keys(record).sort().join(",") === "code,destination" &&
    record.code === "LOGOUT_COMPLETED" && record.destination === destination ? destination : null;
}
