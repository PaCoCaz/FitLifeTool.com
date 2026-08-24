import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { APP_LANGUAGES, asAppLanguage } from "./languagePreference.ts";

const projectRoot = new URL("../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, projectRoot), "utf8");

const [
  registrySource,
  englishRootLayoutSource,
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
  publicAuthModalProviderSource,
  registerModalSource,
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
  read("app/components/public/PublicAuthModalProvider.tsx"),
  read("app/components/auth/RegisterModal.tsx"),
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

test("only the four explicit prefixed locale homepages are routed", () => {
  for (const [locale, source] of [
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
  assert.match(publicHeaderNavigationSource, /mode="register"/);
  assert.match(publicHomepageSource, /getPublicAuthHref/);
  assert.match(publicHomepageSource, /"forgot-password"/);
  assert.match(publicHomepageSource, /mode="register"/);
  assert.match(publicHomepageSource, /mode="login"/);
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
    /href=["']#|\/uitleg|\/prijzen|\/pricing|\/voeding|\/hydratatie|\/beweging/
  );
  assert.match(publicHeaderNavigationSource, /className="public-web-menu-label"/);
  assert.match(publicHeaderNavigationSource, /PublicAuthTrigger/);
});

test("HP-01K reuses one accessible auth dialog without replacing direct routes", () => {
  assert.match(publicHomepageSource, /PublicAuthModalProvider locale=\{locale\}/);
  assert.match(publicAuthModalProviderSource, /useState<AuthModalMode \| null>/);
  assert.match(publicAuthModalProviderSource, /<LangProvider>/);
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

test("HP-01M aligns only public mobile auth dialogs with the canonical grid", () => {
  assert.match(registerModalSource, /publicWebLayout\?: boolean/);
  assert.match(registerModalSource, /publicWebLayout = false/);
  assert.match(publicAuthModalProviderSource, /publicWebLayout/);
  assert.match(
    publicWebCssSource,
    /@media \(max-width: 63\.999rem\) \{[\s\S]*?\.public-web-auth-modal-overlay \{[\s\S]*?align-items: flex-start;[\s\S]*?padding: 7\.5625rem 1rem 1rem;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-auth-modal-dialog \{[\s\S]*?width: 100%;[\s\S]*?max-width: none;[\s\S]*?max-height: calc\(100dvh - 8\.5625rem\);[\s\S]*?overscroll-behavior: contain;/
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
    /\.public-web-mobile-menu \{[\s\S]*?position: absolute;[\s\S]*?top: calc\(100% \+ 0\.75rem\);[\s\S]*?right: 1rem;[\s\S]*?left: 1rem;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-header::after \{[\s\S]*?height: 2\.75rem;[\s\S]*?background: #191970;/
  );
  assert.match(publicWebCssSource, /:focus-visible/);
});

test("HP-01 keeps mobile knowledge domains as a one-open-at-a-time accordion", () => {
  assert.match(publicHeaderNavigationSource, /useState<KnowledgeGroupKey \| null>/);
  assert.match(publicHeaderNavigationSource, /toggleKnowledgeGroup/);
  assert.match(publicHeaderNavigationSource, /current === group \? null : group/);
  assert.match(publicHeaderNavigationSource, /className="public-web-mobile-knowledge-trigger"/);
  assert.match(publicHeaderNavigationSource, /aria-expanded=\{openKnowledgeGroup === key\}/);
  assert.match(publicHeaderNavigationSource, /aria-controls=\{panelId\}/);
});

test("HP-01 preserves the measured 240 by 48 desktop logo contract", () => {
  assert.match(publicHeaderSource, /width=\{1500\}/);
  assert.match(publicHeaderSource, /height=\{300\}/);
  assert.match(publicWebCssSource, /\.public-web-brand img \{[\s\S]*?width: 15rem;[\s\S]*?height: 3rem;/);
  assert.doesNotMatch(publicWebCssSource, /width: min\(9\.5rem/);
});

test("HP-01I aligns menu icons and hero start with the canonical live baseline", () => {
  assert.match(
    publicWebCssSource,
    /\.public-web-menu-icon \{[\s\S]*?width: 1rem;[\s\S]*?height: 1rem;[\s\S]*?background: #191970;/
  );
  assert.doesNotMatch(publicWebCssSource, /public-web-mobile-knowledge-trigger img/);
  assert.match(
    publicWebCssSource,
    /\.public-web-main \{[\s\S]*?padding-block: 0\.75rem 3rem;/
  );
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 56rem\) \{[\s\S]*?\.public-web-main \{[\s\S]*?padding-block: 0\.75rem 4rem;/
  );
  assert.match(
    publicWebCssSource,
    /@media \(min-width: 64rem\) \{[\s\S]*?\.public-web-main \{[\s\S]*?padding-block: 0\.6875rem 4rem;/
  );
});

test("HP-01 keeps the closed mobile header limited to logo, locale, and menu", () => {
  assert.match(
    publicWebCssSource,
    /\.public-web-header-actions > \.public-web-header-login \{\s*display: none;/
  );
  assert.match(
    publicWebCssSource,
    /\.public-web-brand img \{[\s\S]*?width: min\(100%, 12\.5rem\);[\s\S]*?height: auto;[\s\S]*?aspect-ratio: 5 \/ 1;/
  );
  assert.match(publicHeaderNavigationSource, /className="public-web-hamburger"/);
  assert.doesNotMatch(publicHeaderNavigationSource, /className="public-web-mobile-menu-heading"/);
  assert.match(
    publicWebCssSource,
    /\.public-web-mobile-menu-trigger\[aria-expanded="true"\]/
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
