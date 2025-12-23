import WaterCard from "../dashboard/WaterCard";
import ActivityCard from "../dashboard/ActivityCard";
import NutritionCard from "../dashboard/NutritionCard";
import WeightCard from "../dashboard/WeightCard";
import WeekOverviewCard from "../dashboard/WeekOverviewCard";
import DailyGoalsCard from "../dashboard/DailyGoalsCard";
import TipOfTheDayCard from "../dashboard/TipOfTheDayCard";
import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <section className="grid grid-cols-12 auto-rows-fr gap-4 items-stretch">

      {/* Rij 1 */}
      <div className="col-span-12 md:col-span-6 order-1 md:order-none">
        <WaterCard />
      </div>

      <div className="col-span-12 md:col-span-6 order-2 md:order-none">
        <ActivityCard />
      </div>

      {/* Rij 2 */}
      <div className="col-span-12 md:col-span-6 order-3 md:order-none">
        <NutritionCard />
      </div>

      <div className="col-span-12 md:col-span-6 order-4 md:order-none">
        <WeightCard />
      </div>

      {/* Rij 3 */}
      <div className="col-span-12 order-5 md:order-none">
        <WeekOverviewCard />
      </div>

      {/* Rij 4 */}
      <div className="col-span-12 order-6 md:order-none">
        <DailyGoalsCard />
      </div>

      {/* Rij 5 */}
      <div className="col-span-12 order-7 md:order-none">
        <TipOfTheDayCard />
      </div>

    </section>
  );
}
