"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  EMAIL_CONFIRMATION_COOLDOWN_SECONDS,
  type EmailConfirmationPresentationState,
} from "@/lib/auth/emailConfirmation";
import { validateRegistrationEmail } from "@/lib/auth/registration";
import type { AppLanguage } from "@/lib/languagePreference";
import { getPublicAuthHref } from "@/lib/publicWeb";
import { uiText } from "@/lib/uiText";

type Props =
  | {
      mode: "registration";
      language: AppLanguage;
      email: string;
    }
  | {
      mode: "recovery";
      language: AppLanguage;
      state: EmailConfirmationPresentationState;
    };

type PublicResultCode =
  | "CONFIRMATION_RESEND_ACCEPTED"
  | "CONFIRMATION_RESEND_UNAVAILABLE";

export default function EmailConfirmationPanel(props: Props) {
  const inputId = useId();
  const requestInFlight = useRef(false);
  const t = uiText[props.language].auth;
  const [email, setEmail] = useState(
    props.mode === "registration" ? props.email : ""
  );
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "accepted" | "unavailable">(
    "idle"
  );
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1_000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const resend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestInFlight.current || cooldownSeconds > 0) return;

    const validation = validateRegistrationEmail(email);
    if (validation) {
      setEmailError(
        validation === "REG_EMAIL_REQUIRED"
          ? t.registrationErrors.emailRequired
          : t.registrationErrors.emailInvalid
      );
      setResult("idle");
      requestAnimationFrame(() => document.getElementById(inputId)?.focus());
      return;
    }

    requestInFlight.current = true;
    setEmailError(null);
    setResult("idle");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), language: props.language }),
      });
      const body = (await response.json()) as { code?: PublicResultCode };

      if (response.ok && body.code === "CONFIRMATION_RESEND_ACCEPTED") {
        setResult("accepted");
        setCooldownSeconds(EMAIL_CONFIRMATION_COOLDOWN_SECONDS);
        if (props.mode === "recovery") setEmail("");
      } else {
        setResult("unavailable");
      }
    } catch {
      setResult("unavailable");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const isRegistration = props.mode === "registration";
  const unavailablePage =
    props.mode === "recovery" && props.state === "unavailable";
  const heading = isRegistration
    ? t.checkEmailTitle
    : unavailablePage
      ? t.confirmationUnavailableTitle
      : t.confirmationInvalidTitle;
  const explanation = isRegistration
    ? t.checkEmailMessage.replace("{{email}}", props.email)
    : unavailablePage
      ? t.confirmationUnavailableMessage
      : t.confirmationInvalidMessage;
  const resultMessage =
    result === "accepted"
      ? isRegistration
        ? t.confirmationResendSuccess
        : t.confirmationRecoveryNeutralResult
      : result === "unavailable"
        ? t.confirmationResendFailure
        : null;

  return (
    <section className="space-y-4" lang={props.language}>
      <div className="space-y-2" role="status">
        {isRegistration ? (
          <h3 className="text-lg font-semibold text-[#191970]">{heading}</h3>
        ) : (
          <h1 className="text-lg font-semibold text-[#191970]">{heading}</h1>
        )}
        <p className="text-sm text-gray-600">{explanation}</p>
        {isRegistration && (
          <p className="text-sm text-gray-600">
            {t.confirmationSpamGuidance}
          </p>
        )}
        {!isRegistration && (
          <p className="text-sm text-gray-600">
            {t.confirmationRecoveryGuidance}
          </p>
        )}
      </div>

      <form className="space-y-3" onSubmit={resend} noValidate>
        {!isRegistration && (
          <div>
            <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
              {t.email}
            </label>
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError(null);
                setResult("idle");
              }}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? `${inputId}-error` : undefined}
              className="w-full rounded border px-3 py-2 text-base"
            />
            {emailError && (
              <p
                id={`${inputId}-error`}
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {emailError}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || cooldownSeconds > 0}
          className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white transition hover:bg-[#0BA4E0] disabled:opacity-50"
        >
          {loading
            ? isRegistration
              ? t.confirmationResending
              : t.confirmationRecoverySubmitting
            : cooldownSeconds > 0
              ? t.confirmationResendCooldown.replace(
                  "{{seconds}}",
                  String(cooldownSeconds)
                )
              : isRegistration
                ? t.confirmationResend
                : t.confirmationRecoverySubmit}
        </button>
      </form>

      {resultMessage && (
        <p
          className={`text-sm ${
            result === "accepted" ? "text-green-700" : "text-red-600"
          }`}
          role={result === "accepted" ? "status" : "alert"}
        >
          {resultMessage}
        </p>
      )}

      {!isRegistration && (
        <Link
          href={getPublicAuthHref("login", props.language)}
          className="inline-block text-sm text-[#191970] hover:underline"
        >
          {t.backToLogin}
        </Link>
      )}
    </section>
  );
}
