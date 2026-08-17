export const RECOVERY_PASSWORD_MIN_LENGTH = 10;

export type RecoveryLanguage = "nl" | "en" | "fr" | "de" | "pl";

const RECOVERY_LANGUAGES: readonly RecoveryLanguage[] = [
  "nl",
  "en",
  "fr",
  "de",
  "pl",
];

const RECOVERY_FALLBACK_LANGUAGE: RecoveryLanguage = "en";

export type RecoveryCredential = {
  kind: "token_hash";
  tokenHash: string;
};

export type PasswordResetOutcome =
  | { status: "success" }
  | { status: "partial_success" };

type AuthUser = {
  id: string;
};

type AuthSession = {
  user: AuthUser;
};

type AuthResult = {
  data: {
    session?: AuthSession | null;
    user?: AuthUser | null;
  };
  error: unknown | null;
};

export type RecoveryAuthClient = {
  verifyOtp(input: {
    token_hash: string;
    type: "recovery";
  }): Promise<AuthResult>;
  getUser(): Promise<{
    data: { user: AuthUser | null };
    error: unknown | null;
  }>;
  updateUser(input: {
    password: string;
  }): Promise<{ error: unknown | null }>;
  signOut(input: {
    scope: "global" | "local";
  }): Promise<{ error: unknown | null }>;
};

export class PasswordRecoveryError extends Error {
  readonly code:
    | "INVALID_RECOVERY_CONTEXT"
    | "RECOVERY_IDENTITY_MISMATCH"
    | "PASSWORD_TOO_SHORT"
    | "PASSWORD_MISMATCH"
    | "PASSWORD_UPDATE_FAILED";

  constructor(
    code:
      | "INVALID_RECOVERY_CONTEXT"
      | "RECOVERY_IDENTITY_MISMATCH"
      | "PASSWORD_TOO_SHORT"
      | "PASSWORD_MISMATCH"
      | "PASSWORD_UPDATE_FAILED",
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

export function asRecoveryLanguage(
  value: unknown
): RecoveryLanguage | null {
  return typeof value === "string" &&
    RECOVERY_LANGUAGES.includes(value as RecoveryLanguage)
    ? (value as RecoveryLanguage)
    : null;
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

  const safeLanguage =
    asRecoveryLanguage(language) ?? RECOVERY_FALLBACK_LANGUAGE;
  url.searchParams.set("lang", safeLanguage);

  return url.toString();
}

export function parseRecoveryCredential(
  url: URL
): RecoveryCredential | null {
  const searchParams = url.searchParams;
  const allowedParameters = new Set(["token_hash", "type", "lang"]);

  if (
    url.hash ||
    [...searchParams.keys()].some(
      (parameter) => !allowedParameters.has(parameter)
    ) ||
    searchParams.getAll("token_hash").length !== 1 ||
    searchParams.getAll("type").length !== 1 ||
    searchParams.getAll("lang").length > 1
  ) {
    return null;
  }

  const tokenHash = searchParams.get("token_hash");
  const queryType = searchParams.get("type");
  const language = searchParams.get("lang");

  if (
    !tokenHash ||
    queryType !== "recovery" ||
    (language !== null && !asRecoveryLanguage(language))
  ) {
    return null;
  }

  return {
    kind: "token_hash",
    tokenHash,
  };
}

export function clearRecoveryParameters(url: URL) {
  const safeLanguage = asRecoveryLanguage(
    url.searchParams.get("lang")
  );
  const safeSearch = new URLSearchParams();

  if (safeLanguage) {
    safeSearch.set("lang", safeLanguage);
  }

  const query = safeSearch.toString();
  return `/reset-password${query ? `?${query}` : ""}`;
}

function getResultUserId(result: AuthResult) {
  return result.data.session?.user.id ?? result.data.user?.id ?? null;
}

export async function verifyRecoveryCredential(
  auth: RecoveryAuthClient,
  credential: RecoveryCredential,
  existingUserId: string | null
) {
  const result = await auth.verifyOtp({
    token_hash: credential.tokenHash,
    type: "recovery",
  });

  const recoveryUserId = getResultUserId(result);

  if (result.error || !recoveryUserId) {
    throw new PasswordRecoveryError(
      "INVALID_RECOVERY_CONTEXT",
      "Recovery credential is invalid or expired"
    );
  }

  if (existingUserId && existingUserId !== recoveryUserId) {
    throw new PasswordRecoveryError(
      "RECOVERY_IDENTITY_MISMATCH",
      "Recovery identity does not match the existing browser session"
    );
  }

  return recoveryUserId;
}

export function validateRecoveryPassword(
  password: string,
  confirmation: string
) {
  if (password.length < RECOVERY_PASSWORD_MIN_LENGTH) {
    throw new PasswordRecoveryError(
      "PASSWORD_TOO_SHORT",
      "Password does not meet the recovery minimum length"
    );
  }

  if (password !== confirmation) {
    throw new PasswordRecoveryError(
      "PASSWORD_MISMATCH",
      "Password confirmation does not match"
    );
  }
}

export async function resetPasswordFromRecovery(
  auth: RecoveryAuthClient,
  input: {
    recoveryUserId: string;
    password: string;
    confirmation: string;
  }
) {
  validateRecoveryPassword(
    input.password,
    input.confirmation
  );

  const { data, error: userError } = await auth.getUser();

  if (
    userError ||
    !data.user ||
    data.user.id !== input.recoveryUserId
  ) {
    throw new PasswordRecoveryError(
      "RECOVERY_IDENTITY_MISMATCH",
      "Active auth identity no longer matches the recovery context"
    );
  }

  const { error: updateError } = await auth.updateUser({
    password: input.password,
  });

  if (updateError) {
    throw new PasswordRecoveryError(
      "PASSWORD_UPDATE_FAILED",
      "Supabase rejected the password update"
    );
  }

  try {
    const { error: signOutError } = await auth.signOut({
      scope: "global",
    });

    if (signOutError) {
      return { status: "partial_success" } satisfies PasswordResetOutcome;
    }
  } catch {
    return { status: "partial_success" } satisfies PasswordResetOutcome;
  }

  return { status: "success" } satisfies PasswordResetOutcome;
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
