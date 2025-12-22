import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import DashboardGrid from "../components/layout/DashboardGrid";

export default function DashboardPage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="relative flex gap-4">

            {/* Sidebar */}
            <div className="hidden md:block w-[220px] lg:w-[240px] shrink-0">
              <Sidebar />
            </div>

            {/* Dashboard content */}
            <div className="flex-1">
              <DashboardGrid />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
