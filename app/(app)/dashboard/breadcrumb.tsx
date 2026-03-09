//  app/(app)/dashboard/breadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardRoutes } from "./dashboardRegistry";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();

  const route = dashboardRoutes.find(
    r => r.path === pathname
  );

  if (!route) {
    return (
      <nav className="text-sm">
        <ol className="flex items-center gap-2 text-white font-medium">
          <li>Dashboard</li>
        </ol>
      </nav>
    );
  }

  return (
    <nav className="text-sm">
      <ol className="flex items-center gap-2 text-white/80">

        {/* Dashboard */}
        <li>
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
        </li>

        {/* Parent */}
        {route.parentLabel && (
          <>
            <li className="text-white/40">{">"}</li>

            {route.parent === "/dashboard" ? (
              <li>{route.parentLabel}</li>
            ) : (
              <li>
                <Link
                  href={route.parent!}
                  className="hover:text-white"
                >
                  {route.parentLabel}
                </Link>
              </li>
            )}
          </>
        )}

        {/* Current */}
        {pathname !== "/dashboard" && (
          <>
            <li className="text-white/40">{">"}</li>

            <li className="text-white font-medium">
              {route.label}
            </li>
          </>
        )}

      </ol>
    </nav>
  );
}