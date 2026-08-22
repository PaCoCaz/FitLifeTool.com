import Link from "next/link";
import type { AppLanguage } from "@/lib/languagePreference";
import PublicHeader from "@/components/public/PublicHeader";
import {
  getPublicAuthHref,
  PUBLIC_HOME_CONTENT,
  PUBLIC_LOCALE_REGISTRY,
} from "@/lib/publicWeb";

export default function PublicHomepage({ locale }: { locale: AppLanguage }) {
  const content = PUBLIC_HOME_CONTENT[locale];

  return (
    <div className="public-web" lang={PUBLIC_LOCALE_REGISTRY[locale].htmlLang}>
      <PublicHeader locale={locale} />
      <main className="public-web-main">
        <section className="public-web-container public-web-hero">
          <div className="public-web-hero-copy">
            <p className="public-web-eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="public-web-lead">{content.description}</p>
            <div className="public-web-actions">
              <Link
                href={getPublicAuthHref("register", locale)}
                className="public-web-primary-cta"
              >
                {content.primaryCta}
              </Link>
              <Link
                href={getPublicAuthHref("login", locale)}
                className="public-web-secondary-cta"
              >
                {content.secondaryCta}
              </Link>
            </div>
            <Link
              href={getPublicAuthHref("forgot-password", locale)}
              className="public-web-forgot-link"
            >
              {content.forgotPassword}
            </Link>
          </div>

          <aside className="public-web-foundation-note">
            <p>{content.foundationNotice}</p>
          </aside>
        </section>
      </main>
    </div>
  );
}
