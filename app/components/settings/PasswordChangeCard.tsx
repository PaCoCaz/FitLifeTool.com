"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { PASSWORD_MIN_LENGTH, validatePassword, validatePasswordConfirmation } from "@/lib/auth/passwordPolicy";
import { notifyClientSessionEvent } from "@/lib/auth/clientSessionLifecycle";
import { uiText } from "@/lib/uiText";
import { useLang } from "@/lib/useLang";

type PasswordField = "currentPassword" | "newPassword" | "confirmation";
type TerminalState = "status_unknown" | "changed_cleanup_required" | null;

export function createPasswordChangeSubmissionGate() {
  let inFlight = false;
  let terminal = false;
  return {
    begin() {
      if (inFlight || terminal) return false;
      inFlight = true;
      return true;
    },
    finish() {
      inFlight = false;
    },
    lockTerminal() {
      terminal = true;
    },
    isTerminal() {
      return terminal;
    },
  };
}

const PASSWORD_CHANGE_RESPONSE_STATUS = {
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
} as const;

type PasswordChangeResponseCode = keyof typeof PASSWORD_CHANGE_RESPONSE_STATUS;

function parsePasswordChangeResponse(status: number, body: unknown): PasswordChangeResponseCode | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  if (Object.keys(record).length !== 1 || typeof record.code !== "string") return null;
  if (!(record.code in PASSWORD_CHANGE_RESPONSE_STATUS)) return null;
  const code = record.code as PasswordChangeResponseCode;
  return PASSWORD_CHANGE_RESPONSE_STATUS[code] === status ? code : null;
}

