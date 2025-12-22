import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">

      {/* Rij 1 */}
      <div className="col-span-12 md:col-span-6">
        <Card title="Water" />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Card title="Activiteiten" />
      </div>

      {/* Rij 2 */}
      <div className="col-span-12 md:col-span-6">
        <Card title="Voeding" />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Card title="Gewicht" />
      </div>

      {/* Rij 3 */}
      <div className="col-span-12">
        <Card title="Weekoverzicht" />
      </div>

      {/* Rij 4 */}
      <div className="col-span-12">
        <Card title="Dagdoelen" />
      </div>

      {/* Rij 5 */}
      <div className="col-span-12">
        <Card title="Tip van vandaag" />
      </div>

    </div>
  );
}
