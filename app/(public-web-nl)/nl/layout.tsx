import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/public-content.css";
import "@/styles/public-web.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FitLifeTool",
  description: "Personal health & nutrition platform",
};

export default function DutchPublicRootLayout({
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
