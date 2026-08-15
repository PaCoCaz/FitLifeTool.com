export const APP_LANGUAGES = ["en", "nl", "fr", "de", "pl"] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export function asAppLanguage(value: unknown): AppLanguage | null {
  return APP_LANGUAGES.includes(value as AppLanguage)
    ? (value as AppLanguage)
    : null;
}

export function resolveInterfaceLanguage(
  profileLanguage: unknown,
  metadataLanguage: unknown
): AppLanguage {
  return asAppLanguage(profileLanguage) ?? asAppLanguage(metadataLanguage) ?? "en";
}
