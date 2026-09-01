import { isAuthSessionMissingError } from "@supabase/auth-js";
import type { CookieOptions } from "@supabase/ssr";
import {
  asAppLanguage,
  type AppLanguage,
} from "../languagePreference";
import {
  getOnboardingStep,
  ONBOARDING_PROFILE_FIELDS,
  type OnboardingProfile,
  type OnboardingStep,
} from "./onboardingState";

type IncompleteOnboardingStep = Exclude<OnboardingStep, "complete">;

type ResolvedProfile = OnboardingProfile & {
  language: string | null;
};

type QueryResult = Promise<{
  data: unknown;
  error: unknown;
}>;

type ServerAuthQuery = {
  select(columns: string): ServerAuthQuery;
  eq(column: string, value: string): ServerAuthQuery;
  is(column: string, value: null): ServerAuthQuery;
  order(column: string, options: { ascending: boolean }): ServerAuthQuery;
  limit(value: number): ServerAuthQuery;
  maybeSingle(): QueryResult;
};

export type ServerAuthClient = {
  auth: {
    getUser(): Promise<{
      data: { user: { id: string } | null };
      error: unknown;
    }>;
  };
  from(table: string): ServerAuthQuery;
};

type SharedAuthenticatedState = {
  userId: string;
  profileLanguage: AppLanguage | null;
  interfaceLanguage: AppLanguage;
};

export type ServerAuthState =
  | {
      kind: "ANONYMOUS";
      userId: null;
      onboardingStep: null;
      profileLanguage: null;
      interfaceLanguage: "en";
      profile: null;
    }
  | (SharedAuthenticatedState & {
      kind: "AUTHENTICATED_ONBOARDING_INCOMPLETE";
      onboardingStep: IncompleteOnboardingStep;
      profile: ResolvedProfile | null;
    })
  | (SharedAuthenticatedState & {
      kind: "AUTHENTICATED_ONBOARDING_COMPLETE";
      onboardingStep: "complete";
      profile: ResolvedProfile;
    })
  | {
      kind: "RESOLUTION_FAILURE";
      userId: string | null;
      stage: "identity" | "profile" | "active_goal" | "state";
      onboardingStep: null;
      profileLanguage: null;
      interfaceLanguage: "en";
      profile: null;
    };

export type PendingAuthCookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

type CookieResponse = {
  cookies: {
    set(name: string, value: string, options?: CookieOptions): unknown;
  };
};

export function applyPendingAuthCookies<T extends CookieResponse>(
  response: T,
  cookies: readonly PendingAuthCookie[]
): T {
  for (const { name, value, options } of cookies) {
    response.cookies.set(name, value, options);
  }
  return response;
}

function resolutionFailure(
  stage: Extract<ServerAuthState, { kind: "RESOLUTION_FAILURE" }>["stage"],
  userId: string | null = null
): ServerAuthState {
  return {
    kind: "RESOLUTION_FAILURE",
    userId,
    stage,
    onboardingStep: null,
    profileLanguage: null,
    interfaceLanguage: "en",
    profile: null,
  };
}

export async function resolveServerAuthState(
  supabase: ServerAuthClient
): Promise<ServerAuthState> {
  let userId: string;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return isAuthSessionMissingError(error)
        ? {
            kind: "ANONYMOUS",
            userId: null,
            onboardingStep: null,
            profileLanguage: null,
            interfaceLanguage: "en",
            profile: null,
          }
        : resolutionFailure("identity");
    }

    if (!data.user) {
      return {
        kind: "ANONYMOUS",
        userId: null,
        onboardingStep: null,
        profileLanguage: null,
        interfaceLanguage: "en",
        profile: null,
      };
    }

    userId = data.user.id;
  } catch {
    return resolutionFailure("identity");
  }

  try {
    const [profileResult, activeGoalResult] = await Promise.all([
      supabase
        .from("profiles")
        .select(`${ONBOARDING_PROFILE_FIELDS}, language`)
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_goal_periods")
        .select("id")
        .eq("user_id", userId)
        .is("end_at", null)
        .order("start_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (profileResult.error) {
      return resolutionFailure("profile", userId);
    }
    if (activeGoalResult.error) {
      return resolutionFailure("active_goal", userId);
    }

    const profile = profileResult.data as ResolvedProfile | null;
    const onboardingStep = getOnboardingStep(
      profile,
      Boolean(activeGoalResult.data)
    );
    const profileLanguage = asAppLanguage(profile?.language);
    const shared = {
      userId,
      profileLanguage,
      interfaceLanguage: profileLanguage ?? ("en" as const),
    };

    return onboardingStep === "complete" && profile
      ? {
          kind: "AUTHENTICATED_ONBOARDING_COMPLETE",
          ...shared,
          onboardingStep,
          profile,
        }
      : {
          kind: "AUTHENTICATED_ONBOARDING_INCOMPLETE",
          ...shared,
          onboardingStep: onboardingStep as IncompleteOnboardingStep,
          profile,
        };
  } catch {
    return resolutionFailure("state", userId);
  }
}
