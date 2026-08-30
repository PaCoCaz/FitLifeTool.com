"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AppLanguage } from "@/lib/languagePreference";
import { PublicAuthTrigger } from "@/components/public/PublicAuthModalProvider";
import {
  getPublicPagePath,
  PUBLIC_HEADER_CONTENT,
  PUBLIC_LOCALE_REGISTRY,
  PUBLIC_LOCALES,
  type PublicPageKey,
} from "@/lib/publicWeb";

type OpenPanel = "locale" | "goals" | "knowledge" | null;
type MobileSection = "goals" | "knowledge";
type LocalePresentation = "desktop" | "mobile";

const KNOWLEDGE_GROUPS = [
  { key: "weight" },
  { key: "nutrition" },
  { key: "activity" },
  { key: "hydration" },
] as const;

type KnowledgeGroupKey = (typeof KNOWLEDGE_GROUPS)[number]["key"];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`public-web-menu-chevron${open ? " is-open" : ""}`}
      viewBox="0 0 12 8"
    >
      <path d="m1 1 5 5 5-5" />
    </svg>
  );
}

export default function PublicHeaderNavigation({
  locale,
  pageKey,
}: {
  locale: AppLanguage;
  pageKey: PublicPageKey;
}) {
  const content = PUBLIC_HEADER_CONTENT[locale];
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState<
    Record<MobileSection, boolean>
  >({ goals: false, knowledge: false });
  const [openKnowledgeGroup, setOpenKnowledgeGroup] =
    useState<KnowledgeGroupKey | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const desktopLocaleButtonRef = useRef<HTMLButtonElement>(null);
  const desktopLocalePanelRef = useRef<HTMLDivElement>(null);
  const mobileLocaleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileLocalePanelRef = useRef<HTMLDivElement>(null);
  const localeReturnFocusRef = useRef<HTMLButtonElement | null>(null);
  const goalsButtonRef = useRef<HTMLButtonElement>(null);
  const knowledgeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback((restoreFocus = true) => {
    setMobileOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => mobileButtonRef.current?.focus());
    }
  }, []);

  const closeDesktopPanel = useCallback((restoreFocus = false) => {
    setOpenPanel((current) => {
      if (restoreFocus) {
        const trigger =
          current === "locale"
            ? localeReturnFocusRef.current
            : current === "goals"
              ? goalsButtonRef.current
              : knowledgeButtonRef.current;
        requestAnimationFrame(() => trigger?.focus());
      }
      return null;
    });
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        document.querySelector(
          '.public-web-auth-background[aria-hidden="true"]'
        )
      ) {
        return;
      }
      if (
        (openPanel || mobileOpen) &&
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        closeDesktopPanel();
        closeMobileMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.key !== "Escape") return;
      if (!openPanel && !mobileOpen) return;

      event.preventDefault();
      if (mobileOpen) closeMobileMenu();
      if (openPanel) closeDesktopPanel(true);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDesktopPanel, closeMobileMenu, mobileOpen, openPanel]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    const handleDesktopChange = () => {
      if (desktopQuery.matches) closeMobileMenu(false);
    };
    desktopQuery.addEventListener("change", handleDesktopChange);
    return () =>
      desktopQuery.removeEventListener("change", handleDesktopChange);
  }, [closeMobileMenu]);

  function togglePanel(panel: Exclude<OpenPanel, null>) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function getLocaleRefs(presentation: LocalePresentation) {
    return presentation === "desktop"
      ? {
          buttonRef: desktopLocaleButtonRef,
          panelRef: desktopLocalePanelRef,
        }
      : {
          buttonRef: mobileLocaleButtonRef,
          panelRef: mobileLocalePanelRef,
        };
  }

  function toggleLocale(presentation: LocalePresentation) {
    const { buttonRef } = getLocaleRefs(presentation);
    localeReturnFocusRef.current = buttonRef.current;
    closeMobileMenu(false);
    togglePanel("locale");
  }

  function openLocaleWithKeyboard(presentation: LocalePresentation) {
    const { buttonRef, panelRef } = getLocaleRefs(presentation);
    localeReturnFocusRef.current = buttonRef.current;
    closeMobileMenu(false);
    setOpenPanel("locale");
    requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("a")?.focus()
    );
  }

  function renderLocaleSelector(presentation: LocalePresentation) {
    const { buttonRef, panelRef } = getLocaleRefs(presentation);
    const panelId = `public-web-locale-panel-${presentation}`;

    return (
      <div
        className={`public-web-locale-selector public-web-locale-selector-${presentation}`}
      >
        <button
          ref={buttonRef}
          type="button"
          className="public-web-locale-trigger"
          aria-label={`${content.languageLabel}: ${PUBLIC_LOCALE_REGISTRY[locale].label}`}
          aria-controls={panelId}
          aria-expanded={openPanel === "locale"}
          onClick={() => toggleLocale(presentation)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown") return;
            event.preventDefault();
            openLocaleWithKeyboard(presentation);
          }}
        >
          <Image src="/globe.svg" alt="" width={20} height={20} />
          <span>{locale.toUpperCase()}</span>
          <Chevron open={openPanel === "locale"} />
        </button>

        <div
          ref={panelRef}
          id={panelId}
          className="public-web-locale-panel"
          hidden={openPanel !== "locale"}
        >
          {PUBLIC_LOCALES.map((candidate) => (
            <Link
              key={candidate}
              href={getPublicPagePath(pageKey, candidate)}
              hrefLang={candidate}
              lang={candidate}
              aria-current={candidate === locale ? "page" : undefined}
            >
              <span>{PUBLIC_LOCALE_REGISTRY[candidate].label}</span>
              <span aria-hidden="true">{candidate.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function toggleMobileSection(section: MobileSection) {
    setMobileSections((current) => {
      const open = !current[section];
      return {
        goals: section === "goals" ? open : false,
        knowledge: section === "knowledge" ? open : false,
      };
    });
    if (section === "goals" || mobileSections.knowledge) {
      setOpenKnowledgeGroup(null);
    }
  }

  function toggleKnowledgeGroup(group: KnowledgeGroupKey) {
    setOpenKnowledgeGroup((current) => (current === group ? null : group));
  }

  return (
    <div ref={rootRef} className="public-web-header-navigation">
      <div className="public-web-header-actions">
        {renderLocaleSelector("desktop")}

        <span className="public-web-header-divider" aria-hidden="true" />
        <PublicAuthTrigger
          mode="login"
          className="public-web-header-login"
        >
          {content.login}
        </PublicAuthTrigger>
        <PublicAuthTrigger
          mode="register"
          className="public-web-header-cta"
        >
          {content.headerCta}
        </PublicAuthTrigger>
        <button
          ref={mobileButtonRef}
          type="button"
          className="public-web-mobile-menu-trigger"
          aria-label={mobileOpen ? content.closeMenu : content.openMenu}
          aria-controls="public-web-mobile-menu"
          aria-expanded={mobileOpen}
          onClick={() => {
            setOpenPanel(null);
            setMobileOpen((current) => !current);
          }}
        >
          <span aria-hidden="true" className="public-web-hamburger">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {renderLocaleSelector("mobile")}

      <nav
        className="public-web-desktop-nav"
        aria-label={content.navigationLabel}
      >
        <div className="public-web-container public-web-desktop-nav-inner">
          <button
            ref={goalsButtonRef}
            type="button"
            aria-controls="public-web-goals-panel"
            aria-expanded={openPanel === "goals"}
            onClick={() => togglePanel("goals")}
          >
            {content.goals.label}
            <Chevron open={openPanel === "goals"} />
          </button>
          <button
            ref={knowledgeButtonRef}
            type="button"
            aria-controls="public-web-knowledge-panel"
            aria-expanded={openPanel === "knowledge"}
            onClick={() => togglePanel("knowledge")}
          >
            {content.knowledge.label}
            <Chevron open={openPanel === "knowledge"} />
          </button>

          <div
            id="public-web-goals-panel"
            className="public-web-goals-panel"
            hidden={openPanel !== "goals"}
          >
            {content.goals.items.map((item, index) => (
              <div
                key={item.label}
                className={`public-web-menu-label public-web-goal-label public-web-goal-label-${index + 1}`}
              >
                <span
                  className={`public-web-menu-icon public-web-goal-icon public-web-goal-icon-${index + 1}`}
                  aria-hidden="true"
                />
                <span className="public-web-goal-copy">
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </span>
              </div>
            ))}
          </div>

          <div
            id="public-web-knowledge-panel"
            className="public-web-knowledge-panel"
            hidden={openPanel !== "knowledge"}
          >
            {KNOWLEDGE_GROUPS.map(({ key }) => {
              const group = content.knowledge.groups[key];
              return (
                <section key={key} className="public-web-knowledge-group">
                  <h2>
                    <span
                      className={`public-web-menu-icon public-web-menu-icon-${key}`}
                      aria-hidden="true"
                    />
                    {group.label}
                  </h2>
                  {group.items.map((item) => (
                    <div key={item.label} className="public-web-menu-label">
                      <span>{item.label}</span>
                      <small>{item.description}</small>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <nav
          id="public-web-mobile-menu"
          className="public-web-mobile-menu"
          aria-label={content.navigationLabel}
        >
          <div className="public-web-mobile-menu-content">
            <button
              type="button"
              className="public-web-mobile-section-trigger"
              aria-controls="public-web-mobile-goals"
              aria-expanded={mobileSections.goals}
              onClick={() => toggleMobileSection("goals")}
            >
              {content.goals.label}
              <Chevron open={mobileSections.goals} />
            </button>
            <div
              id="public-web-mobile-goals"
              className="public-web-mobile-section"
              hidden={!mobileSections.goals}
            >
              {content.goals.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`public-web-menu-label public-web-goal-label public-web-goal-label-${index + 1}`}
                >
                  <span
                    className={`public-web-menu-icon public-web-goal-icon public-web-goal-icon-${index + 1}`}
                    aria-hidden="true"
                  />
                  <span className="public-web-goal-copy">
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="public-web-mobile-section-trigger"
              aria-controls="public-web-mobile-knowledge"
              aria-expanded={mobileSections.knowledge}
              onClick={() => toggleMobileSection("knowledge")}
            >
              {content.knowledge.label}
              <Chevron open={mobileSections.knowledge} />
            </button>
            <div
              id="public-web-mobile-knowledge"
              className="public-web-mobile-section public-web-mobile-knowledge"
              hidden={!mobileSections.knowledge}
            >
              {KNOWLEDGE_GROUPS.map(({ key }) => {
                const group = content.knowledge.groups[key];
                const panelId = `public-web-mobile-knowledge-${key}`;
                return (
                  <section
                    key={key}
                    className="public-web-mobile-knowledge-group"
                  >
                    <button
                      type="button"
                      className="public-web-mobile-knowledge-trigger"
                      aria-controls={panelId}
                      aria-expanded={openKnowledgeGroup === key}
                      onClick={() => toggleKnowledgeGroup(key)}
                    >
                      <span
                        className={`public-web-menu-icon public-web-menu-icon-${key}`}
                        aria-hidden="true"
                      />
                      <span>{group.label}</span>
                      <Chevron open={openKnowledgeGroup === key} />
                    </button>
                    <div
                      id={panelId}
                      className="public-web-mobile-knowledge-items"
                      hidden={openKnowledgeGroup !== key}
                    >
                      {group.items.map((item) => (
                        <div key={item.label} className="public-web-menu-label">
                          <span>{item.label}</span>
                          <small>{item.description}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="public-web-mobile-auth-actions">
              <PublicAuthTrigger mode="login">
                {content.login}
              </PublicAuthTrigger>
              <PublicAuthTrigger
                mode="register"
                className="public-web-header-cta"
              >
                {content.headerCta}
              </PublicAuthTrigger>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
