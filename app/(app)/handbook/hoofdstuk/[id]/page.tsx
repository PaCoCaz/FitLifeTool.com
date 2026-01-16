// app/handbook/hoofdstuk/[id]/page.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  hoofdstukken,
  handbookDocuments,
} from "../../handbookRegistry";

export default function HoofdstukPage() {
  const pathname = usePathname();

  // Verwacht: /handbook/hoofdstuk/h3
  const hoofdstukId = pathname.split("/").pop()?.toUpperCase();

  if (!hoofdstukId) {
    return <p className="text-gray-600">Ongeldig hoofdstuk.</p>;
  }

  /* ───────────────── Hoofdstuk ───────────────── */
  const hoofdstuk = hoofdstukken.find((h) => h.id === hoofdstukId);

  if (!hoofdstuk) {
    return <p className="text-gray-600">Dit hoofdstuk bestaat niet.</p>;
  }

  /* ───────────────── Documenten ───────────────── */
  const docs = handbookDocuments
    .filter((doc) => doc.hoofdstuk === hoofdstuk.id)
    .sort((a, b) => a.nummer.localeCompare(b.nummer));

  const startDoc = docs.find((doc) => doc.isStart);
  const overigeDocs = docs.filter((doc) => !doc.isStart);

  return (
    <div className="space-y-10">
      {/* ───────────────── Header ───────────────── */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#191970]">
          {hoofdstuk.id}. {hoofdstuk.titel}
        </h1>

        <p className="text-gray-600 max-w-3xl">
          {hoofdstuk.intro}
        </p>
      </header>

      {/* ───────────────── Startdocument ───────────────── */}
      {startDoc && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Startdocument
          </h2>

          <Link
            href={startDoc.path}
            className="inline-block text-[#191970] font-medium hover:text-[#0BA4E0] transition-colors"
          >
            {startDoc.nummer} {startDoc.titel}
          </Link>
        </section>
      )}

      {/* ───────────────── Overige documenten ───────────────── */}
      {overigeDocs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Verdieping
          </h2>

          <ul className="space-y-2 pl-4">
            {overigeDocs.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={doc.path}
                  className="text-gray-700 hover:text-[#0BA4E0] transition-colors"
                >
                  {doc.nummer} {doc.titel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
