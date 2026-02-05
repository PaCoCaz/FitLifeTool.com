// app/layout.tsx

import type { Metadata } from "next";
import "./styles/globals.css";
import { AuthProvider } from "./lib/AuthProvider";
import { TimeProvider } from "./lib/TimeProvider";
import { ToastProvider } from "./lib/ToastProvider";
import { LangProvider } from "@/lib/LangProvider";

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
            <TimeProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TimeProvider>
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
