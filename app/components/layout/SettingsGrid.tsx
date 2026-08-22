//  app/(app)/components/layout/SettingsGrid.tsx

"use client";

import AccountCard from "@/components/settings/AccountCard";
import BodyCard from "@/components/settings/BodyCard";
import LifestyleCard from "@/components/settings/LifestyleCard";
import GoalCard from "@/components/settings/GoalCard";
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import RegionCard from "@/components/settings/RegionCard";
import PasswordChangeCard from "@/components/settings/PasswordChangeCard";
import { useLang } from "@/lib/useLang";

export default function SettingsGrid() {
  const language = useLang();

  return (
    <section className="grid grid-cols-12 auto-rows-auto gap-4 items-start">

      {/* Rij 1 */}

      <div className="col-span-12 md:col-span-6">
        <AccountCard />
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
        <SubscriptionCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <RegionCard />
      </div>

      {/* Rij 4 */}

      <div className="col-span-12 md:col-span-6">
        <PasswordChangeCard language={language} />
      </div>

    </section>
  );
}
