import {
  APP_LANGUAGES,
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference";
import { validatePassword, validatePasswordConfirmation } from "./passwordPolicy";

export const REGISTRATION_LANGUAGES = APP_LANGUAGES;

export function isRegistrationLanguage(value: unknown): value is AppLanguage {
  return asAppLanguage(value) != null;
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
  language: AppLanguage | null;
};

export type RegistrationValidationInput = RegistrationInput & {
  confirmPassword: string;
};

export const REGISTRATION_FAILURE_CODE = "REGISTRATION_FAILED" as const;

export const REGISTRATION_FIELD_ERROR_CODES = [
  "REG_LANGUAGE_INVALID",
  "REG_FIRST_NAME_REQUIRED",
  "REG_LAST_NAME_REQUIRED",
  "REG_EMAIL_REQUIRED",
  "REG_EMAIL_INVALID",
  "REG_PASSWORD_REQUIRED",
  "REG_PASSWORD_TOO_SHORT",
  "REG_CONFIRMATION_REQUIRED",
  "REG_PASSWORD_MISMATCH",
  "REG_COUNTRY_INVALID",
] as const;

export type RegistrationFieldErrorCode =
  (typeof REGISTRATION_FIELD_ERROR_CODES)[number];
export type RegistrationField =
  | "language"
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword"
  | "countryCode";
export type RegistrationFieldErrors = Partial<
  Record<RegistrationField, RegistrationFieldErrorCode>
>;

export type RegistrationValidationOptions = {
  isCountryAllowed?: (countryCode: string) => boolean;
};

export type RegistrationValidationResult =
  | { valid: true; errors: Record<never, never> }
  | { valid: false; errors: RegistrationFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationFields(
  input: RegistrationValidationInput,
  options: RegistrationValidationOptions = {}
): RegistrationValidationResult {
  const errors: RegistrationFieldErrors = {};
  const email = input.email.trim();

  if (!isRegistrationLanguage(input.language)) {
    errors.language = "REG_LANGUAGE_INVALID";
  }
  if (!input.firstName.trim()) {
    errors.firstName = "REG_FIRST_NAME_REQUIRED";
  }
  if (!input.lastName.trim()) {
    errors.lastName = "REG_LAST_NAME_REQUIRED";
  }
  if (!email) {
    errors.email = "REG_EMAIL_REQUIRED";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "REG_EMAIL_INVALID";
  }

  const passwordResult = validatePassword(input.password);
  if (!passwordResult.valid) {
    errors.password =
      passwordResult.code === "PASSWORD_REQUIRED"
        ? "REG_PASSWORD_REQUIRED"
        : "REG_PASSWORD_TOO_SHORT";
  } else {
    const confirmationResult = validatePasswordConfirmation(
      input.password,
      input.confirmPassword
    );
    if (!confirmationResult.valid) {
      errors.confirmPassword =
        confirmationResult.code === "PASSWORD_CONFIRMATION_REQUIRED"
          ? "REG_CONFIRMATION_REQUIRED"
          : "REG_PASSWORD_MISMATCH";
    }
  }

  const countryFormatValid = isIsoCountryCode(input.countryCode);
  if (
    !countryFormatValid ||
    (options.isCountryAllowed && !options.isCountryAllowed(input.countryCode))
  ) {
    errors.countryCode = "REG_COUNTRY_INVALID";
  }

  return Object.keys(errors).length === 0
    ? { valid: true, errors: {} }
    : { valid: false, errors };
}

export function normalizeRegistrationFailure(
  cause: unknown
): typeof REGISTRATION_FAILURE_CODE {
  void cause;
  return REGISTRATION_FAILURE_CODE;
}

export function validateRegistration(input: RegistrationInput) {
  const passwordResult = validatePassword(input.password);
  return Boolean(
    input.firstName.trim() &&
      input.lastName.trim() &&
      input.email.trim() &&
      passwordResult.valid &&
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
