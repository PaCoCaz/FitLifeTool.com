"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import { useLabels } from "@/lib/useLabels";
import { useDailyGoals } from "@/lib/useDailyGoals";
import { useTomorrowGoals } from "@/lib/useTomorrowGoals";

export default function DailyGoalsCard() {
  const t = useLabels("nl").goals;

  // STAP 4 — volledige context ophalen
  const {
    goals,
    loading,
    isActiveDay,
    weightKg,
    tdee,
    goal,
  } = useDailyGoals();

  // STAP 4 — correcte morgen-berekening
  const tomorrowGoals = useTomorrowGoals(
    weightKg,
    tdee,
    goal,
    isActiveDay
  );

  const showTomorrowPreview =
    isActiveDay && goals && tomorrowGoals;

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
      {/* ───────── Vandaag ───────── */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>{t.water}</span>
          <span className="font-medium">
            {goals.waterGoalMl.toLocaleString("nl-NL")} ml
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Dagelijkse activiteiten</span>
          <span className="font-medium">
            {goals.activityGoalKcal.toLocaleString("nl-NL")} kcal
          </span>
        </div>

        <div className="text-xs text-gray-400 -mt-1">
          Gebaseerd op je leefstijl. Extra beweging kan je calorie-ruimte vergroten.
        </div>

        <div className="flex justify-between text-gray-700">
          <span>{t.nutrition}</span>
          <span className="font-medium">
            {goals.calorieGoal.toLocaleString("nl-NL")} kcal
          </span>
        </div>
      </div>

      {/* ───────── Morgen-preview ───────── */}
      {showTomorrowPreview && (
        <div className="mt-4 border-t pt-3 text-sm text-gray-500">
          <div className="font-medium text-gray-600 mb-1">
            Vanaf morgen
          </div>

          <div className="mb-2">
            Deze doelen gelden vanaf morgen, op basis van je huidige gewicht en leefstijl.
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>{t.water}</span>
              <span>
                {tomorrowGoals.waterGoalMl.toLocaleString("nl-NL")} ml
              </span>
            </div>

            <div className="flex justify-between">
              <span>Dagelijkse activiteiten</span>
              <span>
                {tomorrowGoals.activityGoalKcal.toLocaleString("nl-NL")} kcal
              </span>
            </div>

            <div className="text-xs text-gray-400 -mt-1">
              Dit is je beweegdoel. Extra activiteiten tellen als bonus.
            </div>

            <div className="flex justify-between">
              <span>{t.nutrition}</span>
              <span>
                {tomorrowGoals.calorieGoal.toLocaleString("nl-NL")} kcal
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Je voortgang van vandaag blijft ongewijzigd.
          </div>
        </div>
      )}
    </Card>
  );
}
