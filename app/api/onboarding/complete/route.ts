import {
  createOnboardingCompletionHandler,
  type OnboardingCompletionClient,
} from "@/lib/auth/onboardingCompletion";
import {
  resolveServerAuthState,
} from "@/lib/auth/serverAuthState";
import { createClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { AUTH_CONTEXT_COOKIE, AUTH_CONTEXT_COOKIE_OPTIONS, buildSessionExpiredLoginPath, classifyIdentityResult, parseAuthContextMarker } from "@/lib/auth/sessionLifecycle";

export const POST = createOnboardingCompletionHandler(
  async () => (await createClient()) as unknown as OnboardingCompletionClient,
  async (client) => resolveServerAuthState(client as never),
  async (error, user) => {
    const store = await cookies();
    const identity = classifyIdentityResult(error, user, store.get(AUTH_CONTEXT_COOKIE)?.value);
    if (identity === "AUTH_STATE_UNAVAILABLE") return { code: identity };
    const marker = parseAuthContextMarker(store.get(AUTH_CONTEXT_COOKIE)?.value);
    if (!marker) return { code: "AUTHENTICATION_REQUIRED" as const };
    store.set(AUTH_CONTEXT_COOKIE, "", { ...AUTH_CONTEXT_COOKIE_OPTIONS, maxAge: 0 });
    return { code: "SESSION_EXPIRED" as const, destination: buildSessionExpiredLoginPath(marker) };
  }
);
