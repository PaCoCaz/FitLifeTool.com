// app/components/dashboard/DashboardActionsCard.tsx

"use client";

import Card from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

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
        app-action-button
        app-action-button--active
        flex-1
        h-[40px]
        text-xs
        !justify-between
        rounded-[var(--radius)]
        px-3 py-2
      "
    >
      {label}
      <Image
        src="/plus_sign_circle.svg"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0"
      />
    </Link>
  );
}

export default function DashboardActionsCard() {

  const lang = useLang();
  const t = uiText[lang];

  return (
    <Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

        <ActionButton
          href="/dashboard/drink/search"
          label={t.hydration.addDrink}
        />

        <ActionButton
          href="/dashboard/food/search"
          label={t.nutrition.addFood}
        />

        <ActionButton
          href="/dashboard/activity"
          label={t.activity.addActivity}
        />

        <ActionButton
          href="/dashboard/weight"
          label={t.weight.addWeight}
        />

      </div>
    </Card>
  );
}
