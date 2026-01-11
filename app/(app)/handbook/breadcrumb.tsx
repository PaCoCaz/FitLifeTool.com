// app/handbook/breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const chapterMap: Record<string, { part: string; title: string }> = {
  "chapter-01": { part: "H1. Core Architecture", title: "1.1 Overview & Principles" },
  "chapter-02": { part: "H2. Data Model & Persistence", title: "2.1 Profiles & Authorization" },
  "chapter-03": { part: "H2. Data Model & Persistence", title: "2.2 Day Structure & Logs" },
  "chapter-04": { part: "H2. Data Model & Persistence", title: "2.3 Daily Goals & Recalculation", },
  "chapter-05": { part: "H3. Goals, Scoring & Progression", title: "3.1 FitLifeScore fundamentals", },
  "chapter-06": { part: "H3. Goals, Scoring & Progression", title: "3.2 Colors & Status aggregation", },
  "chapter-07": { part: "H3. Goals, Scoring & Progression", title: "3.3 Expected vs Actual progress", },
  "chapter-08": { part: "H3. Goals, Scoring & Progression", title: "3.4 Partial completion & Recovery", },
  "chapter-09": { part: "H3. Goals, Scoring & Progression", title: "3.5 Aggregation & Safeguards", },
  "chapter-10": { part: "H4. UI System & Cards", title: "4.1 UI Architecture overview", },
  "chapter-11": { part: "H4. UI System & Cards", title: "4.2 Card system & Composition", },
  "chapter-12": { part: "H4. UI System & Cards", title: "4.3 Layout & Responsiveness", },
  "chapter-13": { part: "H4. UI System & Cards", title: "4.4 Navigation & Context awareness", },
  "chapter-14": { part: "H4. UI System & Cards", title: "4.5 Visual hierarchy & status signaling", },
  "chapter-15": { part: "H5. Extensibility & Roadmap", title: "5.1 Extensibility principles", },
  "chapter-16": { part: "H5. Extensibility & Roadmap", title: "5.2 Feature flags & Gradual rollout", },
  "chapter-17": { part: "H5. Extensibility & Roadmap", title: "5.3 Roadmap assumptions", },
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
            Handboek
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
