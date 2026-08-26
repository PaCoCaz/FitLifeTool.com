"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import {
  EMAIL_MAX_LENGTH,
  getEmailChangeCardMode,
  isValidEmailChangeInput,
  type EmailChangeStatusIssue,
  type EmailChangeSynchronization,
} from "@/lib/auth/emailChangeValidation";
import { uiText } from "@/lib/uiText";
import type { Lang } from "@/lib/useLang";

type Props = { language: Lang };
type ErrorCode =
  | "UNAUTHENTICATED"
  | "REAUTHENTICATION_FAILED"
  | "INVALID_EMAIL"
  | "EMAIL_UNCHANGED"
  | "EMAIL_CHANGE_BLOCKED"
  | "STATUS_UNAVAILABLE"
  | "EMAIL_CHANGE_FAILED";

export default function EmailChangeCard({ language }: Props) {
  const t = uiText[language].settings.emailChange;
  const inProgress = useRef(false);
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [synchronization, setSynchronization] =
    useState<EmailChangeSynchronization>("none");
  const [statusIssue, setStatusIssue] =
    useState<EmailChangeStatusIssue>(null);
  const [statusRequest, setStatusRequest] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setStatusIssue(null);

    void fetch("/api/auth/change-email", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as {
          ok?: boolean;
          confirmedEmail?: string | null;
          confirmationPending?: boolean;
          synchronization?: typeof synchronization;
        };
        if (!active) return;
        if (!response.ok || !result.ok) {
          setStatusIssue("unavailable");
          return;
        }
        setConfirmedEmail(result.confirmedEmail ?? null);
        setConfirmationPending(Boolean(result.confirmationPending));
        setSynchronization(result.synchronization ?? "none");
      })
      .catch(() => {
        if (active) setStatusIssue("unavailable");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [statusRequest]);

  function errorMessage(code: ErrorCode) {
    if (code === "REAUTHENTICATION_FAILED") return t.reauthenticationFailed;
    if (code === "INVALID_EMAIL") return t.invalidEmail;
    if (code === "EMAIL_UNCHANGED") return t.unchangedEmail;
    return t.failure;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      inProgress.current ||
      confirmationPending ||
      synchronization === "pending" ||
      synchronization === "manual_review"
    ) return;

    if (!currentPassword) {
      setError(t.currentPasswordRequired);
      return;
    }
    if (!isValidEmailChangeInput(newEmail)) {
      setError(t.invalidEmail);
      return;
    }
    if (
      confirmedEmail &&
      confirmedEmail.trim().toLowerCase() === newEmail.trim().toLowerCase()
    ) {
      setError(t.unchangedEmail);
      return;
    }

    inProgress.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newEmail, language }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        code?: ErrorCode;
        status?: string;
      };

      if (!response.ok || !result.ok || result.status !== "pending_confirmation") {
        if (result.code === "STATUS_UNAVAILABLE") {
          setStatusIssue("unavailable");
          return;
        }
        if (result.code === "EMAIL_CHANGE_BLOCKED") {
          setStatusIssue("blocked");
          return;
        }
        setError(errorMessage(result.code ?? "EMAIL_CHANGE_FAILED"));
        return;
      }

      setCurrentPassword("");
      setNewEmail("");
      setConfirmationPending(true);
    } catch {
      setError(t.failure);
    } finally {
      inProgress.current = false;
      setSubmitting(false);
    }
  }

  const cardMode = getEmailChangeCardMode({
    loading,
    statusIssue,
    status: { confirmationPending, synchronization },
  });

  return (
    <Card header={<CardHeader title={t.title} />}>
      <div className="space-y-4 pt-3">
        {cardMode === "loading" ? (
          <p className="text-sm text-gray-600" role="status">{t.loading}</p>
        ) : cardMode === "status_error" ? (
          <div className="space-y-3">
            <p className="text-sm text-red-700" role="alert">
              {statusIssue === "blocked" ? t.requestBlocked : t.statusUnavailable}
            </p>
            <button
              type="button"
              onClick={() => setStatusRequest((value) => value + 1)}
              className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
            >
              {t.retryStatus}
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit} noValidate>
            <p className="text-sm text-gray-600">{t.description}</p>
            {confirmedEmail && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{t.currentEmail}:</span>{" "}
                {confirmedEmail}
              </p>
            )}

            {cardMode === "confirmation_pending" ? (
              <p className="text-sm text-amber-700" role="status">{t.pending}</p>
            ) : cardMode === "synchronization_pending" ? (
              <p className="text-sm text-amber-700" role="status">{t.synchronizationPending}</p>
            ) : cardMode === "manual_review" ? (
              <p className="text-sm text-red-700" role="alert">{t.synchronizationReview}</p>
            ) : (
              <>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-500">{t.currentPassword}</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setError(null);
                    }}
                    required
                    disabled={submitting}
                    className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-500">{t.newEmail}</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={newEmail}
                    maxLength={EMAIL_MAX_LENGTH}
                    onChange={(event) => {
                      setNewEmail(event.target.value);
                      setError(null);
                    }}
                    required
                    disabled={submitting}
                    className="mt-1 w-full rounded-[var(--radius)] border border-gray-300 px-3 py-2"
                  />
                </label>
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-sm text-[#0095D3] hover:bg-[#0095D3] hover:text-white disabled:border-gray-300 disabled:text-gray-400"
                  >
                    {submitting ? t.saving : t.submit}
                  </button>
                </div>
              </>
            )}

          </form>
        )}
      </div>
    </Card>
  );
}
