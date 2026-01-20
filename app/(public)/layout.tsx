// app/(public)/layout.tsx

import React from "react";
import AppShell from "@/components/layout/AppShell";
import PublicBreadcrumb from "./publicBreadcrumb";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <AppShell breadcrumb={<PublicBreadcrumb />}>
      {children}
    </AppShell>
  );
}
