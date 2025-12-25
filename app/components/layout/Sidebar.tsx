"use client";

import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Voeding", href: "/dashboard#nutrition" },
  { label: "Activiteit", href: "/dashboard#activity" },
  { label: "Gewicht", href: "/dashboard#weight" },
  { label: "Instellingen", href: "/settings" },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside>
      <div
        className="
          fixed
          top-20
          h-[calc(100vh-80px)]
          w-[220px]
          lg:w-[240px]
          rounded-[var(--radius)]
          bg-[#B8CAE0]
          p-4
        "
      >
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={
                "w-full rounded-[var(--radius)] px-3 py-2 text-left text-base font-medium transition " +
                (pathname === item.href
                  ? "bg-[#191970] text-white"
                  : "bg-white text-[#191970] hover:bg-[#0BA4E0] hover:text-white")
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
