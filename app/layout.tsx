import type { Metadata } from "next";
import "./styles/globals.css";
import { AuthProvider } from "./lib/AuthProvider";

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
