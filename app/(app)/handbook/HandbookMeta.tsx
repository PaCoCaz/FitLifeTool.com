// app/(app)/handbook/HandbookMeta.tsx

"use client";

import { usePathname } from "next/navigation";
import { handbookDocuments } from "./handbookRegistry";

const statusLabels = {
  draft: "Concept",
  review: "Controle vereist",
  current: "Actueel",
};

export default function HandbookMeta() {
  const pathname = usePathname();

  const doc = handbookDocuments.find(
    d => d.path === pathname
  );

  if (!doc) return null;

  return (
    <div className="mb-8 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
      {doc.status && (
        <div>
          <strong>Status:</strong>{" "}
          {statusLabels[doc.status]}
        </div>
      )}

      {doc.updated && (
        <div>
          <strong>Laatst bijgewerkt:</strong>{" "}
          {new Date(doc.updated).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}