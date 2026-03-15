/// app/api/profile/subscription/route.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

export async function GET() {

  const supabaseUser =
    await createSupabaseServerUser();

  const {
    data: { user },
  } =
    await supabaseUser.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({
        abonnement: "free",
        user_id: null,
      }),
      { status: 200 }
    );
  }

  const supabaseAdmin =
    createSupabaseServer();

  const { data } =
    await supabaseAdmin
      .from("profiles")
      .select("abonnement")
      .eq("id", user.id)
      .single();

  return new Response(
    JSON.stringify({
      abonnement:
        data?.abonnement ?? "free",
      user_id: user.id,
    })
  );
}
