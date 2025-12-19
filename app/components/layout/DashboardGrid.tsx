import Card from "../ui/Card";

export default function DashboardGrid() {
  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Dagdoel" />
        <Card title="Water" />
        <Card title="Activiteiten" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Voeding" />
        </div>

        <div className="space-y-4">
          <Card title="Weekoverzicht" />
          <Card title="Tip van vandaag" />
        </div>
      </div>

    </div>
  )
}
