"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { PASSWORD_CHANGE_MIN_LENGTH } from "@/lib/auth/passwordChange";
import { uiText } from "@/lib/uiText";
import type { Lang } from "@/lib/useLang";

type CompletionState = "success" | "partial_success" | null;

type Props = {
  language: Lang;
};

type ErrorCode =
  | "UNAUTHENTICATED"
  | "REAUTHENTICATION_FAILED"
  | "PASSWORD_TOO_SHORT"
  | "PASSWORD_MISMATCH"
  | "PASSWORD_CHANGE_FAILED";

export default function PasswordChangeCard({ language }: Props) {
  const text = uiText[language];
  const t = text.settings.passwordChange;
  const submissionInProgress = useRef(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<CompletionState>(null);

  function messageForError(code: ErrorCode) {
    if (code === "UNAUTHENTICATED") return t.unauthenticated;
    if (code === "REAUTHENTICATION_FAILED") {
      return t.reauthenticationFailed;
    }
    if (code === "PASSWORD_TOO_SHORT") return text.auth.passwordMinimum;
    if (code === "PASSWORD_MISMATCH") return text.auth.passwordMismatch;
    return t.failure;
  }

  function synchronizePasswordValidation(
    nextNewPassword: string,
    nextConfirmation: string
  ) {
    if (
      error !== text.auth.passwordMinimum &&
      error !== text.auth.passwordMismatch
    ) {
      return;
    }

    if (
      nextNewPassword.length < PASSWORD_CHANGE_MIN_LENGTH ||
      nextConfirmation.length < PASSWORD_CHANGE_MIN_LENGTH
    ) {
      setError(text.auth.passwordMinimum);
      return;
    }

    setError(
      nextNewPassword === nextConfirmation
        ? null
        : text.auth.passwordMismatch
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current || completion) return;

    if (!currentPassword) {
      setError(t.currentPasswordRequired);
      return;
    }

    if (
      newPassword.length < PASSWORD_CHANGE_MIN_LENGTH ||
      confirmation.length < PASSWORD_CHANGE_MIN_LENGTH
    ) {
      setError(text.auth.passwordMinimum);
      return;
    }

    if (newPassword !== confirmation) {
      setError(text.auth.passwordMismatch);
      return;
    }

    submissionInProgress.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmation,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        code?: ErrorCode;
        status?: CompletionState;
      };

      if (!response.ok || !result.ok) {
        setError(messageForError(result.code ?? "PASSWORD_CHANGE_FAILED"));
        return;
      }

      if (
        result.status !== "success" &&
        result.status !== "partial_success"
      ) {
        setError(t.failure);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setCompletion(result.status);
    } catch {
      setError(t.failure);
    } finally {
      submissionInProgress.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Card header={<CardHeader title={t.title} />}>
      <div className="space-y-4 pt-3">
        {completion ? (
          <div className="space-y-4" role="status">
            <p
              className={`text-sm ${
                completion === "success"
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {completion === "success"
                ? t.success
                : text.auth.passwordResetPartialSuccess}
            </p>
            <Link
              href={`/login?lang=${language}`}
              className="inline-flex rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
            >
              {text.auth.loginAgain}
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit} noValidate>
            <p className="text-sm text-gray-600">{t.description}</p>

            <label className="block">
              <span className="text-xs font-semibold text-gray-500">
                {t.currentPassword}
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => {
                  const value = event.target.value;
                  setCurrentPassword(value);
                  if (value && error === t.currentPasswordRequired) {
                    setError(null);
                  }
                }}
                disabled={submitting}
                required
                className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-gray-500">
                {text.auth.newPassword}
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  const value = event.target.value;
                  setNewPassword(value);
                  synchronizePasswordValidation(value, confirmation);
                }}
                disabled={submitting}
                minLength={PASSWORD_CHANGE_MIN_LENGTH}
                required
                className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2"
              />
              <span className="mt-1 block text-xs text-gray-500">
                {text.auth.passwordMinimum}
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-gray-500">
                {text.auth.confirmPassword}
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  const value = event.target.value;
                  setConfirmation(value);
                  synchronizePasswordValidation(newPassword, value);
                }}
                disabled={submitting}
                minLength={PASSWORD_CHANGE_MIN_LENGTH}
                required
                className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2"
              />
            </label>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] hover:bg-[#0095D3] hover:text-white disabled:border-gray-300 disabled:text-gray-400"
              >
                {submitting ? t.saving : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
