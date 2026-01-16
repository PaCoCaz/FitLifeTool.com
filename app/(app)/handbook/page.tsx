// app/handbook/page.tsx

import Link from "next/link";
import {
  hoofdstukken,
  handbookDocuments,
} from "./handbookRegistry";

export default function HandbookIndexPage() {
  return (
    <div className="space-y-10">
      {/* ───────────────── Header ───────────────── */}
      <header>
        <h1 className="text-2xl font-semibold text-[#191970]">
          Handboek FitLifeTool
        </h1>

        <p className="mt-2 text-gray-600 max-w-3xl">
          Dit handboek beschrijft de architectuur, logica en ontwerpkeuzes van
          FitLifeTool. Het fungeert als canonieke bron voor ontwikkeling,
          onderhoud en toekomstige uitbreidingen.
        </p>
      </header>

      {/* ───────────────── Hoofdstukken ───────────────── */}
      {hoofdstukken.map((hoofdstuk) => {
        const docs = handbookDocuments.filter(
          (doc) => doc.hoofdstuk === hoofdstuk.id
        );

        if (docs.length === 0) return null;

        return (
          <section key={hoofdstuk.id} className="space-y-3">
            {/* Hoofdstuktitel */}
            <h2 className="text-lg font-semibold text-[#191970]">
              {hoofdstuk.id}. {hoofdstuk.titel}
            </h2>

            {/* Hoofdstuk intro */}
            <p className="text-sm text-gray-600 max-w-3xl">
              {hoofdstuk.intro}
            </p>

            {/* Documenten */}
            <ul className="space-y-1 pl-4 text-sm">
              {docs.map((doc) => (
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
        );
      })}
    </div>
  );
}
