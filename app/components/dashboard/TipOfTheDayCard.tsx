"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import { useLabels } from "@/lib/useLabels";

export default function TipOfTheDayCard() {
  const t = useLabels("nl").tip;

  // Dummy content – later Supabase / AI
  const tip =
    "Drink bij elke maaltijd een glas water om je dagdoel makkelijker te halen.";

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/lightbulb.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <p className="text-sm text-gray-700 leading-relaxed">
        {tip}
      </p>
    </Card>
  );
}
