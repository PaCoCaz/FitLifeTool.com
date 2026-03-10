// app/(app)/dashboard/layout.tsx

import AppShell from "@/components/layout/AppShell";
import DashboardBreadcrumb from "./breadcrumb";
import { ScoreProvider } from "@/lib/ScoreContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScoreProvider>
      <AppShell breadcrumb={<DashboardBreadcrumb />}>
        {children}
      </AppShell>
    </ScoreProvider>
  );
}