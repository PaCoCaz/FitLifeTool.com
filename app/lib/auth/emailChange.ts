import {
  authenticateFreshPasswordIdentityForUser,
  clearIsolatedFreshAuthSession,
  FreshAuthenticationError,
  getNormalAuthenticatedUser,
  type FreshAuthUser,
  type IsolatedFreshAuthClient,
  type NormalFreshAuthClient,
} from "./freshAuthentication.ts";
import {
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference.ts";
import {
  isValidEmailChangeInput,
  normalizeEmailChangeInput,
} from "./emailChangeValidation.ts";

export {
  EMAIL_MAX_LENGTH,
  isValidEmailChangeInput,
  normalizeEmailChangeInput,
} from "./emailChangeValidation.ts";

export type NormalEmailChangeAuthClient = NormalFreshAuthClient;

export type FreshEmailChangeAuthClient = IsolatedFreshAuthClient & {
  updateUser(
    input: { email: string },
    options: { emailRedirectTo: string }
  ): Promise<{
    data: { user: FreshAuthUser | null };
    error: unknown | null;
  }>;
};

export class EmailChangeError extends Error {
  readonly code:
    | "UNAUTHENTICATED"
    | "AUTHENTICATION_CHECK_FAILED"
    | "REAUTHENTICATION_FAILED"
    | "REAUTHENTICATION_IDENTITY_MISMATCH"
    | "INVALID_EMAIL"
    | "EMAIL_UNCHANGED"
    | "EMAIL_CHANGE_FAILED";

  constructor(code: EmailChangeError["code"]) {
    super(code);
    this.code = code;
  }
}

export function buildEmailChangeRedirectUrl(
  siteUrl: string,
  language: unknown
) {
  const url = new URL(siteUrl);

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password
  ) {
    throw new Error("Invalid trusted site URL");
  }

  const safeLanguage: AppLanguage = asAppLanguage(language) ?? "en";

  url.pathname = "/settings";
  url.search = "";
  url.hash = "";
  url.searchParams.set("lang", safeLanguage);
  url.searchParams.set("email_change", "return");

  return url.toString();
}

export async function requestEmailChangeForAuthenticatedUser(
  normalAuth: NormalEmailChangeAuthClient,
  freshAuth: FreshEmailChangeAuthClient,
  input: {
    currentPassword: string;
    newEmail: string;
    emailRedirectTo: string;
  }
) {
  const newEmail = normalizeEmailChangeInput(input.newEmail);

  if (!input.currentPassword) {
    throw new EmailChangeError("REAUTHENTICATION_FAILED");
  }

  if (!isValidEmailChangeInput(newEmail)) {
    throw new EmailChangeError("INVALID_EMAIL");
  }

  let normalUser;

  try {
    normalUser = await getNormalAuthenticatedUser(normalAuth);
  } catch (error) {
    if (error instanceof FreshAuthenticationError) {
      throw new EmailChangeError(error.code);
    }
    throw error;
  }

  if (
    !normalUser.email ||
    normalUser.email.trim().toLowerCase() === newEmail.toLowerCase()
  ) {
    throw new EmailChangeError("EMAIL_UNCHANGED");
  }

  let authenticated;

  try {
    authenticated = await authenticateFreshPasswordIdentityForUser(
      normalUser,
      freshAuth,
      input.currentPassword,
      { emailOnly: true }
    );
  } catch (error) {
    if (error instanceof FreshAuthenticationError) {
      throw new EmailChangeError(error.code);
    }
    throw error;
  }

  let updateResult;
  try {
    updateResult = await freshAuth.updateUser(
      { email: newEmail },
      { emailRedirectTo: input.emailRedirectTo }
    );
  } catch {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new EmailChangeError("EMAIL_CHANGE_FAILED");
  }

  const { data, error } = updateResult;

  if (
    error ||
    !data.user ||
    data.user.id !== authenticated.normalUser.id
  ) {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new EmailChangeError("EMAIL_CHANGE_FAILED");
  }

  await clearIsolatedFreshAuthSession(freshAuth);

  return { status: "pending_confirmation" as const };
}
