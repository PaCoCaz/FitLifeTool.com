// app/components/dashboard/DashboardActionsCard.tsx

"use client";

import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function DashboardActionsCard() {
  const router = useRouter();

  return (
    <Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

        <button
          onClick={() => router.push("/dashboard/drink/search")}
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
          + Drinken
        </button>

        <button
          onClick={() => router.push("/dashboard/food/search")}
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
          + Voeding
        </button>

        <button
          onClick={() => router.push("/dashboard/activity")}
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
          + Activiteit
        </button>

        <button
          onClick={() => router.push("/dashboard/weight")}
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
          + Gewicht
        </button>

      </div>

    </Card>
  );
}