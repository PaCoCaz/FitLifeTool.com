import type { Metadata } from "next";
import "./styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
