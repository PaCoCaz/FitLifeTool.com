// app/(app)/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import AppShell from "@/components/layout/AppShell";
import { TimeProvider } from "@/lib/TimeProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <TimeProvider>
        {children}
      </TimeProvider>
    </AppShell>
  );
}
