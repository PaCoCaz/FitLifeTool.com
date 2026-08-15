import { resolveProfileBootstrapValues } from "@/lib/auth/profileBootstrap";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { createSupabaseServerUser } from "@/lib/supabase/supabaseServerUser";

export async function POST(request: Request) {
  const sessionClient = await createSupabaseServerUser();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const admin = createSupabaseServer();
  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingError) {
    return Response.json({ error: "Could not inspect profile" }, { status: 500 });
  }
  if (existing) return Response.json({ status: "exists" });

  let recovery: Record<string, unknown> = {};
  try {
    recovery = (await request.json()) as Record<string, unknown>;
  } catch {
    // An empty body is valid when signup metadata is complete.
  }

  const values = resolveProfileBootstrapValues(user.user_metadata ?? {}, recovery);
  if (!values) {
    return Response.json({ status: "needs_input" }, { status: 422 });
  }

  const codes = [...new Set([values.country_code, values.food_region])];
  const { data: validCountries, error: countriesError } = await admin
    .from("countries")
    .select("country_code")
    .eq("is_active", true)
    .in("country_code", codes);

  if (countriesError) {
    return Response.json({ error: "Could not validate countries" }, { status: 500 });
  }
  if ((validCountries ?? []).length !== codes.length) {
    return Response.json({ status: "needs_input" }, { status: 422 });
  }

  const { error: insertError } = await admin.from("profiles").insert({
    id: user.id,
    ...values,
  });

  if (insertError) {
    const { data: concurrentProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (concurrentProfile) return Response.json({ status: "exists" });
    console.error("Profile bootstrap error:", insertError);
    return Response.json({ error: "Could not create profile" }, { status: 500 });
  }

  return Response.json({ status: "created" }, { status: 201 });
}
