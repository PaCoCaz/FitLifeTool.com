// app/(app)/dashboard/layout.tsx

import AppShell from "@/components/layout/AppShell";
import DashboardBreadcrumb from "./breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell breadcrumb={<DashboardBreadcrumb />}>
      {children}
    </AppShell>
  );
}