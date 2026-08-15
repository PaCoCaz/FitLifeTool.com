//  app/(app)/settings/breadcrumb.tsx

"use client";

import { usePathname } from "next/navigation";
import { settingsRoutes } from "./settingsRegistry";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

export default function SettingsBreadcrumb() {
  const pathname = usePathname();
  const lang = useLang();
  const t = uiText[lang];

  const route =
    settingsRoutes.find(
      (r) => r.path === pathname
    ) ?? settingsRoutes[0];

  return (
    <nav className="text-sm w-full overflow-hidden relative">
      <ol className="flex items-center text-white/80 overflow-hidden whitespace-nowrap w-full">
        {route.parent && (
          <li className="flex items-center shrink-0">
            <span>{t.profile.title}</span>
            <span className="mx-1 text-white/60 shrink-0 select-none">›</span>
          </li>
        )}

        <li className="flex-1 min-w-0">
          <span className="text-white font-medium truncate block">
            {t.settings.title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
