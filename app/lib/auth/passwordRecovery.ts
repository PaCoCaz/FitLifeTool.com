export type RecoveryLanguage = "nl" | "en" | "fr" | "de" | "pl";

const RECOVERY_LANGUAGES: readonly RecoveryLanguage[] = [
  "nl",
  "en",
  "fr",
  "de",
  "pl",
];

const RECOVERY_FALLBACK_LANGUAGE: RecoveryLanguage = "en";

export function asRecoveryLanguage(
  value: unknown
): RecoveryLanguage | null {
  return typeof value === "string" &&
    RECOVERY_LANGUAGES.includes(value as RecoveryLanguage)
    ? (value as RecoveryLanguage)
    : null;
}

export function resolveRecoveryLanguage(
  value: unknown
): RecoveryLanguage {
  return asRecoveryLanguage(value) ?? RECOVERY_FALLBACK_LANGUAGE;
}

export function buildRecoveryRedirectUrl(
  siteUrl: string,
  language: unknown
) {
  const url = new URL(siteUrl);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("Invalid trusted FitLifeTool site URL");
  }

  url.pathname = "/reset-password";
  url.search = "";
  url.hash = "";
  url.searchParams.set("lang", resolveRecoveryLanguage(language));

  return url.toString();
}

export async function requestPasswordRecovery(
  input: {
    email: string;
    language: unknown;
    siteUrl: string;
  },
  resetPasswordForEmail: (
    email: string,
    options: { redirectTo: string }
  ) => Promise<{ error: unknown | null }>,
  onTechnicalError: () => void
) {
  try {
    const redirectTo = buildRecoveryRedirectUrl(
      input.siteUrl,
      input.language
    );
    const { error } = await resetPasswordForEmail(
      input.email,
      { redirectTo }
    );

    if (error) {
      onTechnicalError();
    }
  } catch {
    onTechnicalError();
  }

  // The public response is deliberately identical for every address and error.
  return { ok: true as const };
}
