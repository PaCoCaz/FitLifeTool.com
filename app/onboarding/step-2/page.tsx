"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

type Gender = "male" | "female" | "other";
type CalculationSex = "male" | "female";

type GenderQueryResult = {
  gender: Gender;
};

export default function OnboardingStep2() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [calculationSex, setCalculationSex] =
    useState<CalculationSex | "">("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register");
      return;
    }

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
          data: GenderQueryResult | null;
          error: { message: string } | null;
        }) => {
          if (error) {
            console.error(error.message);
            return;
          }

          if (data?.gender) {
            setGender(data.gender);

            if (data.gender === "male" || data.gender === "female") {
              setCalculationSex(data.gender);
            }
          }
        }
      );
  }, [user, loading, router]);

  const handleNext = async () => {
    if (!height || !weight) {
      setError("Vul alle velden in");
      return;
    }

    if (gender === "other" && !calculationSex) {
      setError("Kies hoe we de berekening moeten uitvoeren");
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
      .eq("id", user!.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/onboarding/step-3");
  };

  if (loading || !user || !gender) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-2 text-lg font-semibold text-[#191970]">
          Lichaamsgegevens
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Deze gegevens gebruiken we om je energie- en voedingsbehoeften
          te berekenen.
        </p>

        <div className="space-y-4">
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
              className="w-full rounded border px-3 py-2 text-base"
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
              className="w-full rounded border px-3 py-2 text-base"
            />
          </div>

          {/* Alleen bij gender = other */}
          {gender === "other" && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Berekening baseren op
              </label>

              <div className="space-y-2 text-base">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="calculationSex"
                    value="male"
                    checked={calculationSex === "male"}
                    onChange={() => setCalculationSex("male")}
                  />
                  Man
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="calculationSex"
                    value="female"
                    checked={calculationSex === "female"}
                    onChange={() => setCalculationSex("female")}
                  />
                  Vrouw
                </label>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Deze keuze gebruiken we uitsluitend voor berekeningen.
                Er bestaan geen wetenschappelijk gevalideerde
                genderneutrale formules.
              </p>
            </div>
          )}

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
