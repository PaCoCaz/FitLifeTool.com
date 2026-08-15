"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { calculateBMI } from "@/lib/calculations";
import type { OnboardingProfile } from "@/lib/auth/onboardingState";

type Gender = "male" | "female" | "other";
type CalculationSex = "male" | "female";
type Props = {
  profile: OnboardingProfile;
  onNext: () => void | Promise<void>;
};

export default function OnboardingBodyStep({ profile, onNext }: Props) {
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang].auth;
  const gender = profile.gender as Gender;
  const [height, setHeight] = useState(
    profile.height_cm == null ? "" : String(profile.height_cm)
  );
  const [weight, setWeight] = useState(
    profile.weight_kg == null ? "" : String(profile.weight_kg)
  );
  const [calculationSex, setCalculationSex] = useState<CalculationSex | "">(
    profile.calculation_sex === "male" || profile.calculation_sex === "female"
      ? profile.calculation_sex
      : gender === "male" || gender === "female"
        ? gender
        : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const heightCm = Number(height);
  const weightKg = Number(weight);
  const bmi =
    height &&
    weight &&
    Number.isFinite(heightCm) &&
    Number.isFinite(weightKg) &&
    heightCm > 0 &&
    weightKg > 0
      ? calculateBMI(weightKg, heightCm)
      : null;

  async function handleNext() {
    if (bmi == null || !calculationSex) return setError(t.requiredFields);
    if (!user) return setError(t.noUser);
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase.from("profiles").update({
      height_cm: heightCm, weight_kg: weightKg, calculation_sex: calculationSex, updated_at: new Date().toJSON(),
    }).eq("id", user.id);
    setSaving(false);
    if (updateError) return setError(updateError.message);
    await onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#191970]">{t.bodyTitle}</h2>
      <div><label className="mb-1 block text-sm font-medium">{t.height}</label><input type="number" inputMode="numeric" value={height} onChange={(event) => setHeight(event.target.value)} className="w-full rounded border px-3 py-2" /></div>
      <div><label className="mb-1 block text-sm font-medium">{t.weight}</label><input type="number" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} className="w-full rounded border px-3 py-2" /></div>
      {bmi != null && (
        <p className="text-sm text-gray-600">
          {uiText[lang].weight.bmi}: {bmi.toFixed(1)}
        </p>
      )}
      {gender === "other" && (
        <fieldset><legend className="mb-1 text-sm font-medium">{t.calculationBasedOn}</legend><div className="space-y-2">
          <label className="flex items-center gap-2"><input type="radio" checked={calculationSex === "male"} onChange={() => setCalculationSex("male")} />{t.male}</label>
          <label className="flex items-center gap-2"><input type="radio" checked={calculationSex === "female"} onChange={() => setCalculationSex("female")} />{t.female}</label>
        </div></fieldset>
      )}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button onClick={handleNext} disabled={saving} className="w-full rounded bg-[#191970] py-2 text-white disabled:opacity-50">{saving ? t.saving : t.next}</button>
    </div>
  );
}
