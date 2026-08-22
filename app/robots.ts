import type { MetadataRoute } from "next";
import { PUBLIC_SITE_ORIGIN } from "@/lib/publicWeb";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/dashboard",
        "/dashboard/",
        "/forgot-password",
        "/handbook",
        "/handbook/",
        "/login",
        "/onboarding",
        "/onboarding/",
        "/register",
        "/reset-password",
        "/settings",
        "/settings/",
      ],
    },
    sitemap: `${PUBLIC_SITE_ORIGIN}/sitemap.xml`,
  };
}
