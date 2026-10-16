import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import RegistrationControlPanel from "@/components/admin/RegistrationControlPanel";
import { canManagePublicRegistration } from "@/lib/auth/publicRegistration";
import { createClient } from "@/lib/supabaseServer";

export default async function RegistrationControlPage() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login");

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !canManagePublicRegistration(profile?.role)) {
    redirect("/settings");
  }

  return (
    <AppShell>
      <RegistrationControlPanel />
    </AppShell>
  );
}
