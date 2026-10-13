import { createClient } from "@/lib/supabaseServer";
import {
  createEmailConfirmationHandler,
  parseEmailConfirmationRequest,
} from "@/lib/auth/emailConfirmation";
import {
  resolveServerAuthState,
  type ServerAuthClient,
  type ServerAuthState,
} from "@/lib/auth/serverAuthState";

type ConfirmationClient = ServerAuthClient & {
  auth: ServerAuthClient["auth"] & {
    exchangeCodeForSession(code: string): Promise<{ error: unknown | null }>;
    verifyOtp(input: { token_hash: string; type: "signup" }): Promise<{ error: unknown | null }>;
  };
};

function authenticatedDestination(state: ServerAuthState): string | null {
  if (state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE") return "/onboarding";
  if (state.kind === "AUTHENTICATED_ONBOARDING_COMPLETE") return "/dashboard";
  return null;
}

async function resolveState(client: ServerAuthClient) {
  return resolveServerAuthState(client);
}

export const GET = createEmailConfirmationHandler(
  createClient as () => Promise<ConfirmationClient>,
  {
    parse: parseEmailConfirmationRequest,
    resolveState,
    authenticatedDestination,
  }
);
