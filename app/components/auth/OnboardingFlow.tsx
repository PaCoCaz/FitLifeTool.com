"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelect from "@/components/auth/CountrySelect";
import OnboardingPersonalStep from "@/components/auth/OnboardingPersonalStep";
import OnboardingBodyStep from "@/components/auth/OnboardingBodyStep";
import OnboardingFinalStep from "@/components/auth/OnboardingFinalStep";
import type { OnboardingProfile, OnboardingStep } from "@/lib/auth/onboardingState";
import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

export default function OnboardingFlow() {
  const router = useRouter();
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang].auth;
  const [step, setStep] = useState<OnboardingStep | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [needsProfileInput, setNeedsProfileInput] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadState = useCallback(async () => {
    setError(null);
    const response = await fetch("/api/onboarding/state", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/");
      return;
    }
    if (!response.ok) {
      setError(t.onboardingError);
      return;
    }

    const result = (await response.json()) as {
      step: OnboardingStep;
      profile: OnboardingProfile | null;
    };
    if (result.step === "complete") {
      router.replace("/dashboard");
      return;
    }
    setProfile(result.profile);
    setStep(result.step);
  }, [router, t.onboardingError]);

  const bootstrap = useCallback(async () => {
    setError(null);
    const response = await fetch("/api/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    if (response.status === 401) {
      router.replace("/");
      return;
    }
    if (response.status === 422) {
      setFirstName(String(user?.user_metadata?.first_name ?? ""));
      setLastName(String(user?.user_metadata?.last_name ?? ""));
      setNeedsProfileInput(true);
      setStep("profile");
      return;
    }
    if (!response.ok) {
      setError(t.onboardingError);
      return;
    }

    setNeedsProfileInput(false);
    await loadState();
  }, [loadState, router, t.onboardingError, user]);

  useEffect(() => {
    if (!user) return;
    const timeout = window.setTimeout(() => void bootstrap(), 0);
    return () => window.clearTimeout(timeout);
  }, [bootstrap, user]);

  async function saveRecoveryProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !countryCode) {
      setError(t.requiredFields);
      return;
    }

    setSaving(true);
    setError(null);
    const response = await fetch("/api/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        country_code: countryCode,
        food_region: countryCode,
        language: lang,
      }),
    });
    setSaving(false);

    if (!response.ok) {
      setError(t.onboardingError);
      return;
    }
    setNeedsProfileInput(false);
    await loadState();
  }

  if (error && !step) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-red-600" role="alert">{error}</p>
        <button onClick={() => void bootstrap()} className="rounded bg-[#191970] px-4 py-2 text-white">{t.retry}</button>
      </div>
    );
  }

  if (!step) return <p className="text-center text-sm text-gray-600">{t.loadingOnboarding}</p>;

  if (step === "profile" && needsProfileInput) {
    return (
      <form onSubmit={saveRecoveryProfile} className="space-y-4">
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={t.firstName} aria-label={t.firstName} className="w-full rounded border px-3 py-2" required />
        <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={t.lastName} aria-label={t.lastName} className="w-full rounded border px-3 py-2" required />
        <CountrySelect value={countryCode} onChange={setCountryCode} label={t.residenceCountry} placeholder={t.selectCountry} loadingLabel={t.loadingCountries} errorLabel={t.countryLoadError} disabled={saving} />
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button type="submit" disabled={saving} className="w-full rounded bg-[#191970] py-2 text-white disabled:opacity-50">{saving ? t.saving : t.next}</button>
      </form>
    );
  }

  if (step === "personal") return <OnboardingPersonalStep onNext={loadState} />;
  if (step === "body" && profile) {
    return <OnboardingBodyStep profile={profile} onNext={loadState} />;
  }
  if (step === "final") return <OnboardingFinalStep onComplete={loadState} />;
  return <p className="text-center text-sm text-gray-600">{t.loadingOnboarding}</p>;
}
