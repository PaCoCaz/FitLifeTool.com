import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PublicAuthModalProvider from "@/components/public/PublicAuthModalProvider";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooterTrialNavigation from "@/components/public/PublicFooterTrialNavigation";
import type { AppLanguage } from "@/lib/languagePreference";
import {
  getPublicHomePath,
  PUBLIC_FOOTER_CONTENT,
  PUBLIC_LOCALE_REGISTRY,
  type PublicPageKey,
} from "@/lib/publicWeb";

export default function PublicPageShell({
  children,
  locale,
  pageKey,
}: {
  children: ReactNode;
  locale: AppLanguage;
  pageKey: PublicPageKey;
}) {
  const footer = PUBLIC_FOOTER_CONTENT[locale];
  const trialLabels = [
    footer.labels[0],
    footer.labels[1],
    footer.faq,
    footer.labels[2],
    footer.labels[3],
    footer.sitemap,
  ] as const;

  return (
    <div className="public-web" lang={PUBLIC_LOCALE_REGISTRY[locale].htmlLang}>
      <PublicAuthModalProvider locale={locale}>
        <PublicHeader locale={locale} pageKey={pageKey} />
        <main className="public-web-main">{children}</main>
        <div className="public-web-slogan-bar">
          <div className="public-web-footer-grid">
            <p>{footer.slogan}</p>
          </div>
        </div>
        <footer className="public-web-footer">
          <div className="public-web-footer-grid public-web-footer-content public-web-footer-original">
            <Link
              href={getPublicHomePath(locale)}
              className="public-web-footer-brand"
              aria-label="FitLifeTool"
            >
              <Image
                src="/logo_fitlifetool.png"
                alt="FitLifeTool"
                width={1500}
                height={300}
                sizes="150px"
              />
            </Link>
            <ul className="public-web-footer-labels">
              {footer.labels.map((label, index) => (
                <li key={label}>
                  {index > 0 && (
                    <span className="public-web-footer-divider" aria-hidden="true" />
                  )}
                  {label}
                </li>
              ))}
            </ul>
            <small className="public-web-footer-copyright">
              © 2026 FitLifeTool.com
            </small>
          </div>
          <div className="public-web-footer-grid public-web-footer-trial">
            <PublicFooterTrialNavigation labels={trialLabels} ariaLabel={footer.navigationLabel} />
            <div className="public-web-footer-trial-bottom">
              <Link
                href={getPublicHomePath(locale)}
                className="public-web-footer-trial-brand"
                aria-label="FitLifeTool"
              >
                <Image
                  src="/images/fitlifetool-heart-footer.png"
                  alt=""
                  width={2048}
                  height={2048}
                  sizes="48px"
                />
              </Link>
              <small className="public-web-footer-trial-copyright">
                © 2026 FitLifeTool.com
              </small>
            </div>
          </div>
        </footer>
      </PublicAuthModalProvider>
    </div>
  );
}
