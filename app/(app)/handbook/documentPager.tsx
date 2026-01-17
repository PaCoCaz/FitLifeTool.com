// app/handbook/documentPager.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { handbookDocuments } from "./handbookRegistry";

export default function DocumentPager() {
  const pathname = usePathname();
  const router = useRouter();

  const index = handbookDocuments.findIndex(
    (doc) => doc.path === pathname
  );

  if (index === -1) return null;

  const current = handbookDocuments[index];

  const hoofdstukDocs = handbookDocuments.filter(
    (doc) => doc.hoofdstuk === current.hoofdstuk
  );

  const localIndex = hoofdstukDocs.findIndex(
    (doc) => doc.id === current.id
  );

  const prev = localIndex > 0 ? hoofdstukDocs[localIndex - 1] : null;
  const next =
    localIndex < hoofdstukDocs.length - 1
      ? hoofdstukDocs[localIndex + 1]
      : null;

  if (!prev && !next) return null;

  const navigate = (path: string) => {
    router.push(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="
        flex items-center justify-between
        mt-10
        border-t border-gray-200
        pt-6
        gap-4
      "
    >
      {/* Vorige */}
      {prev ? (
        <button
          onClick={() => navigate(prev.path)}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded
            bg-[#191970] text-white text-sm font-medium
            hover:bg-[#0BA4E0]
            transition-colors
            whitespace-nowrap
          "
        >
          <span>&lt;</span>
          <span>{prev.nummer}</span>

          {/* Titel zichtbaar tot 615px */}
          <span className="inline max-[615px]:hidden">
            {prev.titel}
          </span>
        </button>
      ) : (
        <span />
      )}

      {/* Volgende */}
      {next ? (
        <button
          onClick={() => navigate(next.path)}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded
            bg-[#191970] text-white text-sm font-medium
            hover:bg-[#0BA4E0]
            transition-colors
            whitespace-nowrap
          "
        >
          <span className="inline max-[615px]:hidden">
            {next.titel}
          </span>

          <span>{next.nummer}</span>
          <span>&gt;</span>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
