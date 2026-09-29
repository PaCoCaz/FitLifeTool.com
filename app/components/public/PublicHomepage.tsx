import Image from "next/image";
import type { AppLanguage } from "@/lib/languagePreference";
import PublicAuthModalProvider, {
  PublicAuthTrigger,
} from "@/components/public/PublicAuthModalProvider";
import PublicHeader from "@/components/public/PublicHeader";
import PublicSectionCard from "@/components/public/PublicSectionCard";
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
          <section className="public-web-hero">
            <div className="public-web-hero-surface">
              <Image
                className="public-web-hero-background"
                src="/images/hero-background-v2.png"
                alt=""
                fill
                sizes="100vw"
                loading="eager"
              />
              <div className="public-web-hero-media" aria-hidden="true">
                <Image
                  className="public-web-hero-character"
                  src="/images/female-character-v2.png"
                  alt=""
                  width={301}
                  height={290}
                  sizes="(max-width: 63.999rem) min(301px, calc(100vw - 2rem)), 301px"
                />
              </div>
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
                </div>
              </div>
            </div>
          </section>
          <PublicSectionCard />
        </main>
      </PublicAuthModalProvider>
    </div>
  );
}
