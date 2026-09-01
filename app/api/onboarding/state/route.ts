import { resolveServerAuthState } from "@/lib/auth/serverAuthState";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await createClient();
  const state = await resolveServerAuthState(supabase);

  if (state.kind === "ANONYMOUS") {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }
  if (state.kind === "RESOLUTION_FAILURE") {
    return Response.json({ error: "Could not determine onboarding state" }, { status: 500 });
  }

  return Response.json({
    step: state.onboardingStep,
    profile: state.profile,
  });
}
