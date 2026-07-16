// app/layout.tsx

import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/public-content.css";

import { AuthProvider } from "./lib/AuthProvider";
import { TimeProvider } from "./lib/TimeProvider";
import { ToastProvider } from "./lib/ToastProvider";
import { LangProvider } from "@/lib/LangProvider";
import { GoalProvider } from "@/lib/GoalProvider";
import { DashboardProvider } from "@/lib/DashboardStore";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "FitLifeTool",
  description: "Personal health & nutrition platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LangProvider>
            <GoalProvider>
              <TimeProvider>
                <ToastProvider>
                  <DashboardProvider>
                    {children}
                  </DashboardProvider>
                </ToastProvider>
              </TimeProvider>
            </GoalProvider>
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}