// app/handbook/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HandbookNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const linkClass = (href: string) =>
    isActive(href)
      ? "text-[#191970] font-medium"
      : "text-gray-700 hover:underline";

  return (
    <nav className="space-y-8 text-sm">

      {/* ───────── H1 ───────── */}
      <div>
        <div className="font-semibold text-[#191970] mb-2">
          H1. Core Architecture
        </div>

        <ul className="space-y-1 pl-2 border-l border-gray-200">
          <li>
            <Link
              href="/handbook/chapter-01"
              className={linkClass("/handbook/chapter-01")}
            >
              1.1 Overview & Principles
            </Link>
          </li>
        </ul>
      </div>

      {/* ───────── H2 ───────── */}
      <div>
        <div className="font-semibold text-[#191970] mb-2">
          H2. Data Model & Persistence
        </div>

        <ul className="space-y-1 pl-2 border-l border-gray-200">
          <li>
            <Link
              href="/handbook/chapter-02"
              className={linkClass("/handbook/chapter-02")}
            >
              2.1 Profiles & Authorization
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-03"
              className={linkClass("/handbook/chapter-03")}
            >
              2.2 Day Structure & Logs
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-04"
              className={linkClass("/handbook/chapter-04")}
            >
              2.3 Daily Goals & Recalculation
            </Link>
          </li>
        </ul>
      </div>

      {/* ───────── H3 ───────── */}
      <div>
        <div className="font-semibold text-[#191970] mb-2">
          H3. Goals, Scoring & Progression
        </div>

        <ul className="space-y-1 pl-2 border-l border-gray-200">
          <li>
            <Link
              href="/handbook/chapter-05"
              className={linkClass("/handbook/chapter-05")}
            >
              3.1 FitLifeScore fundamentals
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-06"
              className={linkClass("/handbook/chapter-06")}
            >
              3.2 Colors & Status aggregation
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-07"
              className={linkClass("/handbook/chapter-07")}
            >
              3.3 Expected vs Actual progress
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-08"
              className={linkClass("/handbook/chapter-08")}
            >
              3.4 Partial completion & Recovery
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-09"
              className={linkClass("/handbook/chapter-09")}
            >
              3.5 Aggregation & Safeguards
            </Link>
          </li>
        </ul>
      </div>

      {/* ───────── H4 ───────── */}
      <div>
        <div className="font-semibold text-[#191970] mb-2">
          H4. UI System & Cards
        </div>

        <ul className="space-y-1 pl-2 border-l border-gray-200">
          <li>
            <Link
              href="/handbook/chapter-10"
              className={linkClass("/handbook/chapter-10")}
            >
              4.1 UI Architecture overview
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-11"
              className={linkClass("/handbook/chapter-11")}
            >
              4.2 Card system & Composition
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-12"
              className={linkClass("/handbook/chapter-12")}
            >
              4.3 Layout & Responsiveness
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-13"
              className={linkClass("/handbook/chapter-13")}
            >
              4.4 Navigation & Context awareness
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-14"
              className={linkClass("/handbook/chapter-14")}
            >
              4.5 Visual hierarchy & status signaling
            </Link>
          </li>
        </ul>
      </div>

      {/* ───────── H5 ───────── */}
      <div>
        <div className="font-semibold text-[#191970] mb-2">
          H5. Extensibility & Roadmap
        </div>

        <ul className="space-y-1 pl-2 border-l border-gray-200">
          <li>
            <Link
              href="/handbook/chapter-15"
              className={linkClass("/handbook/chapter-15")}
            >
              5.1 Extensibility principles
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-16"
              className={linkClass("/handbook/chapter-16")}
            >
              5.2 Feature flags & Gradual rollout
            </Link>
          </li>

          <li>
            <Link
              href="/handbook/chapter-17"
              className={linkClass("/handbook/chapter-17")}
            >
              5.3 Roadmap assumptions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
