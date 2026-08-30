import Image from "next/image";
import Link from "next/link";
import PublicHeaderNavigation from "@/components/public/PublicHeaderNavigation";
import type { AppLanguage } from "@/lib/languagePreference";
import {
  getPublicPagePath,
  type PublicPageKey,
} from "@/lib/publicWeb";

export default function PublicHeader({
  locale,
  pageKey,
}: {
  locale: AppLanguage;
  pageKey: PublicPageKey;
}) {
  return (
    <header className="public-web-header">
      <div className="public-web-header-top">
        <div className="public-web-container public-web-header-inner">
          <Link
            href={getPublicPagePath("home", locale)}
            className="public-web-brand"
            aria-label="FitLifeTool"
          >
            <Image
              src="/logo_fitlifetool.png"
              alt="FitLifeTool"
              width={1500}
              height={300}
              sizes="(max-width: 1023px) 200px, 240px"
              priority
            />
          </Link>
          <PublicHeaderNavigation locale={locale} pageKey={pageKey} />
        </div>
      </div>
    </header>
  );
}
