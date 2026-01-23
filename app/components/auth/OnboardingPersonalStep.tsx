// app/components/auth/OnboardingPersonalStep.tsx

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

type Gender = "male" | "female" | "other";

type Props = {
  onNext: () => void;
};

export default function OnboardingPersonalStep({ onNext }: Props) {
  const { user } = useUser();

  const [gender, setGender] = useState<Gender | "">("");
  const [birthdate, setBirthdate] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (!gender || !birthdate) {
      setError("Vul alle velden in");
      return;
    }

    if (!user) {
      setError("Geen gebruiker gevonden");
      return;
    }

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        gender,
        birthdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Geslacht */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Geslacht
        </label>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className="w-full rounded border px-3 py-2 text-base"
        >
          <option value="">Selecteer</option>
          <option value="male">Man</option>
          <option value="female">Vrouw</option>
          <option value="other">Anders</option>
        </select>

        {gender === "other" && (
          <p className="mt-2 text-xs text-gray-500">
            In een volgende stap vragen we hoe we berekeningen
            moeten uitvoeren.
          </p>
        )}
      </div>

      {/* Geboortedatum */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Geboortedatum
        </label>

        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full rounded border px-3 py-2 text-base"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={handleNext}
        disabled={saving}
        className="
          w-full
          rounded-[var(--radius)]
          bg-[#191970]
          py-2
          text-white
          hover:bg-[#0BA4E0]
          transition
        "
      >
        {saving ? "Opslaan…" : "Volgende"}
      </button>
    </div>
  );
}
