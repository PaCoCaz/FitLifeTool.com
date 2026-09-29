import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { APP_LANGUAGES, asAppLanguage } from "./languagePreference.ts";

const projectRoot = new URL("../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, projectRoot), "utf8");

const [
  registrySource,
  englishRootLayoutSource,
  englishPageSource,
  dutchRootLayoutSource,
  frenchRootLayoutSource,
  germanRootLayoutSource,
  polishRootLayoutSource,
  dutchPageSource,
  frenchPageSource,
  germanPageSource,
  polishPageSource,
  publicHomepageSource,
  publicHeaderSource,
  publicHeaderNavigationSource,
  topNavigationSource,
  publicAuthModalProviderSource,
  registerModalSource,
  loginFormSource,
  registerStepSource,
  publicWebCssSource,
  proxySource,
  uiTextSource,
  sitemapSource,
  robotsSource,
  appRootLayoutSource,
  loginRootLayoutSource,
] = await Promise.all([
  read("app/lib/publicWeb.ts"),
  read("app/(public-web)/layout.tsx"),
  read("app/(public-web)/page.tsx"),
  read("app/(public-web-nl)/nl/layout.tsx"),
  read("app/(public-web-fr)/fr/layout.tsx"),
  read("app/(public-web-de)/de/layout.tsx"),
  read("app/(public-web-pl)/pl/layout.tsx"),
  read("app/(public-web-nl)/nl/page.tsx"),
  read("app/(public-web-fr)/fr/page.tsx"),
  read("app/(public-web-de)/de/page.tsx"),
  read("app/(public-web-pl)/pl/page.tsx"),
  read("app/components/public/PublicHomepage.tsx"),
  read("app/components/public/PublicHeader.tsx"),
  read("app/components/public/PublicHeaderNavigation.tsx"),
  read("app/components/layout/TopNavigation.tsx"),
  read("app/components/public/PublicAuthModalProvider.tsx"),
  read("app/components/auth/RegisterModal.tsx"),
  read("app/components/auth/LoginForm.tsx"),
  read("app/components/auth/RegisterStep.tsx"),
  read("app/styles/public-web.css"),
  read("proxy.ts"),
  read("app/lib/uiText.ts"),
  read("app/sitemap.ts"),
  read("app/robots.ts"),
  read("app/(app)/layout.tsx"),
  read("app/login/layout.tsx"),
]);

test("canonical locale source contains exactly the five supported locales", () => {
  assert.deepEqual(APP_LANGUAGES, ["en", "nl", "fr", "de", "pl"]);
  assert.equal(asAppLanguage("sv"), null);
  assert.match(registrySource, /PUBLIC_LOCALES = APP_LANGUAGES/);
  assert.match(registrySource, /PUBLIC_DEFAULT_LOCALE[^=]*= "en"/);
});

test("homepage pageKey has one explicit unique path per locale", () => {
  for (const mapping of [
    /en: "\/"/,
    /nl: "\/nl"/,
    /fr: "\/fr"/,
    /de: "\/de"/,
    /pl: "\/pl"/,
  ]) {
    assert.match(registrySource, mapping);
  }
  assert.match(registrySource, /getPublicPagePath/);
  assert.doesNotMatch(registrySource, /replace\([^)]*locale/);
});

test("all five explicit locale homepages remain routed", () => {
  for (const [locale, source] of [
    ["en", englishPageSource],
    ["nl", dutchPageSource],
    ["fr", frenchPageSource],
    ["de", germanPageSource],
    ["pl", polishPageSource],
  ] as const) {
    assert.match(source, new RegExp(`getPublicHomeMetadata\\("${locale}"\\)`));
    assert.match(source, new RegExp(`locale="${locale}"`));
  }
});

test("auth entrypoints inherit the allowlisted active locale", () => {
  assert.match(
    registrySource,
    /`\/\$\{entrypoint\}\?lang=\$\{locale\}`/
  );
  assert.match(publicHeaderNavigationSource, /mode="login"/);
  assert.doesNotMatch(publicHeaderNavigationSource, /mode="register"/);
  assert.match(registrySource, /"forgot-password"/);
  assert.doesNotMatch(
    publicHomepageSource,
    /getPublicAuthHref|"forgot-password"|public-web-forgot-link/
  );
  assert.match(publicHomepageSource, /mode="register"/);
  assert.equal(publicHomepageSource.match(/mode="register"/g)?.length, 1);
  assert.doesNotMatch(publicHomepageSource, /mode="login"/);
  assert.doesNotMatch(publicHomepageSource, /public-web-secondary-cta/);
});

test("public header keeps mobile login while Hero owns registration", () => {
  assert.match(
    publicHeaderNavigationSource,
    /className="public-web-header-actions"[\s\S]*?mode="login"[\s\S]*?className="public-web-mobile-menu-trigger"/
  );
  assert.doesNotMatch(
    publicHeaderNavigationSource,
    /className="public-web-header-actions"[\s\S]*?mode="register"[\s\S]*?className="public-web-mobile-menu-trigger"/
  );
  assert.doesNotMatch(publicHeaderNavigationSource, /mode="register"/);
  assert.match(
    publicHeaderNavigationSource,
    /className="public-web-mobile-auth-actions"[\s\S]*?<PublicAuthTrigger mode="login">[\s\S]*?\{content\.login\}[\s\S]*?<\/PublicAuthTrigger>/
  );
  assert.match(publicHomepageSource, /mode="register"/);
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 40rem\) and \(max-width: 63\.999rem\) \{[\s\S]*?\.public-web-mobile-menu-trigger,[\s\S]*?\.public-web-mobile-menu \{\s*display: none;/
  );
});

test("sticky public header keeps the Hero overlap at top and opens desktop panels in the top layer", () => {
  assert.match(publicHeaderNavigationSource, /setScrolled\(window\.scrollY > 0\)/);
  assert.match(publicHeaderNavigationSource, /addEventListener\("scroll", syncScrollState, \{ passive: true \}\)/);
  assert.match(publicHeaderNavigationSource, /removeEventListener\("scroll", syncScrollState\)/);
  assert.match(publicHeaderNavigationSource, /data-scrolled=\{scrolled \? "true" : undefined\}/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{openPanel === "locale"\}/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{openPanel === "goals"\}/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{openPanel === "knowledge"\}/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{mobileOpen\}/);
  assert.match(publicHeaderNavigationSource, /popover=\{presentation === "desktop" \? "manual" : undefined\}/);
  assert.match(publicHeaderNavigationSource, /hidden=\{presentation === "mobile" && openPanel !== "locale"\}/);
  assert.match(publicHeaderNavigationSource, /className="public-web-goals-panel"\s+popover="manual"/);
  assert.match(publicHeaderNavigationSource, /className="public-web-knowledge-panel"\s+popover="manual"/);
  assert.match(publicHeaderNavigationSource, /className="public-web-knowledge-panel"\s+popover="manual"\s*>\s*<div className="public-web-knowledge-grid">/);
  assert.match(publicHeaderNavigationSource, /element\.showPopover\(\)/);
  assert.match(publicHeaderNavigationSource, /element\.hidePopover\(\)/);
  assert.match(publicHeaderNavigationSource, /rootRef\.current\.contains\(event\.target as Node\)/);
  assert.match(
    publicWebCssSource,
    /\.public-web-header:has\(\s*\.public-web-header-navigation\[data-scrolled="true"\]\s*\) \{\s*z-index: 100;/
  );
  assert.match(
    publicWebCssSource,
    /@media \(max-width: 39\.999rem\) \{\s*\.public-web-header:has\(\.public-web-header-navigation \[aria-expanded="true"\]\) \{\s*z-index: 100;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-goals-panel:popover-open,\s*\.public-web-knowledge-panel:popover-open \{\s*display: block;/
  );
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 40rem\) \{\s*\.public-web-goals-panel,\s*\.public-web-knowledge-panel \{\s*max-block-size: max\(0px, calc\(100dvh - 108px - var\(--public-web-panel-spacing\) - var\(--public-web-panel-spacing\)\)\);\s*overflow-y: auto;/
  );
  assert.doesNotMatch(publicWebCssSource, /block-size: max-content;/);
  assert.equal(publicWebCssSource.match(/\.public-web-knowledge-grid \{\s*display: grid;\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/g)?.length, 2);
  assert.equal(
    publicWebCssSource.match(/top: calc\(108px \+ var\(--public-web-panel-spacing\)\);/g)?.length,
    4
  );
});

test("HP-02 uses the approved locale copy and metadata", () => {
  for (const copy of [
    "Insights into your lifestyle",
    "Krijg inzicht in je leefstijl",
    "Des repères pour votre mode de vie",
    "Einblicke in deinen Lebensstil",
    "Wgląd w Twój styl życia",
    "See where you stand throughout the day as you move toward your goal",
    "Zie gedurende de dag waar je staat op weg naar jouw doel",
    "Suivez dans la journée votre progression vers votre objectif",
    "Sieh im Tagesverlauf, wo du auf dem Weg zu deinem Ziel stehst",
    "W ciągu dnia sprawdzaj, gdzie jesteś na drodze do swojego celu",
    "Bring your nutrition, activity, hydration and weight together in one personal overview and track your progress toward your daily goals.",
    "Breng je voeding, beweging, hydratatie en gewicht samen in één persoonlijk overzicht en volg je voortgang richting jouw dagelijkse doelen.",
    "Réunissez alimentation, activité, hydratation et poids dans un aperçu personnalisé et suivez vos progrès vers vos objectifs quotidiens.",
    "Bündle Ernährung, Aktivität, Hydration und Gewicht in deinem persönlichen Überblick und verfolge deinen Fortschritt zu deinen Tageszielen.",
    "Połącz swoje odżywianie, aktywność, nawodnienie i wagę w jednym spersonalizowanym przeglądzie i śledź swoje postępy w realizacji codziennych celów.",
    "FitLifeTool | Daily lifestyle and goal insights",
    "FitLifeTool | Inzicht in je leefstijl en doelen",
    "FitLifeTool | Suivez votre mode de vie et vos objectifs",
    "FitLifeTool | Lebensstil und Ziele im Blick",
    "FitLifeTool | Styl życia i cele pod kontrolą",
    "Bring nutrition, activity, hydration and weight together in one personal overview. See throughout the day where you stand in relation to your goals.",
    "Breng voeding, beweging, hydratatie en gewicht samen in één persoonlijk overzicht. Zie gedurende de dag waar je staat ten opzichte van jouw doel.",
    "Réunissez alimentation, activité physique, hydratation et poids dans une vue personnalisée. Suivez votre progression vers vos objectifs tout au long de la journée.",
    "Bringe Ernährung, Bewegung, Flüssigkeitszufuhr und Gewicht in einer persönlichen Übersicht zusammen. Sieh jederzeit, wo du im Hinblick auf deine Ziele stehst.",
    "Połącz odżywianie, aktywność, nawodnienie i masę ciała w jednym osobistym zestawieniu. Sprawdzaj przez cały dzień, gdzie jesteś względem swoich celów.",
  ]) {
    assert.ok(registrySource.includes(copy), copy);
  }
  assert.equal(registrySource.match(/eyebrow: "/g)?.length, APP_LANGUAGES.length);
  assert.match(publicWebCssSource, /\.public-web-eyebrow \{[^}]*text-transform: none;/);
  const heroContentSource = registrySource
    .split("export const PUBLIC_HOME_CONTENT")[1]
    ?.split("export const PUBLIC_HEADER_CONTENT")[0];
  assert.ok(heroContentSource);
  for (const locale of APP_LANGUAGES) {
    const localeContent = heroContentSource.match(new RegExp(`\\b${locale}: \\{([\\s\\S]*?)\\n  \\},`))?.[1];
    assert.ok(localeContent, locale);
    const title = localeContent.match(/title: "([^"]+)"/)?.[1];
    const description = localeContent.match(/description:\s*"([^"]+)"/)?.[1];
    assert.ok(title && !title.endsWith("."), `${locale} H1 must not end in a period`);
    assert.ok(description?.endsWith("."), `${locale} lead must end in a period`);
  }
});

test("Hero v2 uses the approved full-width background and decorative character composition", () => {
  assert.doesNotMatch(registrySource, /foundationNotice/);
  assert.doesNotMatch(publicHomepageSource, /public-web-foundation-note|<aside/);
  assert.doesNotMatch(publicWebCssSource, /public-web-foundation-note/);
  assert.match(publicHomepageSource, /import Image from "next\/image"/);
  assert.match(publicHomepageSource, /<section className="public-web-hero">/);
  assert.doesNotMatch(
    publicHomepageSource,
    /public-web-container public-web-hero/
  );
  assert.match(
    publicHomepageSource,
    /src="\/images\/hero-background-v2\.png"[\s\S]*?fill[\s\S]*?sizes="100vw"[\s\S]*?public-web-hero-media[\s\S]*?src="\/images\/female-character-v2\.png"[\s\S]*?public-web-hero-copy[\s\S]*?public-web-eyebrow[\s\S]*?<h1>[\s\S]*?public-web-lead[\s\S]*?public-web-actions/
  );
  assert.match(publicHomepageSource, /src="\/images\/female-character-v2\.png"/);
  assert.equal(
    publicHomepageSource.match(/src="\/images\/female-character-v2\.png"/g)
      ?.length,
    1
  );
  assert.match(publicHomepageSource, /alt=""/);
  assert.match(publicHomepageSource, /width=\{301\}/);
  assert.match(publicHomepageSource, /height=\{290\}/);
  assert.match(publicHomepageSource, /sizes="\(max-width: 63\.999rem\)/);
  assert.doesNotMatch(publicHomepageSource, /priority|preload/);
  assert.match(
    publicWebCssSource,
    /\.public-web-hero-surface \{[\s\S]*?position: relative;[\s\S]*?overflow: hidden;[\s\S]*?background: #f5faff;/
  );
  assert.doesNotMatch(
    publicWebCssSource,
    /\.public-web-hero-surface \{[^}]*?(?:border-radius|box-shadow):/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-hero-background \{[\s\S]*?object-fit: cover;[\s\S]*?pointer-events: none;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web h1 \{[\s\S]*?font-size: clamp\(2rem, 8vw, 2\.75rem\);[\s\S]*?font-weight: 700;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-actions \.public-web-primary-cta,[\s\S]*?min-height: 44px;[\s\S]*?white-space: normal;/
  );
  assert.match(
    publicWebCssSource,
    /@media \(max-width: 47\.999rem\) \{\s*\.public-web-header \{\s*margin-bottom: 0;\s*box-shadow: none;\s*\}[\s\S]*?\.public-web-hero-surface \{[\s\S]*?display: block;[\s\S]*?min-height: 0;[\s\S]*?overflow: hidden;/
  );
  assert.doesNotMatch(publicWebCssSource, /\.public-web-hero \{\s*margin-top: -1px;/);
  assert.match(
    publicWebCssSource,
    /@media \(max-width: 47\.999rem\) \{[\s\S]*?\.public-web h1 \{[\s\S]*?max-width: none;[\s\S]*?font-size: clamp\(18\.5px, calc\(17\.5px \+ 0\.4vw\), 19\.5px\);[\s\S]*?\.public-web-actions \{[\s\S]*?flex-direction: column;[\s\S]*?\.public-web-actions \.public-web-primary-cta,[\s\S]*?width: 100%;[\s\S]*?min-height: 44px;/
  );
  assert.match(publicWebCssSource, /\.public-web-eyebrow \{\s*margin-bottom: 7px;/);
  const mobileBaseCss = publicWebCssSource
    .split("@media (max-width: 47.999rem) {")[1]
    ?.split("@media (width < 27.5rem) {")[0];
  assert.ok(mobileBaseCss);
  assert.match(mobileBaseCss, /\.public-web-hero-media \{\s*pointer-events: none;\s*\}/);
  assert.doesNotMatch(mobileBaseCss, /\.public-web-hero-copy::before|\.public-web-hero-character \{\s*display: none;/);
  assert.doesNotMatch(publicWebCssSource, /female-character-mobile-v1\.png|female-character-v1\.png|hero-background-v1\.png/);
  const phoneHeroCss = publicWebCssSource
    .split("@media (width < 27.5rem) {")[1]
    ?.split("@media (min-width: 27.5rem) and (max-width: 47.999rem) {")[0];
  assert.ok(phoneHeroCss);
  assert.match(
    phoneHeroCss,
    /\.public-web-hero \{[^}]*--public-web-content-edge-inset: 14px;[^}]*--public-web-image-exclusion-gap-inline: 6px;[^}]*--public-web-character-width: clamp\(184px, calc\(46\.8571424px \+ 42\.857143vw\), 235px\);[^}]*height: 300px;/
  );
  assert.match(phoneHeroCss, /\.public-web-hero-background \{\s*object-position: center;\s*\}/);
  assert.match(phoneHeroCss, /\.public-web-hero-surface::before \{\s*background:\s*linear-gradient\(\s*180deg,\s*transparent 12%,\s*rgb\(245 250 255 \/ 22%\) 16%,\s*rgb\(245 250 255 \/ 22%\) 23%,\s*transparent 28%\s*\),\s*linear-gradient\(\s*90deg,\s*rgb\(245 250 255 \/ 98%\) 0%,\s*rgb\(245 250 255 \/ 92%\) 36%,\s*rgb\(245 250 255 \/ 64%\) 58%,\s*rgb\(245 250 255 \/ 8%\) 78%\s*\);/);
  assert.match(phoneHeroCss, /\.public-web-hero-copy::before \{\s*content: none;\s*\}/);
  assert.match(phoneHeroCss, /\.public-web-hero-media \{[^}]*position: static;[^}]*background-image: none;/);
  assert.match(phoneHeroCss, /\.public-web-hero-character \{[^}]*float: right;[^}]*display: block;[^}]*right: 0;[^}]*shape-outside: polygon\([\s\S]*?\) border-box;/);
  assert.match(phoneHeroCss ?? "", /\.public-web-hero-surface \{\s*height: 100%;\s*overflow: visible;/);
  assert.match(phoneHeroCss ?? "", /\.public-web-hero-copy \{\s*height: 100%;\s*padding-top: 14px;\s*padding-right: var\(--public-web-content-edge-inset\);\s*padding-left: var\(--public-web-content-edge-inset\);/);
  assert.match(phoneHeroCss ?? "", /\.public-web h1 \{\s*font-size: clamp\(17px, calc\(14\.310924px \+ 0\.840336vw\), 18px\);\s*\}/);
  assert.match(phoneHeroCss ?? "", /\.public-web-lead \{\s*font-size: 13\.4px;\s*line-height: 1\.4;\s*\}/);
  assert.match(phoneHeroCss ?? "", /\.public-web-actions \{\s*position: absolute;\s*z-index: 3;\s*right: var\(--public-web-content-edge-inset\);\s*bottom: 14px;\s*left: var\(--public-web-content-edge-inset\);\s*clear: none;\s*margin-top: 0;/);
  assert.match(phoneHeroCss ?? "", /\.public-web-hero-character \{[^}]*bottom: 0;\s*z-index: 2;\s*margin-top: calc\(300px - var\(--public-web-character-height\)\);/);
  const intermediateHeroCss = publicWebCssSource
    .split("@media (min-width: 27.5rem) and (max-width: 47.999rem) {")[1]
    ?.split("@media (min-width: 440px) and (max-width: 500px) {")[0];
  assert.ok(intermediateHeroCss);
  assert.match(intermediateHeroCss, /--public-web-content-edge-inset: 14px;/);
  assert.match(intermediateHeroCss, /--public-web-image-exclusion-gap-inline: 8px;/);
  assert.match(intermediateHeroCss, /--public-web-character-width: clamp\(220px, calc\(166\.177371px \+ 12\.232416vw\), 260px\);/);
  assert.match(intermediateHeroCss, /--public-web-character-right: clamp\(-15px,[^;]*0px\);/);
  assert.match(intermediateHeroCss, /--public-web-hero-height: clamp\(275px, calc\(336\.666667px - 8\.333333vw\), 300px\);/);
  assert.match(intermediateHeroCss, /height: var\(--public-web-hero-height\);/);
  const intermediateHeroHeight = (viewportWidth: number, scrollbarGutter = 0) =>
    Math.min(300, Math.max(275, 336.666667 - (viewportWidth - scrollbarGutter) / 12));
  for (const gutter of [0, 15]) {
    assert.ok(Math.abs(intermediateHeroHeight(440, gutter) - 300) < 0.01);
    assert.ok(Math.abs(intermediateHeroHeight(767, gutter) - 275) < 0.01);
    assert.ok(intermediateHeroHeight(600, gutter) < intermediateHeroHeight(500, gutter));
  }
  assert.match(intermediateHeroCss, /\.public-web-hero-surface \{\s*overflow: visible;/);
  assert.match(intermediateHeroCss, /\.public-web-hero-copy \{[^}]*padding-top: 14px;\s*padding-right: var\(--public-web-content-edge-inset\);\s*padding-left: var\(--public-web-content-edge-inset\);/);
  assert.match(intermediateHeroCss, /\.public-web-hero-copy::before \{\s*content: none;\s*\}/);
  assert.match(intermediateHeroCss, /\.public-web-eyebrow \{\s*font-size: clamp\(12px, calc\(10\.6536px \+ 0\.306vw\), 13px\);/);
  assert.match(intermediateHeroCss, /\.public-web h1 \{\s*font-size: clamp\(\s*19\.26px,\s*calc\(12\.88198px \+ 1\.44955vw\),\s*24px\s*\);/);
  assert.match(intermediateHeroCss, /\.public-web-lead \{\s*font-size: clamp\(\s*13\.5px,\s*calc\(10\.808828px \+ 0\.61163vw\),\s*15\.5px\s*\);\s*line-height: 1\.35;/);
  assert.match(intermediateHeroCss, /\.public-web-actions \{[^}]*position: absolute;\s*right: var\(--public-web-content-edge-inset\);\s*bottom: 14px;\s*left: var\(--public-web-content-edge-inset\);\s*clear: none;\s*flex-direction: row;/);
  assert.match(intermediateHeroCss, /\.public-web-hero-media \{[\s\S]*?position: static;[\s\S]*?display: block;[\s\S]*?background-image: none;/);
  assert.match(intermediateHeroCss, /\.public-web-hero-media \{[^}]*padding-top: calc\(var\(--public-web-hero-height\) - var\(--public-web-character-height\)\);\s*margin-bottom: calc\(var\(--public-web-character-height\) - var\(--public-web-hero-height\)\);/);
  const intermediateCharacterCss = intermediateHeroCss.match(/\.public-web-hero-character \{([^}]*)\}/)?.[1];
  assert.ok(intermediateCharacterCss);
  assert.match(intermediateCharacterCss, /float: right;[\s\S]*?width: var\(--public-web-character-width\);[\s\S]*?margin-top: 0;[\s\S]*?margin-right: var\(--public-web-character-right\);/);
  assert.match(intermediateCharacterCss, /shape-outside: polygon\(\s*100% 0%,[\s\S]*?100% 100%\s*\) border-box;/);
  assert.deepEqual(
    [...intermediateCharacterCss.matchAll(/calc\(([\d.]+)% - var\(--public-web-image-exclusion-gap-inline\)\) ([\d.]+)%/g)]
      .map(([, x, y]) => [y, x]),
    [
      ["0", "53.16"], ["6.90", "41.53"], ["10.34", "41.86"],
      ["13.79", "35.22"], ["20.69", "31.23"], ["25.86", "27.57"],
      ["37.93", "27.57"], ["39.31", "28.90"], ["39.66", "20.93"],
      ["40.34", "20.60"], ["44.83", "15.28"], ["55.17", "12.62"],
      ["65.52", "8.97"], ["79.31", "6.98"], ["89.66", "3.99"],
      ["99.66", "2.66"], ["100", "2.66"],
    ]
  );
  assert.doesNotMatch(intermediateCharacterCss, /shape-margin:/);
  assert.doesNotMatch(intermediateHeroCss, /display: contents|display: flow-root|overflow: hidden|shape-outside: url\(/);
  const firstLineReadabilityCss = publicWebCssSource
    .split("@media (min-width: 440px) and (max-width: 500px) {")[1]
    ?.split("@media (min-width: 40rem) and (max-width: 63.999rem) {")[0];
  assert.ok(firstLineReadabilityCss);
  assert.match(firstLineReadabilityCss, /\.public-web-hero-surface::before \{\s*background:\s*linear-gradient\(\s*180deg,\s*transparent 39px,\s*rgb\(245 250 255 \/ 22%\) 44px,\s*rgb\(245 250 255 \/ 22%\) 49\.5px,\s*transparent 59\.675px\s*\),\s*linear-gradient\(\s*90deg,\s*rgb\(245 250 255 \/ 98%\) 0%,\s*rgb\(245 250 255 \/ 92%\) 36%,\s*rgb\(245 250 255 \/ 64%\) 58%,\s*rgb\(245 250 255 \/ 8%\) 78%\s*\);/);
  const desktopHeroCss = publicWebCssSource
    .split("@media (min-width: 64rem) {")[1]
    ?.split("@media (min-width: 71.875rem) {")[0];
  assert.ok(desktopHeroCss);
  assert.match(desktopHeroCss, /--public-web-content-edge-inset: 14px;/);
  assert.match(desktopHeroCss, /--public-web-image-exclusion-gap-inline: 25px;/);
  assert.match(desktopHeroCss, /\.public-web-hero \{[^}]*max-width: 71\.875rem;\s*height: 15\.625rem;/);
  assert.match(desktopHeroCss, /\.public-web-hero-surface \{[^}]*display: block;[^}]*overflow: visible;/);
  const desktopCopyCss = desktopHeroCss.match(/\.public-web-hero-copy \{([^}]*)\}/)?.[1];
  assert.ok(desktopCopyCss);
  assert.match(desktopCopyCss, /display: block;\s*width: auto;[^}]*padding: 14px var\(--public-web-content-edge-inset\) 14px;/);
  assert.doesNotMatch(desktopCopyCss, /display: grid|grid-template-rows|padding: 28px 3rem/);
  assert.match(desktopHeroCss, /\.public-web-eyebrow \{\s*margin-bottom: 7px;\s*font-size: 13px;/);
  assert.match(desktopHeroCss, /\.public-web h1 \{[^}]*max-width: none;\s*width: auto;[^}]*font-size: clamp\(28px, calc\(16px \+ 1\.171875vw\), 30px\);\s*line-height: 1\.08;/);
  assert.match(desktopHeroCss, /\.public-web-lead \{[^}]*max-width: none;[^}]*font-size: 16\.5px;\s*line-height: 1\.35;/);
  assert.match(desktopHeroCss, /\.public-web-actions \{[^}]*right: var\(--public-web-content-edge-inset\);\s*bottom: 14px;\s*left: var\(--public-web-content-edge-inset\);/);
  assert.match(desktopHeroCss, /\.public-web-hero-media \{[^}]*position: static;\s*display: block;/);
  const desktopCharacterCss = desktopHeroCss.match(/\.public-web-hero-character \{([^}]*)\}/)?.[1];
  assert.ok(desktopCharacterCss);
  assert.match(desktopCharacterCss, /float: right;[\s\S]*?width: 301px;\s*height: 290px;[\s\S]*?margin-top: -40px;\s*margin-right: calc\(21% - 10\.40625rem\);/);
  assert.match(desktopCharacterCss, /shape-outside: polygon\(\s*100% 0%,[\s\S]*?100% 100%\s*\) border-box;/);
  assert.doesNotMatch(desktopCharacterCss, /shape-margin:|transform:/);
  assert.doesNotMatch(desktopHeroCss, /grid-template-columns: minmax\(0, 1\.3fr\) minmax\(22rem, 0\.7fr\);/);
  assert.doesNotMatch(publicWebCssSource, /\.public-web-hero::before/);
  assert.match(
    publicWebCssSource,
    /\.public-web-hero-character \{[\s\S]*?pointer-events: none;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header \{[^}]*position: sticky;\s*top: 0;\s*z-index: 1;/
  );
  const tabletHeroCss = publicWebCssSource
    .split("@media (min-width: 48rem) and (max-width: 63.999rem) {")[1]
    ?.split("@media (min-width: 64rem) {")[0];
  assert.ok(tabletHeroCss);
  assert.match(tabletHeroCss, /--public-web-content-edge-inset: 14px;/);
  assert.match(tabletHeroCss, /--public-web-image-exclusion-gap-inline: 25px;/);
  assert.match(tabletHeroCss, /--public-web-character-width: clamp\(16\.25rem, calc\(8\.53rem \+ 16\.08vw\), 18\.8125rem\);/);
  assert.match(tabletHeroCss, /--public-web-character-right: clamp\(-15px, calc\(21% - 205\.62px \+ 3\.8203125vw\), 49px\);/);
  assert.match(tabletHeroCss, /\.public-web-hero \{[^}]*height: 250px;/);
  assert.match(tabletHeroCss, /\.public-web-hero-surface \{[^}]*display: block;[^}]*overflow: visible;/);
  assert.match(tabletHeroCss, /\.public-web-hero-copy \{[^}]*display: block;\s*width: auto;[^}]*padding: 14px var\(--public-web-content-edge-inset\) 14px;/);
  assert.match(tabletHeroCss, /\.public-web-eyebrow \{\s*margin-bottom: 7px;\s*font-size: 13px;/);
  assert.match(tabletHeroCss, /\.public-web h1 \{[^}]*max-width: none;\s*width: auto;[^}]*font-size: clamp\(24px, calc\(12px \+ 1\.5625vw\), 28px\);/);
  assert.match(tabletHeroCss, /\.public-web-lead \{[^}]*max-width: none;[^}]*font-size: clamp\(15\.5px, calc\(12\.5px \+ 0\.390625vw\), 16\.5px\);\s*line-height: 1\.35;/);
  assert.match(tabletHeroCss, /\.public-web-actions \{[^}]*right: var\(--public-web-content-edge-inset\);\s*bottom: 14px;\s*left: var\(--public-web-content-edge-inset\);/);
  assert.match(tabletHeroCss, /\.public-web-hero-media \{[^}]*position: static;\s*display: block;/);
  const tabletCharacterCss = tabletHeroCss.match(/\.public-web-hero-character \{([^}]*)\}/)?.[1];
  assert.ok(tabletCharacterCss);
  assert.match(tabletCharacterCss, /float: right;[\s\S]*?width: var\(--public-web-character-width\);[\s\S]*?margin-top: calc\(250px - var\(--public-web-character-height\)\);[\s\S]*?margin-right: var\(--public-web-character-right\);/);
  assert.match(tabletCharacterCss, /shape-outside: polygon\(\s*100% 0%,[\s\S]*?100% 100%\s*\) border-box;/);
  assert.deepEqual(
    [...tabletCharacterCss.matchAll(/calc\(([\d.]+)% - var\(--public-web-image-exclusion-gap-inline\)\) ([\d.]+)%/g)]
      .map(([, x, y]) => [y, x]),
    [...intermediateCharacterCss.matchAll(/calc\(([\d.]+)% - var\(--public-web-image-exclusion-gap-inline\)\) ([\d.]+)%/g)]
      .map(([, x, y]) => [y, x])
  );
  assert.deepEqual(
    [...desktopCharacterCss.matchAll(/calc\(([\d.]+)% - var\(--public-web-image-exclusion-gap-inline\)\) ([\d.]+)%/g)]
      .map(([, x, y]) => [y, x]),
    [...tabletCharacterCss.matchAll(/calc\(([\d.]+)% - var\(--public-web-image-exclusion-gap-inline\)\) ([\d.]+)%/g)]
      .map(([, x, y]) => [y, x])
  );
  assert.doesNotMatch(tabletHeroCss, /shape-margin:|display: flow-root|overflow: hidden|width: clamp\(30\.875rem/);
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 40rem\) and \(max-width: 63\.999rem\) \{[\s\S]*?\.public-web-mobile-menu-trigger,[\s\S]*?\.public-web-mobile-menu \{\s*display: none;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-desktop-nav-inner > button \{[\s\S]*?z-index: 42;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-goals-panel,[\s\S]*?\.public-web-knowledge-panel \{[\s\S]*?z-index: 80;/
  );
  assert.doesNotMatch(
    publicHomepageSource + publicWebCssSource,
    /public-web-hero-character-(?:stack|overlap)/
  );
  assert.doesNotMatch(publicWebCssSource, /public-web-forgot-link/);
  assert.doesNotMatch(publicWebCssSource, /overflow-wrap: anywhere/);
  assert.doesNotMatch(publicHomepageSource, /<br\s*\/?\s*>/);
});

test("metadata foundation has self-canonical, reciprocal hreflang and x-default", () => {
  assert.match(registrySource, /getLocalizedPublicAlternates/);
  assert.match(
    registrySource,
    /"x-default": languages\[PUBLIC_DEFAULT_LOCALE\]/
  );
  assert.match(registrySource, /canonical: new URL\(/);
  assert.match(registrySource, /robots: \{ index: false, follow: true \}/);
  assert.match(registrySource, /openGraph:/);
});

test("static public roots render server-side document language without request APIs", () => {
  assert.match(englishRootLayoutSource, /<html lang="en">/);
  const localizedRoots = [
    ["nl", dutchRootLayoutSource],
    ["fr", frenchRootLayoutSource],
    ["de", germanRootLayoutSource],
    ["pl", polishRootLayoutSource],
  ] as const;

  for (const [locale, source] of localizedRoots) {
    assert.match(source, new RegExp(`<html lang="${locale}">`));
  }

  for (const source of [englishRootLayoutSource, ...localizedRoots.map(([, value]) => value)]) {
    assert.doesNotMatch(source, /headers\(|cookies\(/);
    assert.doesNotMatch(source, /maximumScale/);
    assert.doesNotMatch(source, /document\.documentElement/);
  }
});

test("request-dependent roots retain allowlisted locale inheritance", () => {
  for (const source of [appRootLayoutSource, loginRootLayoutSource]) {
    assert.match(source, /headers\(\)/);
    assert.match(source, /asPublicLocale/);
    assert.match(source, /PUBLIC_DEFAULT_LOCALE/);
    assert.doesNotMatch(source, /maximumScale/);
  }

  assert.match(proxySource, /requestHeaders\.set\("x-pathname", pathname\)/);
  assert.match(proxySource, /requestHeaders\.delete\("x-interface-locale"\)/);
  assert.match(proxySource, /asAppLanguage/);
  assert.match(proxySource, /requestHeaders\.set\("x-interface-locale"/);
});

test("public homepage renderer and language switcher stay server-only", () => {
  assert.doesNotMatch(publicHomepageSource, /["']use client["']/);
  assert.doesNotMatch(publicHeaderSource, /["']use client["']/);
  assert.match(publicHeaderNavigationSource, /^["']use client["']/);
  assert.match(publicHeaderNavigationSource, /PUBLIC_LOCALES\.map/);
  assert.match(publicHeaderNavigationSource, /aria-current/);
  assert.match(publicHeaderNavigationSource, /hrefLang/);
  assert.doesNotMatch(publicHomepageSource, /AppProviders|AuthProvider|useUser/);
  assert.doesNotMatch(publicHeaderSource, /AppProviders|AuthProvider|useUser/);
  assert.doesNotMatch(publicHeaderNavigationSource, /AppProviders|AuthProvider|useUser|supabase/i);
});

test("shared public header requires explicit page context", () => {
  assert.match(publicHeaderSource, /pageKey: PublicPageKey/);
  assert.match(publicHeaderSource, /pageKey=\{pageKey\}/);
  assert.match(publicHeaderNavigationSource, /pageKey: PublicPageKey/);
  assert.match(
    publicHeaderNavigationSource,
    /getPublicPagePath\(pageKey, candidate\)/
  );
  assert.match(publicHomepageSource, /<PublicHeader locale=\{locale\} pageKey="home" \/>/);
});

test("HP-01 keeps unpublished destinations non-interactive and route-safe", () => {
  assert.doesNotMatch(
    publicHeaderNavigationSource,
    /href=["']#|\/uitleg|\/prijzen|\/pricing|\/gezondheid|\/voeding|\/hydratatie|\/beweging|\/gewicht|\/herstel|\/leefstijl/
  );
  assert.match(publicHeaderNavigationSource, /className="public-web-menu-label"/);
  assert.match(publicHeaderNavigationSource, /PublicAuthTrigger/);
});

test("legacy public category navigation stays removed from the shared app shell", () => {
  assert.doesNotMatch(topNavigationSource, /PUBLIC_NAV_ITEMS/);
  assert.doesNotMatch(
    topNavigationSource,
    /\/gezondheid|\/voeding|\/beweging|\/hydratatie|\/gewicht|\/herstel|\/leefstijl/
  );
  assert.match(topNavigationSource, /isLoggedIn[\s\S]*?getAuthNavItems/);
});

test("HP-01K reuses one accessible auth dialog without replacing direct routes", () => {
  assert.match(publicHomepageSource, /PublicAuthModalProvider locale=\{locale\}/);
  assert.match(publicAuthModalProviderSource, /useState<PublicTopLevelOverlay>\(null\)/);
  assert.doesNotMatch(
    publicAuthModalProviderSource,
    /import RegisterModal[\s\S]*?from "@\/components\/auth\/RegisterModal"/
  );
  assert.match(
    publicAuthModalProviderSource,
    /import\("@\/components\/auth\/RegisterModal"\)/
  );
  assert.match(
    publicAuthModalProviderSource,
    /authModules && mode \?[\s\S]*?<LoadedAuthModal/
  );
  assert.doesNotMatch(
    publicAuthModalProviderSource,
    /import\s+\{?[^;]*\b(?:LangProvider|useSetInterfaceLanguage|useLang)\b[^;]*from/
  );
  assert.doesNotMatch(
    publicAuthModalProviderSource,
    /from ["']@\/lib\/(?:supabase|AuthProvider)/
  );
  assert.match(
    publicAuthModalProviderSource,
    /Promise\.all\(\[[\s\S]*?import\("@\/components\/auth\/RegisterModal"\)[\s\S]*?import\("@\/lib\/LangProvider"\)[\s\S]*?\]\)/
  );
  assert.match(
    publicAuthModalProviderSource,
    /<LangProvider>[\s\S]*?<LocalizedAuthModal/
  );
  assert.match(
    publicAuthModalProviderSource,
    /setInterfaceLanguage\(locale\);[\s\S]*?setReadyLocale\(locale\);[\s\S]*?readyLocale !== locale[\s\S]*?<RegisterModal/
  );
  assert.match(publicAuthModalProviderSource, /setAttribute\("inert", ""\)/);
  assert.match(registerModalSource, /<LoginForm/);
  assert.match(registerModalSource, /<RegisterStep/);
  assert.match(registerModalSource, /role="dialog"/);
  assert.match(registerModalSource, /aria-modal="true"/);
  assert.match(registerModalSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(registerModalSource, /event\.key === "Escape"/);
  assert.match(registerModalSource, /event\.key !== "Tab"/);
  assert.match(registerModalSource, /returnFocus\?\.isConnected/);
  assert.match(registerModalSource, /event\.target === event\.currentTarget/);
  assert.match(registerModalSource, /onModeChange\("register"\)/);
  assert.match(registrySource, /return `\/\$\{entrypoint\}\?lang=\$\{locale\}`/);
});

test("HP-01K keeps one top-level menu or auth dialog with a focus-ready handoff", () => {
  assert.match(
    publicAuthModalProviderSource,
    /type PublicTopLevelOverlay =[\s\S]*?"locale"[\s\S]*?"goals"[\s\S]*?"knowledge"[\s\S]*?"mobile"[\s\S]*?AuthModalMode/
  );
  assert.match(
    publicAuthModalProviderSource,
    /setActiveOverlay\(nextMode\)/
  );
  assert.match(
    publicHeaderNavigationSource,
    /usePublicOverlay\(\)[\s\S]*?isOpenPanel\(activeOverlay\)[\s\S]*?activeOverlay === "mobile"/
  );
  assert.match(publicHeaderNavigationSource, /setActiveOverlay\("locale"\)/);
  assert.match(
    publicHeaderNavigationSource,
    /setActiveOverlay\(\(current\) => \(current === panel \? null : panel\)\)/
  );
  assert.doesNotMatch(publicHeaderNavigationSource, /useState<OpenPanel>|useState\(false\).*mobileOpen/);
  assert.match(
    registerModalSource,
    /\(initialControl \?\? dialog\)\?\.focus\(\);\s*if \(dialog\?\.contains\(document\.activeElement\)\) onFocusReady\?\.\(\);/
  );
  assert.match(publicAuthModalProviderSource, /aria-hidden=\{mode && focusReady \? true : undefined\}/);
  assert.match(publicAuthModalProviderSource, /if \(mode && focusReady\) \{\s*background\.setAttribute\("inert", ""\)/);
  assert.match(publicAuthModalProviderSource, /returnFocusTo=\{openerRef\.current\}/);
  assert.match(registerModalSource, /returnFocus\?\.isConnected && returnFocus\.getClientRects\(\)\.length > 0[\s\S]*?\? returnFocus[\s\S]*?: fallback/);
});

test("HP-01M aligns public auth dialogs with the menu shell and viewport", () => {
  assert.match(registerModalSource, /publicWebLayout\?: boolean/);
  assert.match(registerModalSource, /publicWebLayout = false/);
  assert.match(publicAuthModalProviderSource, /publicWebLayout/);
  assert.match(
    registerModalSource,
    /fixed inset-0 z-\[100\] flex items-center justify-center overflow-y-auto bg-black\/40 px-4 py-6/
  );
  assert.match(
    registerModalSource,
    /max-h-\[calc\(100dvh-2rem\)\] w-full max-w-md overflow-y-auto/
  );

  const overlayRules = publicWebCssSource.match(
    /^\.public-web-auth-modal-overlay \{([^}]*)\}/m
  )?.[1];
  assert.ok(overlayRules);
  assert.match(overlayRules, /align-items: flex-start;/);
  assert.match(overlayRules, /justify-content: flex-end;/);
  assert.match(overlayRules, /overflow-y: hidden;/);
  assert.match(
    overlayRules,
    /padding: 122px max\(14px, calc\(\(100% - 70\.125rem\) \/ 2\)\) 14px 14px;/
  );

  const dialogRules = publicWebCssSource.match(
    /^\.public-web-auth-modal-dialog \{([^}]*)\}/m
  )?.[1];
  assert.ok(dialogRules);
  assert.match(dialogRules, /max-height: max\(0px, calc\(100dvh - 136px\)\);/);
  assert.match(dialogRules, /border: 1px solid #d5deea;/);
  assert.match(dialogRules, /border-radius: 6px;/);
  assert.match(dialogRules, /background: #fff;/);
  assert.match(dialogRules, /box-shadow: 0 18px 42px rgb\(15 23 42 \/ 0\.2\);/);
  assert.match(
    publicWebCssSource,
    /@media \(max-width: 63\.999rem\) \{\s*\.public-web-auth-modal-dialog \{\s*width: 100%;\s*max-width: none;\s*overscroll-behavior: contain;\s*padding-inline: 14px;/
  );
});

test("HP-01 header copy is complete for all five public locales", () => {
  for (const field of [
    "navigationLabel",
    "login",
    "languageLabel",
    "headerCta",
    "openMenu",
    "closeMenu",
  ]) {
    assert.equal(
      registrySource.match(new RegExp(`${field}:`, "g"))?.length,
      APP_LANGUAGES.length + 1,
      field
    );
  }
});

test("HP-01 exposes keyboard state and mobile dropdown safeguards", () => {
  assert.match(publicHeaderNavigationSource, /aria-expanded/);
  assert.match(publicHeaderNavigationSource, /aria-controls/);
  assert.match(publicHeaderNavigationSource, /event\.key !== "Escape"/);
  assert.match(publicHeaderNavigationSource, /closeMobileMenu\(\)/);
  assert.doesNotMatch(publicHeaderNavigationSource, /aria-modal/);
  assert.doesNotMatch(publicHeaderNavigationSource, /element\.inert = true/);
  assert.doesNotMatch(publicHeaderNavigationSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(
    publicWebCssSource,
    /\.public-web-mobile-menu \{[\s\S]*?position: absolute;[\s\S]*?top: calc\(100% \+ var\(--public-web-panel-spacing\)\);[\s\S]*?right: var\(--public-web-panel-spacing\);[\s\S]*?left: var\(--public-web-panel-spacing\);/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-selector-mobile \{\s*display: block;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-panel \{[^}]*top: calc\(100% \+ var\(--public-web-panel-spacing\)\);[^}]*right: calc\(max\(0px, \(100% - 71\.875rem\) \/ 2\) \+ var\(--public-web-panel-spacing\)\);[^}]*left: auto;[^}]*width: 175px;/
  );
  assert.match(
    publicHeaderNavigationSource,
    /const panelId = `public-web-locale-panel-\$\{presentation\}`/
  );
  assert.match(
    publicHeaderNavigationSource,
    /type LocalePresentation = "desktop" \| "mobile"/
  );
  assert.match(publicHeaderNavigationSource, /localeReturnFocusRef/);
  assert.match(publicHeaderNavigationSource, /closeMobileMenu\(false\)/);
  assert.match(
    publicHeaderNavigationSource,
    /src=\{`\/images\/flags\/\$\{locale\}\.svg`\}[\s\S]*?alt=""[\s\S]*?aria-hidden="true"/
  );
  assert.match(
    publicHeaderNavigationSource,
    /src=\{`\/images\/flags\/\$\{candidate\}\.svg`\}[\s\S]*?alt=""[\s\S]*?aria-hidden="true"/
  );
  assert.doesNotMatch(publicHeaderNavigationSource, /src="\/globe\.svg"/);
  assert.doesNotMatch(publicHeaderNavigationSource, /locale\.toUpperCase\(\)/);
  assert.doesNotMatch(publicHeaderNavigationSource, /candidate\.toUpperCase\(\)/);
  assert.match(publicWebCssSource, /:focus-visible/);
});

test("HP-02G.1 keeps public focus and hover contrast above WCAG thresholds", () => {
  assert.match(
    publicWebCssSource,
    /\.public-web-header button:focus-visible,[\s\S]*?\.public-web-auth-modal-dialog :is\(a, button, input, select, textarea\):focus-visible \{[\s\S]*?outline: 3px solid #191970;[\s\S]*?outline-offset: 3px;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-desktop-nav button:focus-visible \{[\s\S]*?outline-color: #fff;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-auth-modal-dialog button\[type="submit"\]:hover \{[^}]*background: #1976d2;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-actions \.public-web-primary-cta:hover \{[^}]*background: #1976d2;/
  );
  assert.match(publicWebCssSource, /\.public-web-actions \.public-web-primary-cta \{[^}]*background: #191970;/);
  assert.match(loginFormSource, /bg-\[#191970\]/);
  assert.match(registerStepSource, /bg-\[#191970\]/);
});

test("HP-01 keeps mobile knowledge domains as a one-open-at-a-time accordion", () => {
  assert.match(publicHeaderNavigationSource, /useState<KnowledgeGroupKey \| null>/);
  assert.match(publicHeaderNavigationSource, /toggleKnowledgeGroup/);
  assert.match(publicHeaderNavigationSource, /current === group \? null : group/);
  assert.match(publicHeaderNavigationSource, /className="public-web-mobile-knowledge-trigger"/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{openKnowledgeGroup === key\}/);
  assert.match(publicHeaderNavigationSource, /aria-controls=\{panelId\}/);
});

test("canonical public header preserves one 200 by 40 logo contract", () => {
  assert.match(publicHeaderSource, /width=\{1500\}/);
  assert.match(publicHeaderSource, /height=\{300\}/);
  assert.match(publicWebCssSource, /\.public-web-brand img \{[\s\S]*?width: 12\.5rem;[\s\S]*?height: 2\.5rem;/);
  assert.match(publicWebCssSource, /\.public-web-brand img \{[^}]*?flex-shrink: 0;/);
  assert.doesNotMatch(publicWebCssSource, /\.public-web-brand \{[^}]*?transform:/);
  assert.doesNotMatch(publicWebCssSource, /\.public-web-brand img \{[^}]*?width: (?:100%|15rem|clamp\()/);
  assert.doesNotMatch(publicWebCssSource, /width: min\(9\.5rem/);
});

test("HP-01I keeps menu icons canonical while Hero v2 connects to the navigation bar", () => {
  assert.match(
    publicWebCssSource,
    /\.public-web-menu-icon \{[\s\S]*?width: 1rem;[\s\S]*?height: 1rem;[\s\S]*?background: #191970;/
  );
  assert.doesNotMatch(publicWebCssSource, /public-web-mobile-knowledge-trigger img/);
  assert.match(
    publicWebCssSource,
    /\.public-web-main \{\s*padding: 0;\s*\}/
  );
});

test("homepage section card follows the Hero frame without a fixed height", async () => {
  const sectionCardSource = await read("app/components/public/PublicSectionCard.tsx");
  assert.match(publicHomepageSource, /<\/section>\s*<PublicSectionCard \/>/);
  assert.match(sectionCardSource, /className="public-web-section-card"/);
  assert.match(sectionCardSource, /className="public-web-section-card-content">\{children\}/);
  const cardRule = publicWebCssSource.match(/\.public-web-section-card \{([^}]+)\}/)?.[1];
  assert.ok(cardRule);
  assert.match(cardRule, /width: 100%;/);
  assert.match(cardRule, /max-width: 71\.875rem;/);
  assert.match(cardRule, /margin: 14px auto 0;/);
  assert.doesNotMatch(cardRule, /border-radius:/);
  assert.match(cardRule, /background: #f5faff;/);
  assert.doesNotMatch(cardRule, /(?:^|\s)(?:min-)?height:|position: absolute;/);
  assert.match(publicWebCssSource, /\.public-web-section-card-content \{\s*padding: clamp\(16px, 2\.5vw, 32px\);/);
});

test("canonical header keeps locale in the light-blue top row at every width", () => {
  assert.match(
    publicWebCssSource,
    /\.public-web-header-actions > \.public-web-header-login \{\s*display: none;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header-inner \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;[\s\S]*?grid-template-rows: 64px 44px;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header-top \{[\s\S]*?#b8cae0 4rem,[\s\S]*?#191970 4rem,[\s\S]*?#191970 100%[\s\S]*?\);/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-trigger img \{[\s\S]*?width: 1\.4rem;[\s\S]*?height: 1\.4rem;[\s\S]*?transform: translateX\(0\.25rem\);/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header-inner \{\s*width: calc\(100% - 28px\);[\s\S]*?max-width: calc\(71\.875rem - 28px\);/
  );
  assert.doesNotMatch(publicWebCssSource, /\.public-web-header-actions \{[^}]*?margin-right:/);
  assert.equal(
    publicWebCssSource.match(/\.public-web-header-actions \{\s*gap: 0\.375rem;/g)
      ?.length,
    2
  );
  assert.equal(
    publicWebCssSource.match(/margin-inline: 0\.125rem;/g)?.length,
    2
  );
  assert.match(publicHeaderNavigationSource, /className="public-web-hamburger"/);
  assert.match(
    publicHeaderNavigationSource,
    /className="public-web-header-actions">[\s\S]*?renderLocaleSelector\("desktop"\)[\s\S]*?renderLocaleSelector\("mobile"\)[\s\S]*?className="public-web-mobile-menu-trigger"/
  );
  assert.equal(
    publicHeaderNavigationSource.match(/renderLocaleSelector\("mobile"\)/g)?.length,
    1
  );
  assert.doesNotMatch(publicHeaderNavigationSource, /className="public-web-mobile-menu-heading"/);
  assert.match(
    publicWebCssSource,
    /\.public-web-mobile-menu-trigger\[aria-expanded="true"\]/
  );
});

test("canonical header uses its own 40rem breakpoint and aligned locale panels", () => {
  assert.match(
    publicHeaderNavigationSource,
    /matchMedia\("\(min-width: 40rem\)"\)[\s\S]*?setActiveOverlay\(\(current\) =>\s*current === "mobile" \|\| isOpenPanel\(current\) \? null : current/
  );
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 40rem\) and \(max-width: 63\.999rem\) \{[\s\S]*?\.public-web-desktop-nav \{/
  );
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 48rem\) and \(max-width: 63\.999rem\) \{[\s\S]*?\.public-web-hero \{/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-panel \{[^}]*top: calc\(100% \+ var\(--public-web-panel-spacing\)\);[^}]*width: 175px;[^}]*background: #fff;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-panel a:not\(\[aria-current="page"\]\):hover::after \{\s*background: #1976d2;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-locale-panel a:focus-visible \{\s*outline-offset: -3px;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header-login \{\s*padding-left: 0\.425rem;/
  );
  assert.equal(
    publicWebCssSource.match(/top: calc\(100% \+ var\(--public-web-panel-spacing\)\);/g)?.length,
    2
  );
});

test("login UI additions remain complete in all five interface languages", () => {
  assert.equal(uiTextSource.match(/loginTitle:/g)?.length, APP_LANGUAGES.length);
  assert.equal(uiTextSource.match(/loggingIn:/g)?.length, APP_LANGUAGES.length);
});

test("sitemap is registry-driven and robots excludes private application routes", () => {
  assert.match(sitemapSource, /PUBLIC_PAGE_REGISTRY/);
  assert.match(sitemapSource, /if \(!page\.indexable\) return \[\]/);
  assert.match(sitemapSource, /getPublicPagePath/);

  for (const privatePath of [
    "/api/",
    "/dashboard",
    "/dashboard/",
    "/handbook",
    "/handbook/",
    "/onboarding",
    "/onboarding/",
    "/settings",
    "/settings/",
  ]) {
    assert.ok(robotsSource.includes(`"${privatePath}"`), privatePath);
  }
});

test("proxy exits for ordinary public routes before creating a Supabase client", () => {
  assert.ok(
    proxySource.indexOf("!requiresProxyAuth(pathname)") <
      proxySource.indexOf("createServerClient(")
  );
});
