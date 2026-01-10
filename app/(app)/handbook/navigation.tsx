// app/handbook/navigation.tsx
import Link from "next/link";

export default function HandbookNavigation() {
  return (
    <nav className="space-y-6 text-sm">
      {/* ───────── Deel A ───────── */}
      <div>
        <div className="font-semibold text-gray-700 mb-1">
          Deel A — Fundament
        </div>
        <ul className="space-y-1 text-gray-600">
          <li>
            <Link href="/handbook/chapter-01" className="hover:underline">
              A1. Overzicht & principes
            </Link>
          </li>
        </ul>
      </div>

      {/* ───────── Deel B ───────── */}
      <div>
        <div className="font-semibold text-gray-700 mb-1">
          Deel B — Datamodel & dagstructuur
        </div>
        <ul className="space-y-1 text-gray-600">
          <li>
            <Link href="/handbook/chapter-02" className="hover:underline">
              B1. Profiles & autorisatie
            </Link>
          </li>
          <li>
            <Link href="/handbook/chapter-03" className="hover:underline">
              B2. Dagstructuur & logs
            </Link>
          </li>
          <li>
            <Link href="/handbook/chapter-04" className="hover:underline">
              B3. Dagdoelen, herberekening & morgen-preview
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
