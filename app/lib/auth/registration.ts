import type { Lang } from "../LangProvider";

export const REGISTRATION_LANGUAGES = ["en", "nl", "fr", "de", "pl"] as const;

export function isRegistrationLanguage(value: unknown): value is Lang {
  return REGISTRATION_LANGUAGES.includes(value as Lang);
}

function isIsoCountryCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{2}$/.test(value);
}

export type RegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  language: Lang | null;
};

export function validateRegistration(input: RegistrationInput) {
  return Boolean(
    input.firstName.trim() &&
      input.lastName.trim() &&
      input.email.trim() &&
      input.password &&
      isRegistrationLanguage(input.language) &&
      isIsoCountryCode(input.countryCode)
  );
}

export function buildRegistrationMetadata(input: RegistrationInput) {
  if (!isRegistrationLanguage(input.language)) {
    throw new Error("An explicit registration language is required");
  }

  return {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    country_code: input.countryCode,
    food_region: input.countryCode,
    language: input.language,
  };
}
