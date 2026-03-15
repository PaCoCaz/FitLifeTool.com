//  app/(app)/components/layout/SettingsGrid.tsx

"use client";

import HealthCard from "@/components/settings/HealthCard";
import BodyCard from "@/components/settings/BodyCard";
import LifestyleCard from "@/components/settings/LifestyleCard";
import GoalCard from "@/components/settings/GoalCard";
import LanguageCard from "@/components/settings/LanguageCard";
import SubscriptionCard from "@/components/settings/SubscriptionCard";

export default function SettingsGrid() {
  return (
    <section className="grid grid-cols-12 auto-rows-auto gap-4 items-start">

      {/* Rij 1 */}

      <div className="col-span-12 md:col-span-6">
        <HealthCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <BodyCard />
      </div>

      {/* Rij 2 */}

      <div className="col-span-12 md:col-span-6">
        <LifestyleCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <GoalCard />
      </div>

      {/* Rij 3 */}

      <div className="col-span-12 md:col-span-6">
        <LanguageCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <SubscriptionCard />
      </div>

      {/* Rij 4 */}

    </section>
  );
}