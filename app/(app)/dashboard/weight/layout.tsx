// app/(app)/dashboard/weight/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import AppShell from "@/components/layout/AppShell";
import { TimeProvider } from "@/lib/TimeProvider";
import WeightBreadcrumb from "./breadcrumb";

export default async function WeightLayout({
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
    <AppShell breadcrumb={<WeightBreadcrumb />}>
      <TimeProvider>
        {children}
      </TimeProvider>
    </AppShell>
  );
}
