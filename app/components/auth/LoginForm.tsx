// app/components/auth/LoginForm.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uiText } from "@/lib/uiText";
import type { Lang } from "@/lib/useLang";

type Props = {
  language: Lang;
  onRegister?: () => void;
};

export default function LoginForm({ language, onRegister }: Props) {
  const t = uiText[language].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // 🔑 Hard redirect → voorkomt auth race conditions
    window.location.assign("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder={t.email}
        aria-label={t.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border px-4 py-3"
      />

      <input
        type="password"
        placeholder={t.password}
        aria-label={t.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded border px-4 py-3"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-[var(--radius)]
          bg-[#191970]
          py-3
          text-white
          font-medium
          hover:bg-[#0BA4E0]
          transition
          disabled:opacity-50
        "
      >
        {loading ? t.loggingIn : t.login}
      </button>

      <div className="flex justify-between text-sm pt-2">
        <a
          href={`/forgot-password?lang=${language}`}
          className="hover:underline"
        >
          {t.forgotPasswordTitle}
        </a>

        {onRegister ? (
          <button
            type="button"
            onClick={onRegister}
            className="hover:underline font-medium text-[#191970]"
          >
            {t.accountTitle}
          </button>
        ) : (
          <Link
            href={`/register?lang=${language}`}
            className="hover:underline font-medium text-[#191970]"
          >
            {t.accountTitle}
          </Link>
        )}
      </div>
    </form>
  );
}
