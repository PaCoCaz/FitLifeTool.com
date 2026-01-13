// app/handbook/breadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  handbookDocuments,
  getDocumentByPath,
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

    const hoofdstukDocs = handbookDocuments.filter(
      (doc) => doc.hoofdstuk === hoofdstukId
    );

    if (hoofdstukDocs.length === 0) return null;

    const { hoofdstuk, hoofdstukTitel } = hoofdstukDocs[0];

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
            {hoofdstuk}. {hoofdstukTitel}
          </li>
        </ol>
      </nav>
    );
  }

  /* ───────────────── Documentpagina ───────────────── */
  const doc = getDocumentByPath(pathname);
  if (!doc) return null;

  const hoofdstukSlug = doc.hoofdstuk.toLowerCase(); // H3 → h3

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
            {doc.hoofdstuk}. {doc.hoofdstukTitel}
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
