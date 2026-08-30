import type { MetadataRoute } from "next";
import {
  getPublicAlternates,
  getPublicPagePath,
  PUBLIC_LOCALES,
  PUBLIC_PAGE_REGISTRY,
  PUBLIC_SITE_ORIGIN,
  type PublicPageKey,
} from "@/lib/publicWeb";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(PUBLIC_PAGE_REGISTRY) as PublicPageKey[]).flatMap(
    (pageKey) => {
      const page = PUBLIC_PAGE_REGISTRY[pageKey];
      if (!page.indexable) return [];

      const alternates = getPublicAlternates(pageKey);
      return PUBLIC_LOCALES.map((locale) => ({
        url: new URL(
          getPublicPagePath(pageKey, locale),
          PUBLIC_SITE_ORIGIN
        ).href,
        alternates: { languages: alternates.languages },
      }));
    }
  );
}
