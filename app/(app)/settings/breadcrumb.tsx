//  app/(app)/settings/breadcrumb.tsx

"use client";

import { usePathname } from "next/navigation";
import { settingsRoutes } from "./settingsRegistry";

export default function SettingsBreadcrumb() {
  const pathname = usePathname();

  const route =
    settingsRoutes.find(
      (r) => r.path === pathname
    ) ?? settingsRoutes[0];

  return (
    <div className="text-white font-medium flex gap-2">

      {route.parentLabel && (
        <>
          <span>{route.parentLabel}</span>
          <span>&gt;</span>
        </>
      )}

      <span>{route.label}</span>

    </div>
  );
}