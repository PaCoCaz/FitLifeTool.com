"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useLabels } from "@/lib/useLabels";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

export default function TipOfTheDayCard() {

  const langCode = useLang();
  const t = uiText[langCode];

  return (
    <Card
      header={
        <CardHeader
          icon="/lightbulb.svg"
          title={t.common.tipOfTheDay}
        />
      }
    >
      <p className="text-sm text-gray-700 leading-relaxed">
        {t.common.tipHydration}
      </p>
    </Card>
  );
}
