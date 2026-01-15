// app/handbook/breadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getDocumentByPath,
  getHoofdstukById,
} from "./handbookRegistry";

export default function HandbookBreadcrumb() {
  const pathname = usePathname();

  /* ───────────────── Handboek index ───────────────── */
  if (pathname === "/handbook") {
    return (
      <nav className="text-sm">
        <ol className="flex items-center gap-2 text-white font-medium">
          <li>Handboek</li>
        </ol>
      </nav>
    );
  }

  /* ───────────────── Hoofdstuk-landingspagina ───────────────── */
  if (pathname.startsWith("/handbook/hoofdstuk/")) {
    const hoofdstukId = pathname.split("/").pop()?.toUpperCase(); // h3 → H3
    if (!hoofdstukId) return null;

    const hoofdstuk = getHoofdstukById(hoofdstukId);
    if (!hoofdstuk) return null;

    return (
      <nav className="text-sm">
        <ol className="flex items-center gap-2 text-white/80">
          <li>
            <Link
              href="/handbook"
              className="hover:text-white transition-colors"
            >
              Handboek
            </Link>
          </li>

          <li className="text-white/40">{">"}</li>

          <li className="text-white font-medium">
            {hoofdstuk.id}. {hoofdstuk.titel}
          </li>
        </ol>
      </nav>
    );
  }

  /* ───────────────── Documentpagina ───────────────── */
  const doc = getDocumentByPath(pathname);
  if (!doc) return null;

  const hoofdstuk = getHoofdstukById(doc.hoofdstuk);
  if (!hoofdstuk) return null;

  const hoofdstukSlug = hoofdstuk.id.toLowerCase(); // H3 → h3

  return (
    <nav className="text-sm">
      <ol className="flex items-center gap-2 text-white/80">
        {/* Handboek */}
        <li>
          <Link
            href="/handbook"
            className="hover:text-white transition-colors"
          >
            Handboek
          </Link>
        </li>

        <li className="text-white/40">{">"}</li>

        {/* Hoofdstuk */}
        <li>
          <Link
            href={`/handbook/hoofdstuk/${hoofdstukSlug}`}
            className="hover:text-white transition-colors"
          >
            {hoofdstuk.id}. {hoofdstuk.titel}
          </Link>
        </li>

        <li className="text-white/40">{">"}</li>

        {/* Document */}
        <li className="text-white font-medium">
          {doc.nummer} {doc.titel}
        </li>
      </ol>
    </nav>
  );
}
