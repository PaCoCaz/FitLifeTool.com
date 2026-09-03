import {
  createOnboardingCompletionHandler,
  type OnboardingCompletionClient,
} from "@/lib/auth/onboardingCompletion";
import {
  resolveServerAuthState,
} from "@/lib/auth/serverAuthState";
import { createClient } from "@/lib/supabaseServer";

export const POST = createOnboardingCompletionHandler(
  async () => (await createClient()) as unknown as OnboardingCompletionClient,
  async (client) => resolveServerAuthState(client as never)
);
