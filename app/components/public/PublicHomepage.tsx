import Image from "next/image";
import type { AppLanguage } from "@/lib/languagePreference";
import { PublicAuthTrigger } from "@/components/public/PublicAuthModalProvider";
import PublicPageShell from "@/components/public/PublicPageShell";
import PublicSectionCard from "@/components/public/PublicSectionCard";
import { PUBLIC_HOME_CONTENT } from "@/lib/publicWeb";

export default function PublicHomepage({ locale }: { locale: AppLanguage }) {
  const content = PUBLIC_HOME_CONTENT[locale];
  const bodySections = [
    ["two", content.sectionTwo],
    ["three", content.sectionThree],
    ["four", content.sectionFour],
    ["five", content.sectionFive],
    ["six", content.sectionSix],
  ] as const;

  return (
    <PublicPageShell locale={locale} pageKey="home">
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
          {bodySections.map(([sectionKey, section]) => (
            <PublicSectionCard key={sectionKey}>
              <section
                className="public-web-section-two"
                aria-labelledby={`public-web-section-${sectionKey}-title`}
              >
                <div className="public-web-section-two-copy">
                  <div className="public-web-section-two-intro">
                    <p className="public-web-eyebrow">{section.eyebrow}</p>
                    <h2 id={`public-web-section-${sectionKey}-title`}>{section.title}</h2>
                    <p className="public-web-lead">{section.description}</p>
                  </div>
                  <div className="public-web-section-two-detail">
                    <div className="public-web-section-two-body public-web-homepage-text-body">
                      {sectionKey === "three" ? (
                        <div className="public-web-section-three-content">
                          <div className="public-web-section-three-paragraphs">
                            <p>{section.body[0]}</p>
                            <div className="public-web-section-three-visual">
                              <Image
                                src="/images/section-three-personal-goal-v2.webp"
                                alt={content.sectionThree.visualAlt}
                                width={750}
                                height={300}
                                sizes="(max-width: 449px) calc(100vw - 28px), (max-width: 519px) calc(100vw - 28px), (max-width: 549px) 275px, (max-width: 639px) 335px, 395px"
                              />
                            </div>
                            <p>{section.body[1]}</p>
                          </div>
                        </div>
                      ) : sectionKey === "five" ? (
                        <div className="public-web-section-three-content">
                          <div className="public-web-section-three-paragraphs public-web-section-five-paragraphs">
                            <p>{section.body[0]}</p>
                            <div className="public-web-section-three-visual public-web-section-five-visual" aria-hidden="true">
                              <Image
                                src="/images/section-five-progress-trends.webp"
                                alt=""
                                width={1000}
                                height={400}
                                sizes="(max-width: 449px) calc(100vw - 28px), (max-width: 519px) calc(100vw - 28px), (max-width: 549px) 275px, (max-width: 639px) 335px, 395px"
                              />
                            </div>
                            <p>{section.body[1]}</p>
                          </div>
                        </div>
                      ) : sectionKey === "six" ? (
                        <div className="public-web-section-three-content">
                          <div className="public-web-section-three-paragraphs public-web-section-six-paragraphs">
                            <p>{section.body[0]}</p>
                            <div className="public-web-section-three-visual public-web-section-six-visual" aria-hidden="true">
                              <Image
                                src="/images/section-six-trust-control.webp"
                                alt=""
                                width={1983}
                                height={793}
                                sizes="(max-width: 449px) calc(100vw - 28px), (max-width: 519px) calc(100vw - 28px), (max-width: 549px) 275px, (max-width: 639px) 335px, 395px"
                              />
                            </div>
                            <p>{section.body[1]}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{section.body[0]}</p>
                          {sectionKey === "two" || sectionKey === "four" ? (
                            <div className="public-web-section-two-photo-row">
                              <div className="public-web-section-two-photo" aria-hidden="true">
                                <span className="public-web-section-two-photo-frame">
                                  <Image
                                    src={sectionKey === "two" ? "/images/section-two-lifestyle-overview-final.webp" : "/images/section-four-activity-progress.webp"}
                                    alt=""
                                    fill
                                    sizes="(max-width: 449px) calc(100vw - 28px), (max-width: 519px) calc(100vw - 28px), (max-width: 549px) 275px, (max-width: 639px) 335px, 395px"
                                  />
                                </span>
                              </div>
                              <p>{section.body[1]}</p>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </PublicSectionCard>
          ))}
          <PublicSectionCard>
            <section className="public-web-section-two" aria-labelledby="public-web-section-seven-title">
              <div className="public-web-section-two-copy">
                <p className="public-web-eyebrow">{content.sectionSeven.eyebrow}</p>
                <h2 id="public-web-section-seven-title">{content.sectionSeven.title}</h2>
                <p className="public-web-lead">{content.sectionSeven.description}</p>
                <div className="public-web-actions public-web-homepage-final-actions">
                  <PublicAuthTrigger mode="register" className="public-web-primary-cta">
                    {content.sectionSeven.primaryCta}
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" fill="none">
                      <path d="M2.5 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </PublicAuthTrigger>
                </div>
              </div>
            </section>
          </PublicSectionCard>
    </PublicPageShell>
  );
}
