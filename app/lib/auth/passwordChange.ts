export const PASSWORD_CHANGE_MIN_LENGTH = 10;

type AuthUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  app_metadata?: {
    providers?: unknown;
  };
};

type AuthSession = {
  user: AuthUser;
};

type PasswordCredentials =
  | { email: string; password: string }
  | { phone: string; password: string };

export type NormalPasswordChangeAuthClient = {
  getUser(): Promise<{
    data: { user: AuthUser | null };
    error: unknown | null;
  }>;
  signOut(input: { scope: "local" }): Promise<{
    error: unknown | null;
  }>;
};

export type FreshPasswordChangeAuthClient = {
  signInWithPassword(input: PasswordCredentials): Promise<{
    data: {
      user: AuthUser | null;
      session: AuthSession | null;
    };
    error: unknown | null;
  }>;
  updateUser(input: { password: string }): Promise<{
    data: { user: AuthUser | null };
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

function getPasswordCredentials(
  user: AuthUser,
  currentPassword: string
): PasswordCredentials | null {
  const providers = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers.filter(
        (provider): provider is string => typeof provider === "string"
      )
    : [];

  if (user.email && providers.includes("email")) {
    return { email: user.email, password: currentPassword };
  }

  if (user.phone && providers.includes("phone")) {
    return { phone: user.phone, password: currentPassword };
  }

  return null;
}

async function clearFreshAuthSession(
  freshAuth: FreshPasswordChangeAuthClient
) {
  try {
    await freshAuth.signOut({ scope: "local" });
  } catch {
    // The isolated client has no persistent storage and ends with this request.
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
  const { data: initialData, error: initialError } =
    await normalAuth.getUser();

  if (!initialData.user) {
    throw new PasswordChangeError(
      "UNAUTHENTICATED",
      "An authenticated user is required"
    );
  }

  if (initialError) {
    throw new PasswordChangeError(
      "AUTHENTICATION_CHECK_FAILED",
      "The authenticated user could not be verified"
    );
  }

  validatePasswordChangeInput(input);

  const credentials = getPasswordCredentials(
    initialData.user,
    input.currentPassword
  );

  if (!credentials) {
    throw new PasswordChangeError(
      "REAUTHENTICATION_FAILED",
      "The authenticated identity cannot use password authentication"
    );
  }

  const { data: freshData, error: freshError } =
    await freshAuth.signInWithPassword(credentials);

  if (freshError || !freshData.user || !freshData.session) {
    await clearFreshAuthSession(freshAuth);
    throw new PasswordChangeError(
      "REAUTHENTICATION_FAILED",
      "Fresh password authentication failed"
    );
  }

  if (
    freshData.user.id !== initialData.user.id ||
    freshData.session.user.id !== initialData.user.id
  ) {
    await clearFreshAuthSession(freshAuth);
    throw new PasswordChangeError(
      "REAUTHENTICATION_IDENTITY_MISMATCH",
      "Fresh authentication identity does not match the existing session"
    );
  }

  const { data: updateData, error: updateError } =
    await freshAuth.updateUser({ password: input.newPassword });

  if (
    updateError ||
    !updateData.user ||
    updateData.user.id !== initialData.user.id
  ) {
    await clearFreshAuthSession(freshAuth);
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
    await clearFreshAuthSession(freshAuth);
  }

  const normalSessionCleared = await clearNormalBrowserSession(normalAuth);

  return globalSignOutSucceeded && normalSessionCleared
    ? { status: "success" }
    : { status: "partial_success" };
}
