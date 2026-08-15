import type { Lang } from "../LangProvider";

export const SUPPORTED_LANGUAGES = ["en", "nl", "fr", "de", "pl"] as const;

export type CountryOption = {
  country_code: string;
  name: string;
};

type CountryRow = {
  country_code: string;
};

type CountryTranslationRow = {
  country_code: string;
  language_code: string;
  name: string;
};

type CountryReferenceClient = {
  from: (table: string) => unknown;
};

type CountriesTable = {
  select: (columns: string) => {
    eq: (column: string, value: boolean) => Promise<{ data: CountryRow[] | null; error: unknown }>;
  };
};

type TranslationsTable = {
  select: (columns: string) => {
    in: (column: string, values: string[]) => Promise<{ data: CountryTranslationRow[] | null; error: unknown }>;
  };
};

export function normalizeCountryLanguage(value: string | null | undefined): Lang {
  return SUPPORTED_LANGUAGES.includes(value as Lang) ? (value as Lang) : "en";
}

export function isIsoCountryCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{2}$/.test(value);
}

export function buildCountryOptions(
  countries: CountryRow[],
  translations: CountryTranslationRow[],
  requestedLanguage: string | null | undefined
): CountryOption[] {
  const language = normalizeCountryLanguage(requestedLanguage);
  const names = new Map<string, Map<string, string>>();

  for (const translation of translations) {
    if (!isIsoCountryCode(translation.country_code) || !translation.name) continue;

    const countryNames = names.get(translation.country_code) ?? new Map<string, string>();
    countryNames.set(translation.language_code, translation.name);
    names.set(translation.country_code, countryNames);
  }

  return countries
    .filter(({ country_code }) => isIsoCountryCode(country_code))
    .map(({ country_code }) => ({
      country_code,
      name:
        names.get(country_code)?.get(language) ??
        names.get(country_code)?.get("en") ??
        country_code,
    }))
    .sort((a, b) => {
      const nameOrder = a.name.localeCompare(b.name, language, { sensitivity: "base" });
      return nameOrder || a.country_code.localeCompare(b.country_code);
    });
}

export async function getCountryOptions(
  client: CountryReferenceClient,
  requestedLanguage: string | null | undefined
): Promise<CountryOption[]> {
  const language = normalizeCountryLanguage(requestedLanguage);
  const requestedLanguages = language === "en" ? ["en"] : [language, "en"];

  const [{ data: countries, error: countriesError }, { data: translations, error: translationsError }] =
    await Promise.all([
      (client.from("countries") as CountriesTable)
        .select("country_code")
        .eq("is_active", true),
      (client.from("country_translations") as TranslationsTable)
        .select("country_code, language_code, name")
        .in("language_code", requestedLanguages),
    ]);

  if (countriesError) throw countriesError;
  if (translationsError) throw translationsError;

  return buildCountryOptions(countries ?? [], translations ?? [], language);
}
