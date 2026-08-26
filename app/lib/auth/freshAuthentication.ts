import { createClient } from "@supabase/supabase-js";

export type FreshAuthUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  app_metadata?: {
    providers?: unknown;
  };
};

type FreshAuthSession = {
  user: FreshAuthUser;
};

type PasswordCredentials =
  | { email: string; password: string }
  | { phone: string; password: string };

export type NormalFreshAuthClient = {
  getUser(): Promise<{
    data: { user: FreshAuthUser | null };
    error: unknown | null;
  }>;
};

export type IsolatedFreshAuthClient = {
  signInWithPassword(input: PasswordCredentials): Promise<{
    data: {
      user: FreshAuthUser | null;
      session: FreshAuthSession | null;
    };
    error: unknown | null;
  }>;
  signOut(input: { scope: "global" | "local" }): Promise<{
    error: unknown | null;
  }>;
};

export class FreshAuthenticationError extends Error {
  readonly code:
    | "UNAUTHENTICATED"
    | "AUTHENTICATION_CHECK_FAILED"
    | "REAUTHENTICATION_FAILED"
    | "REAUTHENTICATION_IDENTITY_MISMATCH";

  constructor(code: FreshAuthenticationError["code"]) {
    super(code);
    this.code = code;
  }
}

function passwordCredentialsForUser(
  user: FreshAuthUser,
  password: string,
  emailOnly: boolean
): PasswordCredentials | null {
  const providers = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers.filter(
        (provider): provider is string => typeof provider === "string"
      )
    : [];

  if (user.email && providers.includes("email")) {
    return { email: user.email, password };
  }

  if (!emailOnly && user.phone && providers.includes("phone")) {
    return { phone: user.phone, password };
  }

  return null;
}

export function createIsolatedFreshAuthClient(
  supabaseUrl: string,
  anonKey: string
) {
  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }).auth;
}

export async function clearIsolatedFreshAuthSession(
  freshAuth: IsolatedFreshAuthClient
) {
  try {
    await freshAuth.signOut({ scope: "local" });
  } catch {
    // This client has no persistence and is discarded at the end of the action.
  }
}

export async function getNormalAuthenticatedUser(
  normalAuth: NormalFreshAuthClient
) {
  const { data, error } = await normalAuth.getUser();

  if (!data.user) {
    throw new FreshAuthenticationError("UNAUTHENTICATED");
  }

  if (error) {
    throw new FreshAuthenticationError("AUTHENTICATION_CHECK_FAILED");
  }

  return data.user;
}

export async function authenticateFreshPasswordIdentityForUser(
  normalUser: FreshAuthUser,
  freshAuth: IsolatedFreshAuthClient,
  currentPassword: string,
  options: { emailOnly?: boolean } = {}
) {
  const credentials = passwordCredentialsForUser(
    normalUser,
    currentPassword,
    options.emailOnly === true
  );

  if (!credentials) {
    throw new FreshAuthenticationError("REAUTHENTICATION_FAILED");
  }

  let freshResult;
  try {
    freshResult = await freshAuth.signInWithPassword(credentials);
  } catch {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new FreshAuthenticationError("REAUTHENTICATION_FAILED");
  }

  const { data: freshData, error: freshError } = freshResult;

  if (freshError || !freshData.user || !freshData.session) {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new FreshAuthenticationError("REAUTHENTICATION_FAILED");
  }

  if (
    freshData.user.id !== normalUser.id ||
    freshData.session.user.id !== normalUser.id
  ) {
    await clearIsolatedFreshAuthSession(freshAuth);
    throw new FreshAuthenticationError(
      "REAUTHENTICATION_IDENTITY_MISMATCH"
    );
  }

  return {
    normalUser,
    freshUser: freshData.user,
  };
}

export async function authenticateFreshPasswordIdentity(
  normalAuth: NormalFreshAuthClient,
  freshAuth: IsolatedFreshAuthClient,
  currentPassword: string,
  options: { emailOnly?: boolean } = {}
) {
  const normalUser = await getNormalAuthenticatedUser(normalAuth);
  return authenticateFreshPasswordIdentityForUser(
    normalUser,
    freshAuth,
    currentPassword,
    options
  );
}
