"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handbookDocuments } from "./handbookRegistry";

export default function HandbookNavigation() {
  const pathname = usePathname();

  const grouped = handbookDocuments.reduce<Record<string, typeof handbookDocuments>>(
    (acc, doc) => {
      acc[doc.hoofdstuk] ??= [];
      acc[doc.hoofdstuk].push(doc);
      return acc;
    },
    {}
  );

  return (
    <nav className="space-y-8 text-sm">
      {Object.entries(grouped).map(([hoofdstuk, docs]) => {
        const { hoofdstukTitel } = docs[0];

        return (
          <div key={hoofdstuk}>
            <div className="font-semibold text-[#191970] mb-2">
              {hoofdstuk}. {hoofdstukTitel}
            </div>

            <ul className="space-y-1 pl-2 border-l border-gray-200">
              {docs.map((doc) => {
                const isActive = pathname === doc.path;

                return (
                  <li key={doc.id}>
                    <Link
                      href={doc.path}
                      className={
                        isActive
                          ? "text-[#0BA4E0] font-medium"
                          : "text-gray-700 hover:text-[#0BA4E0] transition-colors"
                      }
                    >
                      {doc.nummer} {doc.titel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
