import Header from "../components/layout/Header";
import DashboardGrid from "../components/layout/DashboardGrid";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-4">
        <DashboardGrid />
      </div>
    </main>
  );
}
