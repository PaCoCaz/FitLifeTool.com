"use client";

import Link from "next/link";

export default function WeightBreadcrumb() {
  return (
    <nav className="text-sm text-white/90">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="opacity-60">/</li>
        <li className="font-medium text-white">
          Gewicht
        </li>
      </ol>
    </nav>
  );
}
