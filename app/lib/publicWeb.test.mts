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
  assert.match(publicHeaderSource, /getPublicAuthHref/);
  assert.match(publicHomepageSource, /getPublicAuthHref/);
  assert.match(publicHomepageSource, /"forgot-password"/);
  assert.match(publicHomepageSource, /"register"/);
  assert.match(publicHomepageSource, /"login"/);
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
  assert.match(publicHeaderSource, /PUBLIC_LOCALES\.map/);
  assert.match(publicHeaderSource, /aria-current/);
  assert.match(publicHeaderSource, /hrefLang/);
  assert.doesNotMatch(publicHomepageSource, /AppProviders|AuthProvider|useUser/);
  assert.doesNotMatch(publicHeaderSource, /AppProviders|AuthProvider|useUser/);
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
