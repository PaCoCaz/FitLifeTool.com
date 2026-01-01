import type { Metadata } from "next";
import "./styles/globals.css";
import { AuthProvider } from "./lib/AuthProvider";
import { TimeProvider } from "./lib/TimeProvider";
import { ToastProvider } from "./lib/ToastProvider";

/* 🔴 DIT TOEVOEGEN */
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
    <html lang="nl">
      <body>
        <AuthProvider>
          <TimeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
