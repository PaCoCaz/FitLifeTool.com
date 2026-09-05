"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import {
  completePasswordRecoveryApplicationCleanup,
  initializePasswordRecoveryLocation,
} from "@/lib/auth/passwordRecovery";
import {
  createPasswordRecoveryAction,
  executePasswordRecoverySubmission,
  type PasswordRecoveryAction,
  type PasswordRecoveryResult,
} from "@/lib/auth/passwordRecoveryClient";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/passwordPolicy";
import { notifyClientSessionEvent } from "@/lib/auth/clientSessionLifecycle";
import type { AppLanguage } from "@/lib/languagePreference";
import { getPublicAuthHref } from "@/lib/publicWeb";
import { uiText } from "@/lib/uiText";

type ViewState =
  | "READY"
  | "RECOVERY_LINK_INVALID"
  | PasswordRecoveryResult
  | "PASSWORD_VALIDATION_FAILED";
type FieldErrors = { password?: string; confirmation?: string };

export default function ResetPasswordClient() {
  const initialized = useRef(false);
  const requestInFlight = useRef(false);
  const tokenHash = useRef<string | null>(null);
  const recoveryAction = useRef<PasswordRecoveryAction | null>(null);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [state, setState] = useState<ViewState | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const t = uiText[language].auth;

  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const parsed = initializePasswordRecoveryLocation(
      window.location.href,
      (path) => window.history.replaceState(null, "", path)
    );
    setLanguage(parsed.language);
    if (!parsed.valid) {
      setState("RECOVERY_LINK_INVALID");
      return;
    }
    tokenHash.current = parsed.tokenHash;
    setState("READY");
  }, []);

  function clearSensitiveState() {
    tokenHash.current = null;
    setPassword("");
    setConfirmation("");
    setFieldErrors({});
  }

  async function finishApplicationCleanup(
    action: PasswordRecoveryAction,
    retryRecoveryCleanup: boolean
  ) {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    try {
      if (retryRecoveryCleanup) {
        const cleanupResult = await action.retryCleanup();
        if (cleanupResult !== "PASSWORD_RESET_COMPLETED") {
          setState("PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED");
          return;
        }
      }

      const cleanup = await completePasswordRecoveryApplicationCleanup(language, {
        requestLogout: (endpoint, init) => fetch(endpoint, init),
        notifyLogout: () => notifyClientSessionEvent("logout"),
        clearSensitiveState: () => {
          recoveryAction.current = null;
          clearSensitiveState();
          setState("PASSWORD_RESET_COMPLETED");
        },
        navigate: (destination) => window.location.assign(destination),
      });
      if (cleanup !== "completed") {
        clearSensitiveState();
        setState("PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED");
      }
    } catch {
      clearSensitiveState();
      setState("PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current || !tokenHash.current) return;

    requestInFlight.current = true;
    setLoading(true);
    setFieldErrors({});
    setState("READY");
    try {
      const submission = await executePasswordRecoverySubmission(
        { tokenHash: tokenHash.current, password, confirmation },
        () => createPasswordRecoveryAction({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        })
      );
      if (submission.kind === "validation") {
        const errors: FieldErrors = submission.field === "password"
          ? {
              password: submission.code === "PASSWORD_REQUIRED"
                ? t.registrationErrors.passwordRequired
                : t.registrationErrors.passwordTooShort.replace(
                    "{{minimum}}",
                    String(PASSWORD_MIN_LENGTH)
                  ),
            }
          : {
              confirmation: submission.code === "PASSWORD_CONFIRMATION_REQUIRED"
                ? t.registrationErrors.confirmationRequired
                : t.registrationErrors.passwordMismatch,
            };
        setFieldErrors(errors);
        setState("PASSWORD_VALIDATION_FAILED");
        document.getElementById(
          submission.field === "password"
            ? "reset-password-new"
            : "reset-password-confirmation"
        )?.focus();
        return;
      }

      const { action, result } = submission;
      recoveryAction.current = action;

      if (
        result === "PASSWORD_RESET_COMPLETED" ||
        result === "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED"
      ) {
        if (result === "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED") {
          clearSensitiveState();
        }
        setState(result);
        requestInFlight.current = false;
        setLoading(false);
        await finishApplicationCleanup(
          action,
          result === "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED"
        );
        return;
      }

      setState(result);
      recoveryAction.current = null;
      if (
        result !== "RECOVERY_VERIFICATION_UNAVAILABLE" &&
        result !== "PASSWORD_RESET_UNAVAILABLE"
      ) {
        clearSensitiveState();
      }
    } catch {
      setState("RECOVERY_VERIFICATION_UNAVAILABLE");
      recoveryAction.current = null;
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }

  if (state == null) return null;

  const canShowForm = state === "READY" || state === "PASSWORD_VALIDATION_FAILED" ||
    state === "RECOVERY_VERIFICATION_UNAVAILABLE" || state === "PASSWORD_RESET_UNAVAILABLE";
  const message = state === "RECOVERY_LINK_INVALID"
    ? t.resetPasswordInvalid
    : state === "RECOVERY_LINK_EXPIRED_OR_USED"
      ? t.resetPasswordExpired
      : state === "RECOVERY_VERIFICATION_UNAVAILABLE"
        ? t.resetPasswordVerificationUnavailable
        : state === "PASSWORD_RESET_UNAVAILABLE"
          ? t.resetPasswordUnavailable
          : state === "PASSWORD_RESET_STATUS_UNKNOWN"
            ? t.resetPasswordUnknown
            : state === "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED"
              ? t.resetPasswordCleanupRequired
              : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]" lang={language}>
      <section className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">{t.resetPasswordTitle}</h1>
        {message && (
          <p className="mb-4 text-sm text-red-600" role="alert">{message}</p>
        )}

        {canShowForm && (
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="reset-password-new" className="mb-1 block text-sm text-gray-700">
                {t.resetPasswordNew}
              </label>
              <input
                id="reset-password-new"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors({});
                  if (state === "PASSWORD_VALIDATION_FAILED") setState("READY");
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "reset-password-new-error" : "reset-password-help"}
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <p id="reset-password-help" className="mt-1 text-xs text-gray-500">
                {t.passwordMinimum.replace("{{minimum}}", String(PASSWORD_MIN_LENGTH))}
              </p>
              {fieldErrors.password && (
                <p id="reset-password-new-error" role="alert" className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="reset-password-confirmation" className="mb-1 block text-sm text-gray-700">
                {t.resetPasswordConfirm}
              </label>
              <input
                id="reset-password-confirmation"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                  setFieldErrors({});
                  if (state === "PASSWORD_VALIDATION_FAILED") setState("READY");
                }}
                aria-invalid={Boolean(fieldErrors.confirmation)}
                aria-describedby={fieldErrors.confirmation ? "reset-password-confirmation-error" : undefined}
                className="w-full rounded border px-3 py-2 text-sm"
              />
              {fieldErrors.confirmation && (
                <p id="reset-password-confirmation-error" role="alert" className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmation}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition disabled:opacity-50"
            >
              {loading ? t.resetPasswordSubmitting : t.resetPasswordSubmit}
            </button>
          </form>
        )}

        {state === "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED" && recoveryAction.current && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void finishApplicationCleanup(recoveryAction.current!, true)}
            className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white disabled:opacity-50"
          >
            {t.resetPasswordRetryCleanup}
          </button>
        )}

        {!canShowForm && state !== "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED" && (
          <div className="space-y-2 text-sm">
            <Link href={getPublicAuthHref("forgot-password", language)} className="block text-[#191970] hover:underline">
              {t.resetPasswordRequestNew}
            </Link>
            <Link href={getPublicAuthHref("login", language)} className="block text-[#191970] hover:underline">
              {t.backToLogin}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
