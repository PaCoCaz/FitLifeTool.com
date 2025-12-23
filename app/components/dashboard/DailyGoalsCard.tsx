"use client";

import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";

export default function DailyGoalsCard() {
  const t = useLabels("nl").goals;

  // Dummy data – later uit Supabase
  const goals = [
    { label: t.water, value: "2.000 ml" },
    { label: t.activity, value: "30 min" },
    { label: t.nutrition, value: "2.200 kcal" },
  ];

  return (
    <Card
      title={t.title}
      icon={
        <Image
          src="/target.svg"
          alt=""
          width={16}
          height={16}
        />
      }
    >
      <div className="space-y-2 text-sm">
        {goals.map((goal) => (
          <div
            key={goal.label}
            className="flex justify-between text-gray-700"
          >
            <span>{goal.label}</span>
            <span className="font-medium">{goal.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
