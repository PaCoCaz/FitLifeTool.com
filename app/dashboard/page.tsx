import Header from "../components/layout/Header";
import { DesktopSidebar } from "../components/layout/Sidebar";
import { MobileNav } from "../components/layout/MobileNav";
import DashboardGrid from "../components/layout/DashboardGrid";

export default function DashboardPage() {
  return (
    <>
      <Header />

      {/* Mobiele horizontale navigatie */}
      <MobileNav />

      <main className="pt-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="relative flex gap-4">

            {/* Desktop sidebar – exacte oude breedtes */}
            <div className="hidden md:block w-[220px] lg:w-[240px] shrink-0">
              <DesktopSidebar />
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
