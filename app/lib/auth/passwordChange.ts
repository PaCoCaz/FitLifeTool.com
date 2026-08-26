import {
  authenticateFreshPasswordIdentityForUser,
  clearIsolatedFreshAuthSession,
  FreshAuthenticationError,
  getNormalAuthenticatedUser,
  type FreshAuthUser,
  type IsolatedFreshAuthClient,
  type NormalFreshAuthClient,
} from "./freshAuthentication.ts";
import { PASSWORD_CHANGE_MIN_LENGTH } from "./passwordChangeValidation.ts";

export { PASSWORD_CHANGE_MIN_LENGTH } from "./passwordChangeValidation.ts";

export type NormalPasswordChangeAuthClient = NormalFreshAuthClient & {
  signOut(input: { scope: "local" }): Promise<{
    error: unknown | null;
  }>;
};

export type FreshPasswordChangeAuthClient = IsolatedFreshAuthClient & {
  updateUser(input: { password: string }): Promise<{
    data: { user: FreshAuthUser | null };
    error: unknown | null;
  }>;
  signOut(input: { scope: "global" | "local" }): Promise<{
    error: unknown | null;
  }>;
};

export type PasswordChangeOutcome =
  | { status: "success" }
  | { status: "partial_success" };

export class PasswordChangeError extends Error {
  readonly code:
    | "UNAUTHENTICATED"
    | "AUTHENTICATION_CHECK_FAILED"
    | "REAUTHENTICATION_FAILED"
    | "REAUTHENTICATION_IDENTITY_MISMATCH"
    | "PASSWORD_TOO_SHORT"
    | "PASSWORD_MISMATCH"
    | "PASSWORD_UPDATE_FAILED";

  constructor(
    code: PasswordChangeError["code"],
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

export function validatePasswordChangeInput(input: {
  currentPassword: string;
  newPassword: string;
  confirmation: string;
}) {
  if (!input.currentPassword) {
    throw new PasswordChangeError(
      "REAUTHENTICATION_FAILED",
      "The current password is required for fresh authentication"
    );
  }

  if (input.newPassword.length < PASSWORD_CHANGE_MIN_LENGTH) {
    throw new PasswordChangeError(
      "PASSWORD_TOO_SHORT",
      "Password does not meet the minimum length"
    );
  }

  if (input.newPassword !== input.confirmation) {
    throw new PasswordChangeError(
      "PASSWORD_MISMATCH",
      "Password confirmation does not match"
    );
  }
}

async function clearNormalBrowserSession(
  normalAuth: NormalPasswordChangeAuthClient
) {
  try {
    const { error } = await normalAuth.signOut({ scope: "local" });
    return !error;
  } catch {
    return false;
  }
}

export async function changePasswordForAuthenticatedUser(
  normalAuth: NormalPasswordChangeAuthClient,
  freshAuth: FreshPasswordChangeAuthClient,
  input: {
    currentPassword: string;
    newPassword: string;
    confirmation: string;
  }
): Promise<PasswordChangeOutcome> {
  let normalUser;

  try {
    normalUser = await getNormalAuthenticatedUser(normalAuth);
  } catch (error) {
    if (error instanceof FreshAuthenticationError) {
      throw new PasswordChangeError(error.code, error.message);
    }
    throw error;
  }

  validatePasswordChangeInput(input);
  let authenticated;

  try {
    authenticated = await authenticateFreshPasswordIdentityForUser(
      normalUser,
      freshAuth,
      input.currentPassword
    );
  } catch (error) {
    if (error instanceof FreshAuthenticationError) {
      throw new PasswordChangeError(error.code, error.message);
    }
    throw error;
  }

  let updateResult;
  try {
    updateResult = await freshAuth.updateUser({ password: input.newPassword });
  } catch {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new PasswordChangeError(
      "PASSWORD_UPDATE_FAILED",
      "Supabase rejected the password update"
    );
  }

  const { data: updateData, error: updateError } = updateResult;

  if (
    updateError ||
    !updateData.user ||
    updateData.user.id !== authenticated.normalUser.id
  ) {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new PasswordChangeError(
      "PASSWORD_UPDATE_FAILED",
      "Supabase rejected the password update"
    );
  }

  let globalSignOutSucceeded = false;

  try {
    const { error: signOutError } = await freshAuth.signOut({
      scope: "global",
    });

    globalSignOutSucceeded = !signOutError;
  } catch {
    globalSignOutSucceeded = false;
  }

  if (!globalSignOutSucceeded) {
    await clearIsolatedFreshAuthSession(freshAuth);
  }

  const normalSessionCleared = await clearNormalBrowserSession(normalAuth);

  return globalSignOutSucceeded && normalSessionCleared
    ? { status: "success" }
    : { status: "partial_success" };
}
