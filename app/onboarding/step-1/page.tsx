"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

type Gender = "male" | "female" | "other";

export default function OnboardingStep1() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [gender, setGender] = useState<Gender | "">("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleNext = async () => {
    if (!gender || !birthdate) {
      setError("Vul alle velden in");
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
      .eq("id", user!.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/onboarding/step-2");
  };

  if (loading || !user) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-2 text-lg font-semibold text-[#191970]">
          Vertel iets over jezelf
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Deze gegevens gebruiken we om je doelen goed te berekenen.
        </p>

        <div className="space-y-4">
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
            className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] transition"
          >
            {saving ? "Opslaan…" : "Volgende"}
          </button>
        </div>
      </div>
    </main>
  );
}
