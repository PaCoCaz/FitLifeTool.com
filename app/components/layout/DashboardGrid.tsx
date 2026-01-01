import FitLifeScoreCard from "../dashboard/FitLifeScoreCard";
import WaterCard from "../dashboard/HydrationCard";
import ActivityCard from "../dashboard/ActivityCard";
import NutritionCard from "../dashboard/NutritionCard";
import WeightCard from "../dashboard/WeightCard";
import WeekOverviewCard from "../dashboard/WeekOverviewCard";
import DailyGoalsCard from "../dashboard/DailyGoalsCard";
import TipOfTheDayCard from "../dashboard/TipOfTheDayCard";

export default function DashboardGrid() {
  return (
    <section className="grid grid-cols-12 auto-rows-auto gap-4 items-start">

      {/* Rij 0 — Dagscore */}
      <div className="col-span-12">
        <FitLifeScoreCard />
      </div>

      {/* Rij 1 */}
      <div className="col-span-12 md:col-span-6">
        <WaterCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <ActivityCard />
      </div>

      {/* Rij 2 */}
      <div className="col-span-12 md:col-span-6">
        <NutritionCard />
      </div>

      <div className="col-span-12 md:col-span-6">
        <WeightCard />
      </div>

      {/* Rij 3 */}
      <div className="col-span-12">
        <WeekOverviewCard />
      </div>

      {/* Rij 4 */}
      <div className="col-span-12">
        <DailyGoalsCard />
      </div>

      {/* Rij 5 */}
      <div className="col-span-12">
        <TipOfTheDayCard />
      </div>

    </section>
  );
}
