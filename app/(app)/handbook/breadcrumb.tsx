// app/handbook/breadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hoofdstukken, handbookDocuments } from "./handbookRegistry";

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

  /* ───────────────── Hoofdstukpagina (L2) ───────────────── */
  if (pathname.startsWith("/handbook/hoofdstuk/")) {
    const hoofdstukId = pathname.split("/").pop()?.toUpperCase();
    const hoofdstuk = hoofdstukken.find(h => h.id === hoofdstukId);
    if (!hoofdstuk) return null;

    return (
      <nav className="text-sm">
        <ol className="flex items-center gap-2 text-white/80">
          <li>
            <Link href="/handbook" className="hover:text-white">
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

  /* ───────────────── Documentpagina (L3) ───────────────── */
  const doc = handbookDocuments.find(d => d.path === pathname);
  if (!doc) return null;

  const hoofdstuk = hoofdstukken.find(h => h.id === doc.hoofdstuk);
  if (!hoofdstuk) return null;

  return (
    <nav className="text-sm">
      <ol className="flex items-center gap-2 text-white/80">
        {/* Handboek */}
        <li>
          <Link href="/handbook" className="hover:text-white">
            Handboek
          </Link>
        </li>

        {/* ───── Hoofdstuk: alleen tonen >385px ───── */}
        <li className="hidden min-[386px]:inline text-white/40">{">"}</li>

        <li className="hidden min-[386px]:inline">
          <Link href={hoofdstuk.path} className="hover:text-white">
            {/* 386–639px */}
            <span className="inline sm:hidden">
              {hoofdstuk.id}
            </span>

            {/* ≥640px */}
            <span className="hidden sm:inline">
              {hoofdstuk.id}. {hoofdstuk.titel}
            </span>
          </Link>
        </li>

        {/* ───── Document ───── */}
        <li className="text-white/40">{">"}</li>

        <li className="text-white font-medium">
          {doc.nummer} {doc.titel}
        </li>
      </ol>
    </nav>
  );
}
