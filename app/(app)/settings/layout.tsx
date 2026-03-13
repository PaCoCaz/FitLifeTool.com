//  app/(app)/settings/layout.tsx

import AppShell from "@/components/layout/AppShell";
import SettingsBreadcrumb from "./breadcrumb";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      breadcrumb={<SettingsBreadcrumb />}
    >
      {children}
    </AppShell>
  );
}