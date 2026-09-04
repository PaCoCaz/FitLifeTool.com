"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { getClientAuthRecovery, notifyClientSessionEvent } from "@/lib/auth/clientSessionLifecycle";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Goal = "LOSE" | "MAINTAIN" | "GAIN";
type Props = { onComplete: () => void | Promise<void> };

export default function OnboardingFinalStep({ onComplete }: Props) {
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang];
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    void Promise.all([
      supabase.from("profiles").select("activity_level, goal").eq("id", user.id).maybeSingle(),
      supabase.from("user_goal_periods").select("goal_key").eq("user_id", user.id).is("end_at", null).order("start_at", { ascending: false }).limit(1).maybeSingle(),
    ]).then(([profileResult, goalResult]) => {
      if (profileResult.data?.activity_level) setActivityLevel(profileResult.data.activity_level as ActivityLevel);
      const loadedGoal = goalResult.data?.goal_key ?? profileResult.data?.goal;
      if (loadedGoal === "LOSE" || loadedGoal === "MAINTAIN" || loadedGoal === "GAIN") setGoal(loadedGoal);
    });
  }, [user]);

  async function handleFinish() {
    if (!activityLevel || !goal) return setError(t.auth.requiredFields);
    if (!user) return setError(t.auth.noUser);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityLevel, goal }),
      });
      if (!response.ok) {
        let body: unknown = null;
        try { body = await response.clone().json(); } catch { /* fail closed */ }
        const recovery = getClientAuthRecovery(response.status, body, lang);
        if (recovery.kind === "navigate") {
          if (recovery.event) notifyClientSessionEvent(recovery.event);
          window.location.assign(recovery.destination);
          return;
        }
      }
      if (!response.ok) {
        setError(t.auth.onboardingError);
        return;
      }

      const result = (await response.json()) as { destination?: unknown };
      if (result.destination !== "/dashboard") {
        setError(t.auth.onboardingError);
        return;
      }

      await onComplete();
    } catch {
      setError(t.auth.onboardingError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#191970]">{t.auth.goalTitle}</h2>
      <div><label className="mb-1 block text-sm font-medium">{t.auth.activityLevel}</label><select value={activityLevel} onChange={(event) => setActivityLevel(event.target.value as ActivityLevel)} className="w-full rounded border px-3 py-2">
        <option value="">{t.common.select}</option><option value="sedentary">{t.auth.sedentary}</option><option value="light">{t.auth.light}</option><option value="moderate">{t.auth.moderate}</option><option value="active">{t.auth.active}</option><option value="very_active">{t.auth.veryActive}</option>
      </select></div>
      <fieldset><legend className="mb-2 text-sm font-medium">{t.auth.goalQuestion}</legend><div className="space-y-2">
        <label className="flex items-center gap-2"><input type="radio" checked={goal === "LOSE"} onChange={() => setGoal("LOSE")} />{t.goals.lose}</label>
        <label className="flex items-center gap-2"><input type="radio" checked={goal === "MAINTAIN"} onChange={() => setGoal("MAINTAIN")} />{t.goals.maintain}</label>
        <label className="flex items-center gap-2"><input type="radio" checked={goal === "GAIN"} onChange={() => setGoal("GAIN")} />{t.goals.gain}</label>
      </div></fieldset>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button onClick={handleFinish} disabled={saving} className="w-full rounded bg-[#191970] py-2 text-white disabled:opacity-50">{saving ? t.auth.finishing : t.auth.finish}</button>
    </div>
  );
}
