"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useLabels } from "@/lib/useLabels";

export default function TipOfTheDayCard() {
  const t = useLabels("nl").tip;

  // Dummy content – later Supabase / AI
  const tip =
    "Drink bij elke maaltijd een glas water om je dagdoel makkelijker te halen.";

  return (
    <Card
      header={
        <CardHeader
          icon="/lightbulb.svg"
          title="Tip van vandaag"
        />
      }
    >
      <p className="text-sm text-gray-700 leading-relaxed">
        {tip}
      </p>
    </Card>
  );
}
