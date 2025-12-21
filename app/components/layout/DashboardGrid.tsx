import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <div className="space-y-4">

      {/* RIJ 1 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <Card title="Water" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Card title="Activiteiten" />
        </div>
        {/* RIJ 2 */}
        <div className="col-span-12 md:col-span-6">
          <Card title="Voeding" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Card title="Gewicht" />
        </div>
      </div>

      {/* RIJ 3 */}
      <Card title="Weekoverzicht" />

      {/* RIJ 4 */}
      <Card title="Dagdoelen" />

      {/* RIJ 5 */}
      <Card title="Tip van vandaag" />

    </div>
  );
}
