import Link from "next/link";
import { handbookDocuments } from "./handbookRegistry";

export default function HandbookIndexPage() {
  const grouped = handbookDocuments.reduce<Record<string, typeof handbookDocuments>>(
    (acc, doc) => {
      acc[doc.hoofdstuk] ??= [];
      acc[doc.hoofdstuk].push(doc);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-10">
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

      {Object.entries(grouped).map(([hoofdstuk, docs]) => {
        const { hoofdstukTitel, hoofdstukIntro } = docs[0];

        return (
          <section key={hoofdstuk} className="space-y-3">
            <h2 className="text-lg font-semibold text-[#191970]">
              {hoofdstuk}. {hoofdstukTitel}
            </h2>

            <p className="text-sm text-gray-600 max-w-3xl">
              {hoofdstukIntro}
            </p>

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
