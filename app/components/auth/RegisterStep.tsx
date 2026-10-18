"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import CountrySelect from "@/components/auth/CountrySelect";
import EmailConfirmationPanel from "@/components/auth/EmailConfirmationPanel";
import { supabase } from "@/lib/supabaseClient";
import { useSetInterfaceLanguage, type Lang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/passwordPolicy";
import { buildEmailConfirmationRedirectUrl } from "@/lib/auth/emailConfirmation";
import {
  buildRegistrationMetadata,
  REGISTRATION_LANGUAGES,
  validateRegistrationFields,
  type RegistrationField,
  type RegistrationFieldErrorCode,
  type RegistrationFieldErrors,
} from "@/lib/auth/registration";

const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
  de: "Deutsch",
  pl: "Polski",
};

const FIELD_ORDER: RegistrationField[] = [
  "language",
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
  "countryCode",
];

function LoginArrow() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      className="h-4 w-4 shrink-0"
    >
      <path
        d="M2.5 8h10m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  selectedLanguage: Lang | null;
  onLanguageSelect: (language: Lang) => void;
  onLogin?: () => void;
  onDismiss?: () => void;
  resolvedRegistrationOpen?: boolean;
};

export default function RegisterStep({
  selectedLanguage,
  onLanguageSelect,
  onLogin,
  onDismiss,
  resolvedRegistrationOpen,
}: Props) {
  const formId = useId();
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[selectedLanguage ?? "en"].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [fetchedRegistrationOpen, setFetchedRegistrationOpen] = useState(false);
  const [fetchedRegistrationStatusLoaded, setFetchedRegistrationStatusLoaded] = useState(false);
  const registrationOpen = resolvedRegistrationOpen ?? fetchedRegistrationOpen;
  const registrationStatusLoaded = resolvedRegistrationOpen !== undefined
    || fetchedRegistrationStatusLoaded;

  useEffect(() => {
    if (resolvedRegistrationOpen !== undefined) {
      return;
    }

    let cancelled = false;
    void fetch("/api/auth/registration-status", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        const body: unknown = await response.json();
        const open = response.ok && !!body && typeof body === "object" && !Array.isArray(body)
          && (body as { open?: unknown }).open === true;
        if (!cancelled) {
          setFetchedRegistrationOpen(open);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedRegistrationOpen(false);
        }
      })
      .finally(() => {
        if (!cancelled) setFetchedRegistrationStatusLoaded(true);
      });
    return () => { cancelled = true; };
  }, [resolvedRegistrationOpen]);

  const fieldIds: Record<RegistrationField, string> = {
    language: `${formId}-language`,
    firstName: `${formId}-first-name`,
    lastName: `${formId}-last-name`,
    email: `${formId}-email`,
    password: `${formId}-password`,
    confirmPassword: `${formId}-confirm-password`,
    countryCode: `${formId}-country`,
  };
  const passwordHelperId = `${fieldIds.password}-helper`;
  const withMinimum = (value: string) =>
    value.replace("{{minimum}}", String(PASSWORD_MIN_LENGTH));
  const errorText: Record<RegistrationFieldErrorCode, string> = {
    REG_LANGUAGE_INVALID: t.registrationErrors.languageInvalid,
    REG_FIRST_NAME_REQUIRED: t.registrationErrors.firstNameRequired,
    REG_LAST_NAME_REQUIRED: t.registrationErrors.lastNameRequired,
    REG_EMAIL_REQUIRED: t.registrationErrors.emailRequired,
    REG_EMAIL_INVALID: t.registrationErrors.emailInvalid,
    REG_PASSWORD_REQUIRED: t.registrationErrors.passwordRequired,
    REG_PASSWORD_TOO_SHORT: withMinimum(t.registrationErrors.passwordTooShort),
    REG_CONFIRMATION_REQUIRED: t.registrationErrors.confirmationRequired,
    REG_PASSWORD_MISMATCH: t.registrationErrors.passwordMismatch,
    REG_COUNTRY_INVALID: t.registrationErrors.countryInvalid,
  };

  const getFieldError = (field: RegistrationField) => {
    const code = fieldErrors[field];
    return code ? errorText[code] : null;
  };

  const clearFieldError = (field: RegistrationField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setError(null);
  };

  const focusFirstInvalidField = (errors: RegistrationFieldErrors) => {
    const firstInvalidField = FIELD_ORDER.find((field) => errors[field]);
    if (!firstInvalidField) return;
    requestAnimationFrame(() => {
      document.getElementById(fieldIds[firstInvalidField])?.focus();
    });
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const input = {
      firstName,
      lastName,
      email,
      password,
      countryCode,
      language: selectedLanguage,
    };
    const validation = validateRegistrationFields({
      ...input,
      confirmPassword,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError(null);
      focusFirstInvalidField(validation.errors);
      return;
    }

    setFieldErrors({});
    setError(null);
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: buildRegistrationMetadata(input),
          emailRedirectTo: buildEmailConfirmationRedirectUrl(
            window.location.origin,
            selectedLanguage
          ),
        },
      });

      if (signUpError) {
        setError(t.registrationFailure);
        return;
      }

      setConfirmationSent(true);
    } catch {
      setError(t.registrationFailure);
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <EmailConfirmationPanel
        mode="registration"
        language={selectedLanguage ?? "en"}
        email={email.trim()}
      />
    );
  }

  if (!registrationStatusLoaded) {
    return <p role="status" className="text-sm text-gray-600">{t.registrationStatusLoading}</p>;
  }

  if (!registrationOpen) {
    return (
      <div className="space-y-4">
        <div className="space-y-3 text-sm leading-6 text-gray-700" role="status">
          <p>{t.registrationClosed}</p>
          <p>{t.registrationClosedDetails}</p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-[var(--radius)] bg-[#191970] px-4 py-2.5 font-semibold text-white hover:bg-[#0BA4E0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BA4E0]"
          >
            {t.registrationClosedAcknowledge}
          </button>
        ) : null}
        <div className="border-t border-[#91A6C2] pt-4 text-center text-sm leading-6 text-gray-700">
          <p className="flex flex-wrap items-center justify-center gap-x-1">
            <span>{t.registrationClosedAccountPrompt}</span>
            {onLogin ? (
              <button
                type="button"
                onClick={onLogin}
                className="inline-flex max-w-full items-center gap-1 font-semibold text-[#191970] no-underline hover:text-[#0BA4E0] hover:no-underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BA4E0]"
              >
                {t.registrationClosedLoginAction}
                <LoginArrow />
              </button>
            ) : (
              <Link
                href={`/login?lang=${selectedLanguage ?? "en"}`}
                className="inline-flex max-w-full items-center gap-1 font-semibold text-[#191970] no-underline hover:text-[#0BA4E0] hover:no-underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BA4E0]"
              >
                {t.registrationClosedLoginAction}
                <LoginArrow />
              </Link>
            )}
          </p>
        </div>
      </div>
    );
  }

  const languageError = getFieldError("language");
  const firstNameError = getFieldError("firstName");
  const lastNameError = getFieldError("lastName");
  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");
  const confirmationError = getFieldError("confirmPassword");
  const countryError = getFieldError("countryCode");

  return (
    <form onSubmit={handleRegister} className="space-y-4" noValidate>
      <div>
        <label htmlFor={fieldIds.language} className="block text-sm font-medium">
          {t.registrationLanguage}
        </label>
        <select
          id={fieldIds.language}
          value={selectedLanguage ?? ""}
          onChange={(event) => {
            const nextLanguage = event.target.value as Lang;
            onLanguageSelect(nextLanguage);
            setInterfaceLanguage(nextLanguage);
            clearFieldError("language");
          }}
          required
          aria-invalid={Boolean(languageError)}
          aria-describedby={languageError ? `${fieldIds.language}-error` : undefined}
          className="mt-2 w-full rounded border px-3 py-2 text-base"
        >
          <option value="">{t.selectLanguage}</option>
          {REGISTRATION_LANGUAGES.map((language) => (
            <option key={language} value={language}>{LANGUAGE_NAMES[language]}</option>
          ))}
        </select>
        {languageError && <p id={`${fieldIds.language}-error`} className="mt-1 text-sm text-red-600">{languageError}</p>}
      </div>

      {selectedLanguage && (
        <>
          <div>
            <label htmlFor={fieldIds.firstName} className="mb-1 block text-sm font-medium">{t.firstName}</label>
            <input id={fieldIds.firstName} type="text" placeholder={t.firstName} aria-invalid={Boolean(firstNameError)} aria-describedby={firstNameError ? `${fieldIds.firstName}-error` : undefined} value={firstName} onChange={(event) => { setFirstName(event.target.value); clearFieldError("firstName"); }} autoComplete="given-name" required className="w-full rounded border px-3 py-2" />
            {firstNameError && <p id={`${fieldIds.firstName}-error`} className="mt-1 text-sm text-red-600">{firstNameError}</p>}
          </div>
          <div>
            <label htmlFor={fieldIds.lastName} className="mb-1 block text-sm font-medium">{t.lastName}</label>
            <input id={fieldIds.lastName} type="text" placeholder={t.lastName} aria-invalid={Boolean(lastNameError)} aria-describedby={lastNameError ? `${fieldIds.lastName}-error` : undefined} value={lastName} onChange={(event) => { setLastName(event.target.value); clearFieldError("lastName"); }} autoComplete="family-name" required className="w-full rounded border px-3 py-2" />
            {lastNameError && <p id={`${fieldIds.lastName}-error`} className="mt-1 text-sm text-red-600">{lastNameError}</p>}
          </div>
          <div>
            <label htmlFor={fieldIds.email} className="mb-1 block text-sm font-medium">{t.email}</label>
            <input id={fieldIds.email} type="email" placeholder={t.email} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? `${fieldIds.email}-error` : undefined} value={email} onChange={(event) => { setEmail(event.target.value); clearFieldError("email"); }} autoComplete="email" required className="w-full rounded border px-3 py-2" />
            {emailError && <p id={`${fieldIds.email}-error`} className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          <div>
            <label htmlFor={fieldIds.password} className="mb-1 block text-sm font-medium">{t.password}</label>
            <input id={fieldIds.password} type="password" placeholder={t.password} aria-invalid={Boolean(passwordError)} aria-describedby={[passwordHelperId, passwordError ? `${fieldIds.password}-error` : null].filter(Boolean).join(" ")} value={password} onChange={(event) => { setPassword(event.target.value); clearFieldError("password"); clearFieldError("confirmPassword"); }} autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} required className="w-full rounded border px-3 py-2" />
            <p id={passwordHelperId} className="mt-1 text-sm text-gray-600">{withMinimum(t.passwordMinimum)}</p>
            {passwordError && <p id={`${fieldIds.password}-error`} className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor={fieldIds.confirmPassword} className="mb-1 block text-sm font-medium">{t.confirmPassword}</label>
            <input id={fieldIds.confirmPassword} type="password" placeholder={t.confirmPassword} aria-invalid={Boolean(confirmationError)} aria-describedby={confirmationError ? `${fieldIds.confirmPassword}-error` : undefined} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); clearFieldError("confirmPassword"); }} autoComplete="new-password" required className="w-full rounded border px-3 py-2" />
            {confirmationError && <p id={`${fieldIds.confirmPassword}-error`} className="mt-1 text-sm text-red-600">{confirmationError}</p>}
          </div>
          <div>
            <CountrySelect id={fieldIds.countryCode} value={countryCode} onChange={(nextCountryCode) => { setCountryCode(nextCountryCode); clearFieldError("countryCode"); }} label={t.residenceCountry} placeholder={t.selectCountry} loadingLabel={t.loadingCountries} errorLabel={t.countryLoadError} disabled={loading} invalid={Boolean(countryError)} describedBy={countryError ? `${fieldIds.countryCode}-error` : undefined} />
            {countryError && <p id={`${fieldIds.countryCode}-error`} className="mt-1 text-sm text-red-600">{countryError}</p>}
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-[var(--radius)] bg-[#191970] py-2 text-white hover:bg-[#0BA4E0] disabled:opacity-50">
            {loading ? t.registering : t.next}
          </button>
        </>
      )}
    </form>
  );
}
