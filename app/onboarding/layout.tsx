import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import AppProviders from "@/components/providers/AppProviders";
import {
  asPublicLocale,
  PUBLIC_DEFAULT_LOCALE,
  PUBLIC_LOCALE_REGISTRY,
} from "@/lib/publicWeb";
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

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    asPublicLocale((await headers()).get("x-interface-locale")) ??
    PUBLIC_DEFAULT_LOCALE;

  return (
    <html lang={PUBLIC_LOCALE_REGISTRY[locale].htmlLang}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
