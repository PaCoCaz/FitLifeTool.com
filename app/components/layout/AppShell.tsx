// app/components/layout/AppShell.tsx
import Header from "@/components/layout/Header";
import TopNavigation from "@/components/layout/TopNavigation";

const HEADER_HEIGHT = 56;
const TOPNAV_HEIGHT = 40;
const BREADCRUMB_HEIGHT = 44;

const FIXED_OFFSET =
  HEADER_HEIGHT + TOPNAV_HEIGHT + BREADCRUMB_HEIGHT;

export default function AppShell({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <>
      {/* FIXED HEADER */}
      <div
        className="fixed top-0 left-0 right-0 z-40"
        style={{ height: HEADER_HEIGHT }}
      >
        <Header />
      </div>

      {/* FIXED TOP NAV */}
      <div
        className="fixed left-0 right-0 z-40"
        style={{ top: HEADER_HEIGHT, height: TOPNAV_HEIGHT }}
      >
        <TopNavigation />
      </div>

      {/* FIXED BREADCRUMB AREA (altijd aanwezig) */}
      <div
        className="fixed left-0 right-0 z-30 bg-[#191970]"
        style={{
          top: HEADER_HEIGHT + TOPNAV_HEIGHT,
          height: BREADCRUMB_HEIGHT,
        }}
      >
        <div className="container-app h-full flex items-center">
          {breadcrumb ?? null}
        </div>
      </div>

      {/* SCROLLENDE CONTENT */}
      <main
        className="container-app py-6"
        style={{ marginTop: FIXED_OFFSET }}
      >
        {children}
      </main>
    </>
  );
}
