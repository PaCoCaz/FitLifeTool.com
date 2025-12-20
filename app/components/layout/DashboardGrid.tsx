import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <div className="space-y-4">

      {/* Rij 1: Water | Activiteiten | Voeding */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Water" />
        <Card title="Activiteiten" />
        <Card title="Voeding" />
      </div>

      {/* Rij 2: Weekoverzicht (75%) | Gewicht (25%) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card title="Weekoverzicht" />
        </div>
        <div className="md:col-span-1">
          <Card title="Gewicht" />
        </div>
      </div>

      {/* Rij 3: Dagdoelen – volle breedte */}
      <Card title="Dagdoelen" />

      {/* Rij 4: Tip van vandaag – volle breedte */}
      <Card title="Tip van vandaag" />

    </div>
  );
}
