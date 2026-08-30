"use client";

import { AuthProvider } from "@/lib/AuthProvider";
import { DashboardProvider } from "@/lib/DashboardStore";
import { GoalProvider } from "@/lib/GoalProvider";
import { LangProvider } from "@/lib/LangProvider";
import { TimeProvider } from "@/lib/TimeProvider";
import { ToastProvider } from "@/lib/ToastProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LangProvider>
        <GoalProvider>
          <TimeProvider>
            <ToastProvider>
              <DashboardProvider>{children}</DashboardProvider>
            </ToastProvider>
          </TimeProvider>
        </GoalProvider>
      </LangProvider>
    </AuthProvider>
  );
}
