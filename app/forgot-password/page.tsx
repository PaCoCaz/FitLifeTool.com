"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getPasswordRecoveryCooldownDeadline,
  getPasswordRecoveryCooldownSeconds,
  PASSWORD_RECOVERY_COOLDOWN_SECONDS,
  PASSWORD_RECOVERY_EMAIL_MAX_LENGTH,
} from "@/lib/auth/passwordRecovery";
import { validateRegistrationEmail } from "@/lib/auth/registration";
import { asAppLanguage } from "@/lib/languagePreference";
import { uiText } from "@/lib/uiText";
import { getPublicAuthHref } from "@/lib/publicWeb";
import { useLang, useSetInterfaceLanguage } from "@/lib/useLang";

type RequestState = "idle" | "accepted" | "unavailable";

export default function ForgotPasswordPage() {
  const lang = useLang();
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[lang].auth;
  const requestInFlight = useRef(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [state, setState] = useState<RequestState>("idle");
  const [loading, setLoading] = useState(false);
  const [cooldownDeadline, setCooldownDeadline] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const requestedLanguage = asAppLanguage(
      new URL(window.location.href).searchParams.get("lang")
    );
    if (requestedLanguage) setInterfaceLanguage(requestedLanguage);
  }, [setInterfaceLanguage]);

  useEffect(() => {
    if (!cooldownDeadline) return;
    const update = () => {
      const remaining = getPasswordRecoveryCooldownSeconds(
        cooldownDeadline,
        Date.now()
      );
      setCooldownSeconds(remaining);
      if (remaining === 0) setCooldownDeadline(0);
    };
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [cooldownDeadline]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current || cooldownSeconds > 0) return;

    const normalizedEmail = email.trim();
    if (
      normalizedEmail.length > PASSWORD_RECOVERY_EMAIL_MAX_LENGTH ||
      validateRegistrationEmail(normalizedEmail) != null
    ) {
      setEmailError(true);
      setState("idle");
      document.getElementById("forgot-password-email")?.focus();
      return;
    }

    requestInFlight.current = true;
    setLoading(true);
    setEmailError(false);
    setState("idle");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, language: lang }),
      });
      const body: unknown = await response.json();
      const code = body && typeof body === "object" && "code" in body
        ? (body as { code?: unknown }).code
        : null;
      if (response.status === 202 && code === "RECOVERY_REQUEST_ACCEPTED") {
        setEmail("");
        setState("accepted");
        setCooldownSeconds(PASSWORD_RECOVERY_COOLDOWN_SECONDS);
        setCooldownDeadline(getPasswordRecoveryCooldownDeadline(Date.now()));
      } else {
        setState("unavailable");
      }
    } catch {
      setState("unavailable");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]" lang={lang}>
      <section className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          {t.forgotPasswordTitle}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <label htmlFor="forgot-password-email" className="block text-sm text-gray-700">
            <span className="mb-1 block">{t.email}</span>
          </label>
          <input
            id="forgot-password-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError(false);
              if (state === "unavailable") setState("idle");
            }}
            required
            aria-invalid={emailError}
            aria-describedby={emailError ? "forgot-password-email-error" : undefined}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {emailError && (
            <p id="forgot-password-email-error" role="alert" className="text-sm text-red-600">
              {t.registrationErrors.emailInvalid}
            </p>
          )}
          {state === "accepted" && (
            <p className="text-sm text-green-700" role="status">{t.forgotPasswordSent}</p>
          )}
          {state === "unavailable" && (
            <p className="text-sm text-red-600" role="alert">{t.forgotPasswordUnavailable}</p>
          )}
          <button
            type="submit"
            disabled={loading || cooldownSeconds > 0}
            className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition disabled:opacity-50"
          >
            {loading
              ? t.forgotPasswordSubmitting
              : cooldownSeconds > 0
                ? t.forgotPasswordCooldown.replace("{{seconds}}", String(cooldownSeconds))
                : t.forgotPasswordSubmit}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link href={getPublicAuthHref("login", lang)} className="text-[#191970] hover:underline">
            {t.backToLogin}
          </Link>
        </div>
      </section>
    </main>
  );
}
