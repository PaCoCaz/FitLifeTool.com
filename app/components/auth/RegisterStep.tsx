// app/components/auth/RegisterStep.tsx

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onSuccess: () => void;
};

export default function RegisterStep({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
        });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    onSuccess(); // 👉 GA NAAR STAP 2
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Voornaam"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="text"
        placeholder="Achternaam"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="email"
        placeholder="E-mailadres"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="
          w-full rounded-[var(--radius)]
          bg-[#191970] py-2 text-white
          hover:bg-[#0BA4E0]
        "
      >
        {loading ? "Bezig…" : "Volgende"}
      </button>
    </div>
  );
}
