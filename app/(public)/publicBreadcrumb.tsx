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

  // Helper: slug → leesbare titel (NL zinsopmaak + uitzonderingen)
  const toLabel = (slug: string) => {
    const sentence = slug.replace(/-/g, " ");

    const lower = sentence.toLowerCase();

    const withCaps = lower
      .replace("10000 stappen", "10.000 stappen")
      .replace("bmi", "BMI")
      .replace("bmr", "BMR")
      .replace("fitlifetool", "FitLifeTool")
      .replace("met waarden", "MET-waarden")
      .replace("tdee", "TDEE")
      .replace("vo2 max", "VO₂max");

    return withCaps.charAt(0).toUpperCase() + withCaps.slice(1);
  };

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

        {crumbs.map((crumb) => (
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
