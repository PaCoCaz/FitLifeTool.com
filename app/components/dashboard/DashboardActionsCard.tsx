// app/components/dashboard/DashboardActionsCard.tsx

"use client";

import Card from "@/components/ui/Card";
import Link from "next/link";

function ActionButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        flex items-center justify-center
        rounded-[var(--radius)]
        border
        px-3 py-2
        text-xs font-medium
        transition
        border-[#0095D3]
        text-[#0095D3]
        hover:bg-[#0095D3]
        hover:text-white
      "
    >
      {label}
    </Link>
  );
}

export default function DashboardActionsCard() {
  return (
    <Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

        <ActionButton
          href="/dashboard/drink/search"
          label="+ Drinken"
        />

        <ActionButton
          href="/dashboard/food/search"
          label="+ Voeding"
        />

        <ActionButton
          href="/dashboard/activity"
          label="+ Activiteit"
        />

        <ActionButton
          href="/dashboard/weight"
          label="+ Gewicht"
        />

      </div>
    </Card>
  );
}