// app/handbook/layout.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import AppShell from "@/components/layout/AppShell";
import HandbookBreadcrumb from "./breadcrumb";
import HandbookNavigation from "./navigation";
import MobileHandbookNav from "./mobileHandbookNav";

export default async function HandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["owner", "admin", "developer"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <>
      <AppShell breadcrumb={<HandbookBreadcrumb />}>
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:grid grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white rounded-[var(--radius)] shadow-sm p-4 h-fit">
            <HandbookNavigation />
          </aside>

          <main className="bg-white rounded-[var(--radius)] p-6 shadow-sm">
            {children}
          </main>
        </div>

        {/* ===== MOBILE CONTENT ===== */}
        <div className="md:hidden bg-white rounded-[var(--radius)] p-4 shadow-sm pb-24">
          {children}
        </div>
      </AppShell>

      {/* ===== FIXED MOBILE FOOTER (BUITEN AppShell) ===== */}
      <MobileHandbookNav />
    </>
  );
}
