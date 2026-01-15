// app/handbook/hoofdstuk/[id]/page.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  getDocumentsByHoofdstuk,
  getHoofdstukById,
} from "../../handbookRegistry";

export default function HoofdstukPage() {
  const pathname = usePathname();

  // Verwacht: /handbook/hoofdstuk/h3
  const hoofdstukId = pathname.split("/").pop()?.toUpperCase();

  if (!hoofdstukId) {
    return <p>Ongeldig hoofdstuk.</p>;
  }

  const hoofdstuk = getHoofdstukById(hoofdstukId);

  if (!hoofdstuk) {
    return <p>Dit hoofdstuk bestaat niet.</p>;
  }

  const documenten = getDocumentsByHoofdstuk(hoofdstukId);

  return (
    <section className="handbook">
      <header>
        <h1>
          {hoofdstuk.id}. {hoofdstuk.titel}
        </h1>

        <p className="muted">
          {hoofdstuk.intro}
        </p>
      </header>

      <section>
        <ul>
          {documenten.map((doc) => (
            <li key={doc.id}>
              <Link href={doc.path}>
                {doc.nummer} {doc.titel}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
