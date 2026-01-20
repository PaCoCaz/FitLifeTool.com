// app/(public)/publicBreadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Publieke breadcrumb
 *
 * Patronen:
 * /
 * /gezondheid
 * /gezondheid/bmi
 * /gezondheid/bmi/wat-is-bmi
 */
export default function PublicBreadcrumb() {
  const pathname = usePathname();

  // Home → geen breadcrumb
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  // Helper: slug → leesbare titel
  const toLabel = (slug: string) =>
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: toLabel(segment),
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav className="breadcrumb text-sm">
      <ol className="flex items-center gap-2 text-white/80 whitespace-nowrap">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Home
          </Link>
        </li>

        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span className="text-white/40">{">"}</span>

            {crumb.isLast ? (
              <span className="text-white font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-white transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
