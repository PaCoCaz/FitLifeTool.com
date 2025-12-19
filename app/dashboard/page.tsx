import Header from "../components/layout/Header";
import DashboardGrid from "../components/layout/DashboardGrid";

export default function DashboardPage() {
  return (
    <>
      <Header />

      <main className="pt-20 container-app py-6">
        <DashboardGrid />
      </main>
    </>
  )
}
