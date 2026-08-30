import type { AppLanguage } from "@/lib/languagePreference";
import PublicAuthModalProvider, {
  PublicAuthTrigger,
} from "@/components/public/PublicAuthModalProvider";
import PublicHeader from "@/components/public/PublicHeader";
import {
  PUBLIC_HOME_CONTENT,
  PUBLIC_LOCALE_REGISTRY,
} from "@/lib/publicWeb";

export default function PublicHomepage({ locale }: { locale: AppLanguage }) {
  const content = PUBLIC_HOME_CONTENT[locale];

  return (
    <div className="public-web" lang={PUBLIC_LOCALE_REGISTRY[locale].htmlLang}>
      <PublicAuthModalProvider locale={locale}>
        <PublicHeader locale={locale} pageKey="home" />
        <main className="public-web-main">
          <section className="public-web-container public-web-hero">
            <div className="public-web-hero-copy">
              <p className="public-web-eyebrow">{content.eyebrow}</p>
              <h1>{content.title}</h1>
              <p className="public-web-lead">{content.description}</p>
              <div className="public-web-actions">
                <PublicAuthTrigger
                  mode="register"
                  className="public-web-primary-cta"
                >
                  {content.primaryCta}
                </PublicAuthTrigger>
                <PublicAuthTrigger
                  mode="login"
                  className="public-web-secondary-cta"
                >
                  {content.secondaryCta}
                </PublicAuthTrigger>
              </div>
            </div>
          </section>
        </main>
      </PublicAuthModalProvider>
    </div>
  );
}
