import type { Lang } from "../LangProvider";

const SUPPORTED_LANGUAGES: Lang[] = ["en", "nl", "fr", "de", "pl"];

function isIsoCountryCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{2}$/.test(value);
}

export type ProfileBootstrapValues = {
  first_name: string;
  last_name: string;
  language: Lang;
  country_code: string;
  food_region: string;
};

type UnknownRecord = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveProfileBootstrapValues(
  metadata: UnknownRecord,
  recovery: UnknownRecord = {}
): ProfileBootstrapValues | null {
  const firstName = text(recovery.first_name) || text(metadata.first_name);
  const lastName = text(recovery.last_name) || text(metadata.last_name);
  const countryCode = text(recovery.country_code) || text(metadata.country_code);
  const metadataFoodRegion = text(metadata.food_region);
  const foodRegion = text(recovery.food_region) || metadataFoodRegion || countryCode;
  const language = text(recovery.language) || text(metadata.language);

  if (
    !firstName ||
    !lastName ||
    !isIsoCountryCode(countryCode) ||
    !isIsoCountryCode(foodRegion) ||
    !SUPPORTED_LANGUAGES.includes(language as Lang)
  ) {
    return null;
  }

  return {
    first_name: firstName,
    last_name: lastName,
    language: language as Lang,
    country_code: countryCode,
    food_region: foodRegion,
  };
}
