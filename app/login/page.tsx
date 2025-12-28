"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          Inloggen
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-base"
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 text-base"
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={submitting}
            className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition"
          >
            {submitting ? "Inloggen…" : "Inloggen"}
          </button>
        </div>

        {/* 👇 HIER hoort dit blok */}
        <div className="mt-4 text-sm flex justify-between">
          <Link
            href="/forgot-password"
            className="text-[#191970] hover:underline"
          >
            Wachtwoord vergeten?
          </Link>

          <Link
            href="/register"
            className="text-[#191970] hover:underline"
          >
            Account aanmaken
          </Link>
        </div>
      </div>
    </main>
  );
}