export default function PasswordChangeCard({ available }: { available: boolean }) {
  const language = useLang();
  const t = uiText[language].auth;
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const submissionGate = useRef(createPasswordChangeSubmissionGate());
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fieldError, setFieldError] = useState<Partial<Record<PasswordField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [terminal, setTerminal] = useState<TerminalState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);

  const withMinimum = (value: string) =>
    value.replace("{{minimum}}", String(PASSWORD_MIN_LENGTH));

  function clearPasswords() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
  }

  function lockAmbiguousOutcome() {
    submissionGate.current.lockTerminal();
    clearPasswords();
    setTerminal("status_unknown");
  }

  async function finishLocalLogout(destination: string, mutationProvenChanged: boolean) {
    if (cleaningUp) return false;
    setCleaningUp(true);
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const body: unknown = await response.json();
      if (!response.ok || (body as { code?: unknown })?.code !== "LOGOUT_COMPLETED") {
        setTerminal(mutationProvenChanged ? "changed_cleanup_required" : "status_unknown");
        return false;
      }
      notifyClientSessionEvent("logout");
      window.location.assign(destination);
      return true;
    } catch {
      setTerminal(mutationProvenChanged ? "changed_cleanup_required" : "status_unknown");
      return false;
    } finally {
      setCleaningUp(false);
    }
  }

  function validate(): boolean {
    const errors: Partial<Record<PasswordField, string>> = {};
    if (!currentPassword) errors.currentPassword = t.passwordChangeCurrentRequired;
    const password = validatePassword(newPassword);
    if (!password.valid) {
      errors.newPassword = password.code === "PASSWORD_REQUIRED"
        ? t.passwordChangeNewRequired
        : withMinimum(t.passwordMinimum);
    }
    const confirmationResult = validatePasswordConfirmation(newPassword, confirmation);
    if (!errors.newPassword && !confirmationResult.valid) {
      errors.confirmation = confirmationResult.code === "PASSWORD_CONFIRMATION_REQUIRED"
        ? t.passwordChangeConfirmationRequired
        : t.passwordChangeMismatch;
    }
    setFieldError(errors);
    const first = Object.keys(errors)[0] as PasswordField | undefined;
    if (first === "currentPassword") currentRef.current?.focus();
    if (first === "newPassword") newRef.current?.focus();
    if (first === "confirmation") confirmationRef.current?.focus();
    return !first;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || !validate() || !submissionGate.current.begin()) return;
    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmation }),
      });
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        lockAmbiguousOutcome();
        return;
      }
      const code = parsePasswordChangeResponse(response.status, body);
      if (!code) {
        lockAmbiguousOutcome();
        return;
      }

      if (code === "PASSWORD_CHANGE_COMPLETED") {
        submissionGate.current.lockTerminal();
        clearPasswords();
        await finishLocalLogout(`/login?lang=${language}&auth_notice=password_changed`, true);
        return;
      }
      if (code === "PASSWORD_CHANGE_COMPLETED_CLEANUP_REQUIRED") {
        submissionGate.current.lockTerminal();
        clearPasswords();
        setTerminal("changed_cleanup_required");
        return;
      }
      if (code === "PASSWORD_CHANGE_STATUS_UNKNOWN") {
        lockAmbiguousOutcome();
        return;
      }
      if (code === "PASSWORD_CHANGE_REAUTH_FAILED") {
        setFieldError({ currentPassword: t.passwordChangeCurrentIncorrect });
        currentRef.current?.focus();
        return;
      }
      if (code === "PASSWORD_VALIDATION_FAILED") {
        setFieldError({ newPassword: t.passwordChangeValidationFailed });
        newRef.current?.focus();
        return;
      }
      if (code === "PASSWORD_CHANGE_REAUTH_REQUIRED") {
        setFormError(t.passwordChangeSessionRequired);
        return;
      }
      if (code === "PASSWORD_CHANGE_NOT_AVAILABLE") {
        setFormError(t.passwordChangeUnavailableMethod);
        return;
      }
      if (code === "INVALID_REQUEST" || code === "ORIGIN_NOT_ALLOWED" ||
          code === "PASSWORD_CHANGE_UNAVAILABLE" || code === "AUTH_STATE_UNAVAILABLE") {
        setFormError(t.passwordChangeUnavailable);
        return;
      }
      lockAmbiguousOutcome();
    } catch {
      lockAmbiguousOutcome();
    } finally {
      submissionGate.current.finish();
      setSubmitting(false);
    }
  }

  const fieldProps = (field: PasswordField, errorId: string, helperId?: string) => ({
    "aria-invalid": Boolean(fieldError[field]),
    "aria-describedby": [helperId, fieldError[field] ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined,
  });

  return (
    <Card header={<CardHeader title={t.passwordChangeTitle} />}>
      <div className="space-y-4 pt-3">
        {!available ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{t.passwordChangeUnavailableMethod}</p>
            <button type="button" disabled className="rounded-[var(--radius)] border border-gray-300 px-4 py-2 text-sm text-gray-400">
              {t.passwordChangeSubmit}
            </button>
          </div>
        ) : terminal ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-amber-800">
              {terminal === "status_unknown"
                ? t.passwordChangeUnknown
                : t.passwordChangeCleanupRequired}
            </p>
            <button
              type="button"
              disabled={cleaningUp}
              onClick={() => void finishLocalLogout(
                terminal === "status_unknown"
                  ? `/login?lang=${language}`
                  : `/login?lang=${language}&auth_notice=password_changed`,
                terminal === "changed_cleanup_required"
              )}
              className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] disabled:opacity-50"
            >
              {cleaningUp ? t.passwordChangeCleaningUp : t.passwordChangeRetryCleanup}
            </button>
            {terminal === "status_unknown" && (
              <Link href={`/forgot-password?lang=${language}`} className="block text-sm text-[#191970] hover:underline">
                {t.passwordChangeUseRecovery}
              </Link>
            )}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <p className="text-sm text-gray-600">{t.passwordChangeDescription}</p>

            <div>
              <label htmlFor="password-change-current" className="block text-xs font-semibold text-gray-500">{t.passwordChangeCurrent}</label>
              <input ref={currentRef} id="password-change-current" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} disabled={submitting} {...fieldProps("currentPassword", "password-change-current-error")} className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2" />
              {fieldError.currentPassword && <p id="password-change-current-error" role="alert" className="mt-1 text-sm text-red-600">{fieldError.currentPassword}</p>}
            </div>

            <div>
              <label htmlFor="password-change-new" className="block text-xs font-semibold text-gray-500">{t.passwordChangeNew}</label>
              <input ref={newRef} id="password-change-new" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={submitting} {...fieldProps("newPassword", "password-change-new-error", "password-change-helper")} className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2" />
              <p id="password-change-helper" className="mt-1 text-xs text-gray-500">{withMinimum(t.passwordMinimum)}</p>
              {fieldError.newPassword && <p id="password-change-new-error" role="alert" className="mt-1 text-sm text-red-600">{fieldError.newPassword}</p>}
            </div>

            <div>
              <label htmlFor="password-change-confirmation" className="block text-xs font-semibold text-gray-500">{t.passwordChangeConfirmation}</label>
              <input ref={confirmationRef} id="password-change-confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={submitting} {...fieldProps("confirmation", "password-change-confirmation-error")} className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2" />
              {fieldError.confirmation && <p id="password-change-confirmation-error" role="alert" className="mt-1 text-sm text-red-600">{fieldError.confirmation}</p>}
            </div>

            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={submitting} className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] disabled:border-gray-300 disabled:text-gray-400">
                {submitting ? t.passwordChangeSubmitting : t.passwordChangeSubmit}
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
