import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import DashboardGrid from "../components/layout/DashboardGrid";

export default function DashboardPage() {
  return (
    <>
      {/* Fixed header */}
      <Header />

      {/* Content onder header */}
      <main className="pt-14">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">

            {/* Sidebar – alleen desktop */}
            <Sidebar />

            {/* Dashboard cards */}
            <DashboardGrid />

          </div>
        </div>
      </main>
    </>
  );
}
