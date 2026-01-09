"use client";

import Image from "next/image";
import Card from "../ui/Card";
import { useLabels } from "../../lib/useLabels";
import { useDailyGoals } from "../../lib/useDailyGoals";

export default function DailyGoalsCard() {
  const t = useLabels("nl").goals;
  const { goals, loading, isActiveDay } = useDailyGoals();

  if (loading) {
    return (
      <Card
        title={t.title}
        icon={<Image src="/target.svg" alt="" width={16} height={16} />}
      >
        <div className="text-sm text-gray-500">
          Doelen laden…
        </div>
      </Card>
    );
  }

  if (!isActiveDay) {
    return (
      <Card
        title={t.title}
        icon={<Image src="/target.svg" alt="" width={16} height={16} />}
      >
        <div className="text-sm text-gray-500">
          Nieuwe doelen worden actief vanaf morgen.
        </div>
      </Card>
    );
  }

  if (!goals) {
    return (
      <Card
        title={t.title}
        icon={<Image src="/target.svg" alt="" width={16} height={16} />}
      >
        <div className="text-sm text-gray-500">
          Geen doelen beschikbaar
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={t.title}
      icon={<Image src="/target.svg" alt="" width={16} height={16} />}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>{t.water}</span>
          <span className="font-medium">
            {goals.waterGoalMl.toLocaleString("nl-NL")} ml
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>{t.activity}</span>
          <span className="font-medium">
            {goals.activityGoalKcal.toLocaleString("nl-NL")} kcal
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>{t.nutrition}</span>
          <span className="font-medium">
            {goals.calorieGoal.toLocaleString("nl-NL")} kcal
          </span>
        </div>
      </div>
    </Card>
  );
}
