// app/handbook/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import AppShell from "@/components/layout/AppShell";
import HandbookBreadcrumb from "./breadcrumb";
import HandbookNavigation from "./navigation";

export default async function HandbookLayout({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["owner", "admin", "developer"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <AppShell
      breadcrumb={<HandbookBreadcrumb />}
    >
      <div className="grid grid-cols-[260px_1fr] gap-6">

        {/* Sidebar */}
        <aside className="bg-white rounded-[var(--radius)] shadow-sm p-4 h-fit">
          <HandbookNavigation />
        </aside>

        {/* Content */}
        <main className="bg-white rounded-[var(--radius)] p-6 shadow-sm">
          {children}
        </main>

      </div>
    </AppShell>
  );
}
