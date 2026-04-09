// app/components/dashboard/DashboardActionsCard.tsx

"use client";

import Card from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import "@/styles/category.css";

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
        category-card-link
        flex-1
        h-[40px]
        text-xs
        !justify-between
        items-center
        rounded-[var(--radius)]
        px-3 py-2
        transition
        border-[#191970]
        bg-[#191970]
        text-white
        hover:border-[#0095D3]
        hover:bg-[#0095D3]
        hover:text-white
      "
    >
      {label}
      <img
        src="/plus_sign_circle.svg"
        alt=""
        className="category-card-icon"
      />
    </Link>
  );
}

export default function DashboardActionsCard() {
  return (
    <Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

        <ActionButton
          href="/dashboard/drink/search"
          label="Drinken"
        />

        <ActionButton
          href="/dashboard/food/search"
          label="Voeding"
        />

        <ActionButton
          href="/dashboard/activity"
          label="Activiteit"
        />

        <ActionButton
          href="/dashboard/weight"
          label="Gewicht"
        />

      </div>
    </Card>
  );
}