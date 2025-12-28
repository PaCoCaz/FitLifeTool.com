"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          Wachtwoord vergeten
        </h1>

        {submitted ? (
          <p className="text-sm text-gray-600">
            Als dit e-mailadres bestaat, ontvang je een e-mail met
            instructies om je wachtwoord te resetten.
          </p>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition"
            >
              {loading ? "Versturen…" : "Reset-link sturen"}
            </button>
          </div>
        )}

        <div className="mt-4 text-sm">
          <Link href="/login" className="text-[#191970] hover:underline">
            Terug naar inloggen
          </Link>
        </div>
      </div>
    </main>
  );
}
