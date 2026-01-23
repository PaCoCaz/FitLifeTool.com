// app/components/auth/OnboardingBodyStep.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

type Gender = "male" | "female" | "other";
type CalculationSex = "male" | "female";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function OnboardingBodyStep({ onNext, onBack }: Props) {
  const { user } = useUser();

  const [gender, setGender] = useState<Gender | null>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [calculationSex, setCalculationSex] =
    useState<CalculationSex | "">("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ───────────────── Init ───────────────── */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("gender")
      .eq("id", user.id)
      .single()
      .then(
        ({
          data,
          error,
        }: {
          data: { gender: Gender } | null;
          error: { message: string } | null;
        }) => {
          if (error || !data) return;

          setGender(data.gender);

          if (data.gender === "male" || data.gender === "female") {
            setCalculationSex(data.gender);
          }
        }
      );
  }, [user]);

  /* ───────────────── Handler ───────────────── */

  const handleNext = async () => {
    if (!height || !weight) {
      setError("Vul alle velden in");
      return;
    }

    if (gender === "other" && !calculationSex) {
      setError(
        "Kies hoe we de berekeningen moeten uitvoeren"
      );
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
        height_cm: Number(height),
        weight_kg: Number(weight),
        calculation_sex: calculationSex,
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

  if (!gender) return null;

  /* ───────────────── Render ───────────────── */

  return (
    <div className="space-y-6">
      {/* Lengte */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Lengte (cm)
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* Gewicht */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Gewicht (kg)
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* Calculation sex bij gender = other */}
      {gender === "other" && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Berekening baseren op
          </label>

          <div className="space-y-2 text-base">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={calculationSex === "male"}
                onChange={() =>
                  setCalculationSex("male")
                }
              />
              Man
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={calculationSex === "female"}
                onChange={() =>
                  setCalculationSex("female")
                }
              />
              Vrouw
            </label>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Deze keuze gebruiken we uitsluitend voor
            gezondheidsberekeningen.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-500"
        >
          Terug
        </button>

        <button
          onClick={handleNext}
          disabled={saving}
          className="
            rounded-[var(--radius)]
            bg-[#191970]
            px-4 py-2
            text-sm
            font-medium
            text-white
            hover:bg-[#0BA4E0]
          "
        >
          {saving ? "Opslaan…" : "Volgende"}
        </button>
      </div>
    </div>
  );
}
