"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/layout/Header";
import TopNavigation from "../components/layout/TopNavigation";
import DashboardGrid from "../components/layout/DashboardGrid";
import { useUser } from "../lib/AuthProvider";
import { TimeProvider } from "../lib/TimeProvider";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  // Guard: alleen ingelogde users
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Tijdens laden of redirect niets renderen
  if (loading || !user) {
    return null;
  }

  return (
    <>
      <Header />
      <TopNavigation />

      <main className="pt-[85px]">
        <div className="mx-auto max-w-[1200px] px-4">
          <TimeProvider>
            <DashboardGrid />
          </TimeProvider>
        </div>
      </main>
    </>
  );
}
