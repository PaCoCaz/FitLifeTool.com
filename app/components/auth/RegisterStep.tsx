"use client";

import { useState } from "react";
import CountrySelect from "@/components/auth/CountrySelect";
import { supabase } from "@/lib/supabaseClient";
import { useSetInterfaceLanguage, type Lang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { buildRegistrationMetadata, REGISTRATION_LANGUAGES, validateRegistration } from "@/lib/auth/registration";

const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
  de: "Deutsch",
  pl: "Polski",
};

type Props = {
  selectedLanguage: Lang | null;
  onLanguageSelect: (language: Lang) => void;
};

export default function RegisterStep({ selectedLanguage, onLanguageSelect }: Props) {
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[selectedLanguage ?? "en"].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const input = { firstName, lastName, email, password, countryCode, language: selectedLanguage };

    if (!validateRegistration(input)) {
      setError(t.requiredFields);
      return;
    }

    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: buildRegistrationMetadata(input),
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setConfirmationSent(true);
  };

  if (confirmationSent) {
    return (
      <div className="space-y-3" role="status">
        <h3 className="text-lg font-semibold text-[#191970]">{t.checkEmailTitle}</h3>
        <p className="text-sm text-gray-600">{t.checkEmailMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <label className="block text-sm font-medium">
        {t.registrationLanguage}
        <select
          value={selectedLanguage ?? ""}
          onChange={(event) => {
            const nextLanguage = event.target.value as Lang;
            onLanguageSelect(nextLanguage);
            setInterfaceLanguage(nextLanguage);
            setError(null);
          }}
          required
          className="mt-1 w-full rounded border px-3 py-2 text-base"
        >
          <option value="">{t.selectLanguage}</option>
          {REGISTRATION_LANGUAGES.map((language) => (
            <option key={language} value={language}>{LANGUAGE_NAMES[language]}</option>
          ))}
        </select>
      </label>

      {selectedLanguage && (
        <>
          <input type="text" placeholder={t.firstName} aria-label={t.firstName} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required className="w-full rounded border px-3 py-2" />
          <input type="text" placeholder={t.lastName} aria-label={t.lastName} value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" required className="w-full rounded border px-3 py-2" />
          <input type="email" placeholder={t.email} aria-label={t.email} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="w-full rounded border px-3 py-2" />
          <input type="password" placeholder={t.password} aria-label={t.password} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required className="w-full rounded border px-3 py-2" />
          <CountrySelect value={countryCode} onChange={setCountryCode} label={t.residenceCountry} placeholder={t.selectCountry} loadingLabel={t.loadingCountries} errorLabel={t.countryLoadError} disabled={loading} />
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] disabled:opacity-50">
            {loading ? t.registering : t.next}
          </button>
        </>
      )}
    </form>
  );
}
