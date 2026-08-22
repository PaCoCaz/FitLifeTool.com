import type { Metadata } from "next";
import {
  APP_LANGUAGES,
  asAppLanguage,
  type AppLanguage,
} from "@/lib/languagePreference";

export const PUBLIC_SITE_ORIGIN = "https://fitlifetool.com";
export const PUBLIC_DEFAULT_LOCALE: AppLanguage = "en";
export const PUBLIC_LOCALES = APP_LANGUAGES;

type LocaleDefinition = {
  label: string;
  htmlLang: string;
  openGraphLocale: string;
};

export const PUBLIC_LOCALE_REGISTRY: Record<
  AppLanguage,
  LocaleDefinition
> = {
  en: { label: "English", htmlLang: "en", openGraphLocale: "en_GB" },
  nl: { label: "Nederlands", htmlLang: "nl", openGraphLocale: "nl_NL" },
  fr: { label: "Français", htmlLang: "fr", openGraphLocale: "fr_FR" },
  de: { label: "Deutsch", htmlLang: "de", openGraphLocale: "de_DE" },
  pl: { label: "Polski", htmlLang: "pl", openGraphLocale: "pl_PL" },
};

type PublicPageDefinition = {
  indexable: boolean;
  paths: Record<AppLanguage, string>;
};

export const PUBLIC_PAGE_REGISTRY: Record<"home", PublicPageDefinition> = {
  home: {
    indexable: false,
    paths: {
      en: "/",
      nl: "/nl",
      fr: "/fr",
      de: "/de",
      pl: "/pl",
    },
  },
};

export type PublicPageKey = keyof typeof PUBLIC_PAGE_REGISTRY;

type PublicHomeContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  login: string;
  forgotPassword: string;
  languageLabel: string;
  foundationNotice: string;
  metadataTitle: string;
  metadataDescription: string;
};

// Provisional foundation copy. Final SEO copy requires locale-specific research.
export const PUBLIC_HOME_CONTENT: Record<AppLanguage, PublicHomeContent> = {
  en: {
    eyebrow: "FITLIFETOOL",
    title: "Bring your daily health habits into one clear overview.",
    description:
      "FitLifeTool connects nutrition, activity, hydration and weight so you can understand your day and work towards sustainable progress.",
    primaryCta: "Create a free account",
    secondaryCta: "Log in",
    login: "Log in",
    forgotPassword: "Forgot password?",
    languageLabel: "Choose language",
    foundationNotice: "More locale-specific guidance is being prepared.",
    metadataTitle: "FitLifeTool | Daily health overview",
    metadataDescription:
      "Track nutrition, activity, hydration and weight in one daily health overview.",
  },
  nl: {
    eyebrow: "FITLIFETOOL",
    title: "Breng je dagelijkse gezondheidsgewoonten samen in één helder overzicht.",
    description:
      "FitLifeTool verbindt voeding, beweging, hydratatie en gewicht, zodat je je dag begrijpt en gericht werkt aan duurzame vooruitgang.",
    primaryCta: "Gratis account aanmaken",
    secondaryCta: "Inloggen",
    login: "Inloggen",
    forgotPassword: "Wachtwoord vergeten?",
    languageLabel: "Kies taal",
    foundationNotice: "Meer locale-specifieke uitleg wordt voorbereid.",
    metadataTitle: "FitLifeTool | Dagelijks gezondheidsoverzicht",
    metadataDescription:
      "Volg voeding, beweging, hydratatie en gewicht in één dagelijks gezondheidsoverzicht.",
  },
  fr: {
    eyebrow: "FITLIFETOOL",
    title: "Réunissez vos habitudes de santé quotidiennes dans une vue claire.",
    description:
      "FitLifeTool relie nutrition, activité, hydratation et poids pour mieux comprendre votre journée et progresser durablement.",
    primaryCta: "Créer un compte gratuit",
    secondaryCta: "Se connecter",
    login: "Se connecter",
    forgotPassword: "Mot de passe oublié ?",
    languageLabel: "Choisir la langue",
    foundationNotice: "Des conseils adaptés à chaque langue sont en préparation.",
    metadataTitle: "FitLifeTool | Vue quotidienne de votre santé",
    metadataDescription:
      "Suivez nutrition, activité, hydratation et poids dans une seule vue quotidienne.",
  },
  de: {
    eyebrow: "FITLIFETOOL",
    title: "Bringe deine täglichen Gesundheitsgewohnheiten in eine klare Übersicht.",
    description:
      "FitLifeTool verbindet Ernährung, Aktivität, Flüssigkeit und Gewicht, damit du deinen Tag verstehst und nachhaltig vorankommst.",
    primaryCta: "Kostenloses Konto erstellen",
    secondaryCta: "Anmelden",
    login: "Anmelden",
    forgotPassword: "Passwort vergessen?",
    languageLabel: "Sprache wählen",
    foundationNotice: "Weitere sprachspezifische Inhalte werden vorbereitet.",
    metadataTitle: "FitLifeTool | Täglicher Gesundheitsüberblick",
    metadataDescription:
      "Verfolge Ernährung, Aktivität, Flüssigkeit und Gewicht in einem täglichen Überblick.",
  },
  pl: {
    eyebrow: "FITLIFETOOL",
    title: "Połącz codzienne nawyki zdrowotne w jednym przejrzystym widoku.",
    description:
      "FitLifeTool łączy odżywianie, aktywność, nawodnienie i masę ciała, aby ułatwić zrozumienie dnia i trwałe postępy.",
    primaryCta: "Utwórz bezpłatne konto",
    secondaryCta: "Zaloguj się",
    login: "Zaloguj się",
    forgotPassword: "Nie pamiętasz hasła?",
    languageLabel: "Wybierz język",
    foundationNotice: "Trwają prace nad treściami dopasowanymi do języka.",
    metadataTitle: "FitLifeTool | Codzienny przegląd zdrowia",
    metadataDescription:
      "Śledź odżywianie, aktywność, nawodnienie i masę ciała w jednym widoku dnia.",
  },
};

