// app/handbook/hoofdstuk/[id]/page.tsx

"use client";

import { usePathname } from "next/navigation";
import { handbookDocuments } from "../../handbookRegistry";
import Link from "next/link";

export default function HoofdstukPage() {
  const pathname = usePathname();

  // Verwacht: /handbook/hoofdstuk/h3
  const hoofdstukId = pathname.split("/").pop()?.toUpperCase();

  if (!hoofdstukId) {
    return (
      <div className="text-gray-600">
        Ongeldig hoofdstuk.
      </div>
    );
  }

  const documenten = handbookDocuments.filter(
    (doc) => doc.hoofdstuk === hoofdstukId
  );

  if (documenten.length === 0) {
    return (
      <div className="text-gray-600">
        Dit hoofdstuk bestaat niet.
      </div>
    );
  }

  const { hoofdstukTitel } = documenten[0];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#191970]">
          {hoofdstukId}. {hoofdstukTitel}
        </h1>

        <p className="text-gray-600 mt-2">
          Overzicht van alle documenten binnen dit hoofdstuk.
        </p>
      </header>

      <ul className="space-y-2">
        {documenten.map((doc) => (
          <li key={doc.id}>
            <Link
              href={doc.path}
              className="text-gray-600 hover:text-[#0BA4E0]"
            >
              {doc.nummer} - {doc.titel}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
