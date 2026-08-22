"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { asRecoveryLanguage } from "@/lib/auth/passwordRecovery";
import { uiText } from "@/lib/uiText";
import { getPublicAuthHref } from "@/lib/publicWeb";
import {
  useLang,
  useSetInterfaceLanguage,
} from "@/lib/useLang";

export default function ForgotPasswordPage() {
  const lang = useLang();
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[lang].auth;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestedLanguage = asRecoveryLanguage(
      new URL(window.location.href).searchParams.get("lang")
    );

    if (requestedLanguage) {
      setInterfaceLanguage(requestedLanguage);
    }
  }, [setInterfaceLanguage]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, language: lang }),
      });
    } catch {
      console.error("Password recovery request failed");
    } finally {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          {t.forgotPasswordTitle}
        </h1>

        {submitted ? (
          <p className="text-sm text-gray-600" role="status">
            {t.forgotPasswordSent}
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block">{t.email}</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition disabled:opacity-50"
            >
              {loading
                ? t.forgotPasswordSubmitting
                : t.forgotPasswordSubmit}
            </button>
          </form>
        )}

        <div className="mt-4 text-sm">
          <Link
            href={getPublicAuthHref("login", lang)}
            className="text-[#191970] hover:underline"
          >
            {t.backToLogin}
          </Link>
        </div>
      </div>
    </main>
  );
}
