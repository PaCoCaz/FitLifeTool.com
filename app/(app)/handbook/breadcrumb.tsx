// app/handbook/breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const chapterMap: Record<string, { part: string; title: string }> = {
  "chapter-01": { part: "Deel A", title: "Overzicht & principes" },
  "chapter-02": { part: "Deel B", title: "Profiles & autorisatie" },
  "chapter-03": { part: "Deel B", title: "Dagstructuur & logs" },
  "chapter-04": {
    part: "Deel B",
    title: "Dagdoelen, herberekening & morgen-preview",
  },
};

export default function HandbookBreadcrumb() {
  const pathname = usePathname();
  const segment = pathname.split("/").pop();
  const chapter = segment ? chapterMap[segment] : null;

  return (
    <nav className="text-sm">
      <ol className="flex items-center gap-2 text-white/80">
        <li>
          <Link
            href="/handbook"
            className="hover:underline text-white/80 hover:text-white"
          >
            Handbook
          </Link>
        </li>

        {chapter && (
          <>
            <li className="text-white/40">/</li>
            <li className="text-white/80">
              {chapter.part}
            </li>
            <li className="text-white/40">/</li>
            <li className="text-white font-medium">
              {chapter.title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
