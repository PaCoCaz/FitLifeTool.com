// app/handbook/navigation.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  hoofdstukken,
  getDocumentsByHoofdstuk,
} from "./handbookRegistry";

export default function HandbookNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8 text-sm">
      {hoofdstukken.map((hoofdstuk) => {
        const docs = getDocumentsByHoofdstuk(hoofdstuk.id);

        return (
          <div key={hoofdstuk.id}>
            {/* Hoofdstuk titel */}
            <div className="font-semibold text-[#191970] mb-2">
              {hoofdstuk.id}. {hoofdstuk.titel}
            </div>

            {/* Documenten */}
            {docs.length > 0 && (
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
            )}
          </div>
        );
      })}
    </nav>
  );
}
