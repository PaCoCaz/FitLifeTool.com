"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createSupabaseRecoveryClient } from "@/lib/supabaseRecoveryClient";
import {
  PasswordRecoveryError,
  RECOVERY_PASSWORD_MIN_LENGTH,
  clearRecoveryParameters,
  getRecoveryPasswordFieldError,
  parseRecoveryCredential,
  resetPasswordFromRecovery,
  type RecoveryLanguage,
  verifyRecoveryCredential,
} from "@/lib/auth/passwordRecovery";
import { uiText } from "@/lib/uiText";
import { getPublicAuthHref } from "@/lib/publicWeb";
import { useSetInterfaceLanguage } from "@/lib/useLang";

type FieldError = "minimum" | "mismatch" | null;
type PageError = "invalid" | "failure" | null;
type CompletionState = "partial_success" | null;

type ResetPasswordClientProps = {
  language: RecoveryLanguage;
};

export default function ResetPasswordClient({
  language,
}: ResetPasswordClientProps) {
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[language].auth;
  const hasVerified = useRef(false);
  const recoveryClient = useRef<ReturnType<
    typeof createSupabaseRecoveryClient
  > | null>(null);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [recoveryUserId, setRecoveryUserId] =
    useState<string | null>(null);
  const [fieldError, setFieldError] =
    useState<FieldError>(null);
  const [error, setError] = useState<PageError>(null);
  const [completion, setCompletion] =
    useState<CompletionState>(null);

  function synchronizeFieldValidation(
    nextPassword: string,
    nextConfirmation: string
  ) {
    if (!fieldError) return;
    setFieldError(
      getRecoveryPasswordFieldError(
        nextPassword,
        nextConfirmation
      )
    );
  }

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;
    let cancelled = false;

    const verifyRecovery = async () => {
      const url = new URL(window.location.href);
      setInterfaceLanguage(language);

      const credential = parseRecoveryCredential(
        url
      );

      if (!credential) {
        window.history.replaceState(
          {},
          "",
          clearRecoveryParameters(url)
        );
        if (!cancelled) setError("invalid");
        return;
      }

      try {
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();
        const isolatedClient = createSupabaseRecoveryClient();
        recoveryClient.current = isolatedClient;
        const userId = await verifyRecoveryCredential(
          isolatedClient.auth,
          credential,
          existingSession?.user.id ?? null
        );

        if (existingSession) {
          const { error: localSignOutError } =
            await supabase.auth.signOut({ scope: "local" });

          if (localSignOutError) {
            await isolatedClient.auth.signOut({ scope: "local" });
            throw new PasswordRecoveryError(
              "INVALID_RECOVERY_CONTEXT",
              "Existing browser session could not be isolated"
            );
          }
        }

        window.history.replaceState(
          {},
          "",
          clearRecoveryParameters(url)
        );

        if (!cancelled) {
          setRecoveryUserId(userId);
          setReady(true);
        }
      } catch (verificationError) {
        if (
          verificationError instanceof PasswordRecoveryError &&
          verificationError.code === "RECOVERY_IDENTITY_MISMATCH"
        ) {
          try {
            await recoveryClient.current?.auth.signOut({
              scope: "local",
            });
          } catch {
            // The isolated client has no persistent storage to clean up.
          }
        }

        window.history.replaceState(
          {},
          "",
          clearRecoveryParameters(url)
        );
        recoveryClient.current = null;
        if (!cancelled) setError("invalid");
      }
    };

    void verifyRecovery();

    return () => {
      cancelled = true;
    };
  }, [language, setInterfaceLanguage]);

  const handleReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (loading || !recoveryUserId || !recoveryClient.current) {
      return;
    }

    setError(null);

    const validationError = getRecoveryPasswordFieldError(
      password,
      confirmation
    );

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);
    setLoading(true);

    try {
      const outcome = await resetPasswordFromRecovery(
        recoveryClient.current.auth,
        {
          recoveryUserId,
          password,
          confirmation,
        }
      );

      setRecoveryUserId(null);
      recoveryClient.current = null;
      setPassword("");
      setConfirmation("");

      if (outcome.status === "partial_success") {
        setReady(false);
        setCompletion("partial_success");
        return;
      }

      window.location.assign(
        `${getPublicAuthHref("login", language)}&auth_notice=password_reset`
      );
    } catch (resetError) {
      if (resetError instanceof PasswordRecoveryError) {
        if (resetError.code === "PASSWORD_TOO_SHORT") {
          setFieldError("minimum");
        } else if (resetError.code === "PASSWORD_MISMATCH") {
          setFieldError("mismatch");
        } else {
          console.error("Password recovery completion failed");
          setError("failure");
        }
      } else {
        console.error("Password recovery completion failed");
        setError("failure");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!ready && !error && !completion) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          {t.resetPasswordTitle}
        </h1>

        {completion === "partial_success" ? (
          <>
            <p className="text-sm text-amber-700" role="status">
              {t.passwordResetPartialSuccess}
            </p>
            <Link
              href={getPublicAuthHref("login", language)}
              className="mt-4 inline-block text-sm text-[#191970] hover:underline"
            >
              {t.loginAgain}
            </Link>
          </>
        ) : !ready ? (
          <>
            <p className="text-sm text-red-600" role="alert">
              {t.invalidRecoveryLink}
            </p>
            <Link
              href={getPublicAuthHref("login", language)}
              className="mt-4 inline-block text-sm text-[#191970] hover:underline"
            >
              {t.backToLogin}
            </Link>
          </>
        ) : (
          <form className="space-y-4" onSubmit={handleReset} noValidate>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block">{t.newPassword}</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  const value = event.target.value;
                  setPassword(value);
                  synchronizeFieldValidation(value, confirmation);
                }}
                required
                minLength={RECOVERY_PASSWORD_MIN_LENGTH}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block">{t.confirmPassword}</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  const value = event.target.value;
                  setConfirmation(value);
                  synchronizeFieldValidation(password, value);
                }}
                required
                minLength={RECOVERY_PASSWORD_MIN_LENGTH}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            <p className="text-xs text-gray-600">
              {t.passwordMinimum}
            </p>

            {fieldError && (
              <p className="text-sm text-red-600" role="alert">
                {fieldError === "minimum"
                  ? t.passwordMinimum
                  : t.passwordMismatch}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {t.passwordResetFailure}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition disabled:opacity-50"
            >
              {loading ? t.savingPassword : t.savePassword}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
