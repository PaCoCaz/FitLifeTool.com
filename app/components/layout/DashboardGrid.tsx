import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <Card title="Water" />
      <Card title="Activiteiten" />
      <Card title="Voeding" />
      <Card title="Dagdoel" />
      <Card title="Tips vandaag" />
    </div>
  );
}
