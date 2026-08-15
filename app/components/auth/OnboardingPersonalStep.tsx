"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

type Gender = "male" | "female" | "other";
type Props = { onNext: () => void | Promise<void> };

export default function OnboardingPersonalStep({ onNext }: Props) {
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang].auth;
  const [gender, setGender] = useState<Gender | "">("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    void supabase.from("profiles").select("gender, birthdate").eq("id", user.id).maybeSingle().then((result: { data: { gender: string | null; birthdate: string | null } | null }) => {
      const { data } = result;
      if (data?.gender) setGender(data.gender as Gender);
      if (data?.birthdate) setBirthdate(data.birthdate);
    });
  }, [user]);

  async function handleNext() {
    if (!gender || !birthdate) return setError(t.requiredFields);
    if (!user) return setError(t.noUser);
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase.from("profiles").update({ gender, birthdate, updated_at: new Date().toJSON() }).eq("id", user.id);
    setSaving(false);
    if (updateError) return setError(updateError.message);
    await onNext();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#191970]">{t.personalTitle}</h2>
      <div>
        <label className="mb-1 block text-sm font-medium">{t.gender}</label>
        <select value={gender} onChange={(event) => setGender(event.target.value as Gender)} className="w-full rounded border px-3 py-2 text-base">
          <option value="">{uiText[lang].common.select}</option>
          <option value="male">{t.male}</option><option value="female">{t.female}</option><option value="other">{t.other}</option>
        </select>
        {gender === "other" && <p className="mt-2 text-xs text-gray-500">{t.calculationNote}</p>}
      </div>
      <div><label className="mb-1 block text-sm font-medium">{t.birthdate}</label><input type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} className="w-full rounded border px-3 py-2 text-base" /></div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button onClick={handleNext} disabled={saving} className="w-full rounded bg-[#191970] py-2 text-white disabled:opacity-50">{saving ? t.saving : t.next}</button>
    </div>
  );
}
