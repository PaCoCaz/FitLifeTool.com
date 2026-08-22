import Image from "next/image";
import Link from "next/link";
import type { AppLanguage } from "@/lib/languagePreference";
import {
  getPublicAuthHref,
  getPublicPagePath,
  PUBLIC_HOME_CONTENT,
  PUBLIC_LOCALE_REGISTRY,
  PUBLIC_LOCALES,
} from "@/lib/publicWeb";

export default function PublicHeader({ locale }: { locale: AppLanguage }) {
  const content = PUBLIC_HOME_CONTENT[locale];

  return (
    <header className="public-web-header">
      <div className="public-web-container public-web-header-inner">
        <Link
          href={getPublicPagePath("home", locale)}
          className="public-web-brand"
          aria-label="FitLifeTool"
        >
          <Image
            src="/logo_fitlifetool.png"
            alt="FitLifeTool"
            width={250}
            height={50}
            sizes="(max-width: 480px) 150px, 200px"
            priority
          />
        </Link>

        <nav className="public-web-auth-nav" aria-label={content.login}>
          <Link href={getPublicAuthHref("login", locale)}>
            {content.login}
          </Link>
          <Link
            href={getPublicAuthHref("register", locale)}
            className="public-web-header-cta"
          >
            {content.primaryCta}
          </Link>
        </nav>

        <nav
          className="public-web-language-nav"
          aria-label={content.languageLabel}
        >
          {PUBLIC_LOCALES.map((candidate) => (
            <Link
              key={candidate}
              href={getPublicPagePath("home", candidate)}
              hrefLang={candidate}
              lang={candidate}
              aria-current={candidate === locale ? "page" : undefined}
            >
              {PUBLIC_LOCALE_REGISTRY[candidate].label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
