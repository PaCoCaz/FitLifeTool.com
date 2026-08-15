import { getOnboardingStep, ONBOARDING_PROFILE_FIELDS } from "@/lib/auth/onboardingState";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

export async function GET() {
  const sessionClient = await createSupabaseServerUser();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const admin = createSupabaseServer();
  const [{ data: profile, error: profileError }, { data: activeGoal, error: goalError }] =
    await Promise.all([
      admin.from("profiles").select(ONBOARDING_PROFILE_FIELDS).eq("id", user.id).maybeSingle(),
      admin
        .from("user_goal_periods")
        .select("id")
        .eq("user_id", user.id)
        .is("end_at", null)
        .order("start_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (profileError || goalError) {
    return Response.json({ error: "Could not determine onboarding state" }, { status: 500 });
  }

  return Response.json({
    step: getOnboardingStep(profile, Boolean(activeGoal)),
    profile,
  });
}
