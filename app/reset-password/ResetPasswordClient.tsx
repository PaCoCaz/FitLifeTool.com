"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const hasVerified = useRef(false);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyRecovery = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!token_hash || type !== "recovery") {
        setError("Ongeldige of verlopen reset-link.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });

      if (error) {
        setError("Ongeldige of verlopen reset-link.");
        return;
      }

      setReady(true);
    };

    verifyRecovery();
  }, [searchParams]);

  const handleReset = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  if (!ready && !error) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          Nieuw wachtwoord instellen
        </h1>

        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Nieuw wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />

            <button
              onClick={handleReset}
              disabled={loading || password.length < 8}
              className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition"
            >
              {loading ? "Opslaan…" : "Wachtwoord opslaan"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
