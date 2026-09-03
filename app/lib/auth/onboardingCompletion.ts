export const ONBOARDING_ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

export const ONBOARDING_GOALS = ["LOSE", "MAINTAIN", "GAIN"] as const;

export type OnboardingActivityLevel =
  (typeof ONBOARDING_ACTIVITY_LEVELS)[number];
export type OnboardingGoal = (typeof ONBOARDING_GOALS)[number];

export type OnboardingCompletionInput = {
  activityLevel: OnboardingActivityLevel;
  goal: OnboardingGoal;
};

export type OnboardingCompletionRpcStatus =
  | "COMPLETED"
  | "ALREADY_COMPLETE"
  | "INVALID_INPUT"
  | "PREREQUISITE_INCOMPLETE"
  | "STATE_CONFLICT";

export type OnboardingCompletionFailureCode =
  | "ORIGIN_NOT_ALLOWED"
  | "INVALID_REQUEST"
  | "ONBOARDING_INPUT_INVALID"
  | "AUTHENTICATION_REQUIRED"
  | "ONBOARDING_PREREQUISITES_INCOMPLETE"
  | "ONBOARDING_STATE_CONFLICT"
  | "ONBOARDING_COMPLETION_UNAVAILABLE";

const activityLevels = new Set<string>(ONBOARDING_ACTIVITY_LEVELS);
const goals = new Set<string>(ONBOARDING_GOALS);

export function parseOnboardingCompletionInput(
  value: unknown
): OnboardingCompletionInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  if (
    Object.keys(body).length !== 2 ||
    !Object.hasOwn(body, "activityLevel") ||
    !Object.hasOwn(body, "goal") ||
    typeof body.activityLevel !== "string" ||
    typeof body.goal !== "string" ||
    !activityLevels.has(body.activityLevel) ||
    !goals.has(body.goal)
  ) {
    return null;
  }

  return {
    activityLevel: body.activityLevel as OnboardingActivityLevel,
    goal: body.goal as OnboardingGoal,
  };
}

export function asOnboardingCompletionRpcStatus(
  value: unknown
): OnboardingCompletionRpcStatus | null {
  switch (value) {
    case "COMPLETED":
    case "ALREADY_COMPLETE":
    case "INVALID_INPUT":
    case "PREREQUISITE_INCOMPLETE":
    case "STATE_CONFLICT":
      return value;
    default:
      return null;
  }
}

export function rpcStatusFailure(
  status: OnboardingCompletionRpcStatus
): { code: OnboardingCompletionFailureCode; status: number } | null {
  switch (status) {
    case "INVALID_INPUT":
      return { code: "ONBOARDING_INPUT_INVALID", status: 422 };
    case "PREREQUISITE_INCOMPLETE":
      return {
        code: "ONBOARDING_PREREQUISITES_INCOMPLETE",
        status: 422,
      };
    case "STATE_CONFLICT":
      return { code: "ONBOARDING_STATE_CONFLICT", status: 409 };
    default:
      return null;
  }
}

const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};

export type OnboardingCompletionClient = {
  auth: {
    getUser(): Promise<{
      data: { user: { id: string } | null };
      error: unknown;
    }>;
  };
  rpc(
    name: "complete_user_onboarding",
    parameters: { p_activity_level: string; p_goal: string }
  ): Promise<{ data: unknown; error: unknown }>;
};

type ResolvedCompletionState = {
  kind:
    | "ANONYMOUS"
    | "AUTHENTICATED_ONBOARDING_INCOMPLETE"
    | "AUTHENTICATED_ONBOARDING_COMPLETE"
    | "RESOLUTION_FAILURE";
};

type CreateCompletionClient = () => Promise<OnboardingCompletionClient>;
type ResolveCompletionState = (
  client: OnboardingCompletionClient
) => Promise<ResolvedCompletionState>;

function failure(code: OnboardingCompletionFailureCode, status: number) {
  return Response.json({ code }, { status, headers: RESPONSE_HEADERS });
}

export function createOnboardingCompletionHandler(
  createCompletionClient: CreateCompletionClient,
  resolveCompletionState: ResolveCompletionState
) {
  return async function completeOnboarding(request: Request) {
    const requestOrigin = new URL(request.url).origin;
    if (request.headers.get("origin") !== requestOrigin) {
      return failure("ORIGIN_NOT_ALLOWED", 403);
    }

    if (
      request.headers.get("content-type")?.split(";", 1)[0].trim() !==
      "application/json"
    ) {
      return failure("INVALID_REQUEST", 400);
    }

    let input;
    try {
      input = parseOnboardingCompletionInput(await request.json());
    } catch {
      return failure("INVALID_REQUEST", 400);
    }
    if (!input) return failure("ONBOARDING_INPUT_INVALID", 422);

    let client: OnboardingCompletionClient;
    try {
      client = await createCompletionClient();
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) {
        return failure("AUTHENTICATION_REQUIRED", 401);
      }
    } catch {
      return failure("ONBOARDING_COMPLETION_UNAVAILABLE", 503);
    }

    let rpcResult: { data: unknown; error: unknown };
    try {
      rpcResult = await client.rpc("complete_user_onboarding", {
        p_activity_level: input.activityLevel,
        p_goal: input.goal,
      });
    } catch {
      return failure("ONBOARDING_COMPLETION_UNAVAILABLE", 503);
    }

    if (rpcResult.error) {
      return failure("ONBOARDING_COMPLETION_UNAVAILABLE", 503);
    }

    const rpcStatus = asOnboardingCompletionRpcStatus(rpcResult.data);
    if (!rpcStatus) {
      return failure("ONBOARDING_COMPLETION_UNAVAILABLE", 503);
    }

    const expectedFailure = rpcStatusFailure(rpcStatus);
    if (expectedFailure) {
      return failure(expectedFailure.code, expectedFailure.status);
    }

    let state: ResolvedCompletionState;
    try {
      state = await resolveCompletionState(client);
    } catch {
      return failure("ONBOARDING_COMPLETION_UNAVAILABLE", 503);
    }

    if (state.kind === "ANONYMOUS") {
      return failure("AUTHENTICATION_REQUIRED", 401);
    }
    if (state.kind !== "AUTHENTICATED_ONBOARDING_COMPLETE") {
      return failure(
        state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE"
          ? "ONBOARDING_STATE_CONFLICT"
          : "ONBOARDING_COMPLETION_UNAVAILABLE",
        state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE" ? 409 : 503
      );
    }

    return Response.json(
      {
        status:
          rpcStatus === "ALREADY_COMPLETE"
            ? "already_complete"
            : "completed",
        destination: "/dashboard",
      },
      { status: 200, headers: RESPONSE_HEADERS }
    );
  };
}