export function asPublicLocale(value: unknown): AppLanguage | null {
  return asAppLanguage(value);
}

export function getPublicPagePath(
  pageKey: PublicPageKey,
  locale: AppLanguage
) {
  return PUBLIC_PAGE_REGISTRY[pageKey].paths[locale];
}

export function getPublicHomePath(locale: unknown) {
  const safeLocale = asPublicLocale(locale) ?? PUBLIC_DEFAULT_LOCALE;
  return getPublicPagePath("home", safeLocale);
}

export function findPublicLocaleForPathname(pathname: string) {
  for (const locale of PUBLIC_LOCALES) {
    if (getPublicPagePath("home", locale) === pathname) return locale;
  }

  return null;
}

export function getPublicLocaleForPathname(pathname: string) {
  return findPublicLocaleForPathname(pathname) ?? PUBLIC_DEFAULT_LOCALE;
}

export function getPublicAlternates(pageKey: PublicPageKey) {
  const languages = Object.fromEntries(
    PUBLIC_LOCALES.map((locale) => [
      locale,
      new URL(getPublicPagePath(pageKey, locale), PUBLIC_SITE_ORIGIN).href,
    ])
  );

  return {
    canonical: languages[PUBLIC_DEFAULT_LOCALE],
    languages: {
      ...languages,
      "x-default": languages[PUBLIC_DEFAULT_LOCALE],
    },
  };
}

export function getLocalizedPublicAlternates(
  pageKey: PublicPageKey,
  locale: AppLanguage
) {
  const alternates = getPublicAlternates(pageKey);
  return {
    canonical: new URL(
      getPublicPagePath(pageKey, locale),
      PUBLIC_SITE_ORIGIN
    ).href,
    languages: alternates.languages,
  };
}

export function getPublicAuthHref(
  entrypoint: "login" | "register" | "forgot-password",
  locale: AppLanguage
) {
  return `/${entrypoint}?lang=${locale}`;
}

export function getPublicHomeMetadata(locale: AppLanguage): Metadata {
  const content = PUBLIC_HOME_CONTENT[locale];
  const alternates = getLocalizedPublicAlternates("home", locale);

  return {
    title: content.metadataTitle,
    description: content.metadataDescription,
    alternates,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName: "FitLifeTool",
      locale: PUBLIC_LOCALE_REGISTRY[locale].openGraphLocale,
      title: content.metadataTitle,
      description: content.metadataDescription,
    },
  };
}
