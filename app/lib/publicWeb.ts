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
  forgotPassword: string;
  foundationNotice: string;
  metadataTitle: string;
  metadataDescription: string;
};

type PublicHeaderMenuItem = {
  label: string;
  description: string;
};

type PublicHeaderKnowledgeGroup = {
  label: string;
  items: readonly PublicHeaderMenuItem[];
};

type PublicHeaderContent = {
  navigationLabel: string;
  login: string;
  languageLabel: string;
  headerCta: string;
  openMenu: string;
  closeMenu: string;
  goals: {
    label: string;
    items: readonly PublicHeaderMenuItem[];
  };
  knowledge: {
    label: string;
    groups: {
      weight: PublicHeaderKnowledgeGroup;
      nutrition: PublicHeaderKnowledgeGroup;
      activity: PublicHeaderKnowledgeGroup;
      hydration: PublicHeaderKnowledgeGroup;
    };
  };
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
    forgotPassword: "Forgot password?",
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
    forgotPassword: "Wachtwoord vergeten?",
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
    forgotPassword: "Mot de passe oublié ?",
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
    forgotPassword: "Passwort vergessen?",
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
    forgotPassword: "Nie pamiętasz hasła?",
    foundationNotice: "Trwają prace nad treściami dopasowanymi do języka.",
    metadataTitle: "FitLifeTool | Codzienny przegląd zdrowia",
    metadataDescription:
      "Śledź odżywianie, aktywność, nawodnienie i masę ciała w jednym widoku dnia.",
  },
};

export const PUBLIC_HEADER_CONTENT: Record<AppLanguage, PublicHeaderContent> = {
  en: {
    navigationLabel: "Main navigation",
    login: "Log in",
    languageLabel: "Choose language",
    headerCta: "Start free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    goals: {
      label: "Goals",
      items: [
        { label: "Lose weight", description: "Lose weight in a healthy way" },
        { label: "Maintain weight", description: "Stay balanced and feel good" },
        { label: "Gain weight", description: "Gain weight healthily and get stronger" },
      ],
    },
    knowledge: {
      label: "Knowledge & tools",
      groups: {
        weight: {
          label: "Weight & body",
          items: [
            { label: "Calculate BMI", description: "Calculate your BMI and BMI category" },
            { label: "Energy needs", description: "Discover your daily needs" },
          ],
        },
        nutrition: {
          label: "Nutrition",
          items: [
            { label: "Nutrition", description: "Everything about healthy eating" },
            { label: "Protein", description: "Why protein matters" },
            { label: "Foods", description: "Information about foods" },
          ],
        },
        activity: {
          label: "Activity",
          items: [
            { label: "Activity guidelines", description: "How much activity do you need?" },
            { label: "Energy expenditure", description: "Calculate expenditure by activity" },
          ],
        },
        hydration: {
          label: "Hydration",
          items: [
            { label: "Hydration", description: "Are you drinking enough water?" },
          ],
        },
      },
    },
  },
  nl: {
    navigationLabel: "Hoofdnavigatie",
    login: "Inloggen",
    languageLabel: "Kies taal",
    headerCta: "Gratis starten",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    goals: {
      label: "Doelen",
      items: [
        { label: "Afvallen", description: "Verlies gewicht op een gezonde manier" },
        { label: "Gewicht onderhouden", description: "Blijf in balans en voel je goed" },
        { label: "Aankomen", description: "Kom gezond aan en word sterker" },
      ],
    },
    knowledge: {
      label: "Kennis & tools",
      groups: {
        weight: {
          label: "Gewicht & lichaam",
          items: [
            { label: "BMI berekenen", description: "Bereken je BMI en BMI-categorie" },
            { label: "Energiebehoefte", description: "Ontdek je dagelijkse behoefte" },
          ],
        },
        nutrition: {
          label: "Voeding",
          items: [
            { label: "Voeding", description: "Alles over gezonde voeding" },
            { label: "Eiwit", description: "Waarom eiwit belangrijk is" },
            { label: "Voedingsmiddelen", description: "Informatie over voedingsmiddelen" },
          ],
        },
        activity: {
          label: "Beweging",
          items: [
            { label: "Beweegrichtlijnen", description: "Hoeveel beweging heb je nodig?" },
            { label: "Energieverbruik", description: "Verbruik berekenen per activiteit" },
          ],
        },
        hydration: {
          label: "Hydratatie",
          items: [
            { label: "Hydratatie", description: "Drink je genoeg water?" },
          ],
        },
      },
    },
  },
  fr: {
    navigationLabel: "Navigation principale",
    login: "Se connecter",
    languageLabel: "Choisir la langue",
    headerCta: "Commencer gratuitement",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    goals: {
      label: "Objectifs",
      items: [
        { label: "Perdre du poids", description: "Perdez du poids sainement" },
        { label: "Maintenir son poids", description: "Gardez votre équilibre et votre bien-être" },
        { label: "Prendre du poids", description: "Prenez du poids sainement et gagnez en force" },
      ],
    },
    knowledge: {
      label: "Connaissances & outils",
      groups: {
        weight: {
          label: "Poids & corps",
          items: [
            { label: "Calculer l’IMC", description: "Calculez votre IMC et sa catégorie" },
            { label: "Besoins énergétiques", description: "Découvrez vos besoins quotidiens" },
          ],
        },
        nutrition: {
          label: "Nutrition",
          items: [
            { label: "Nutrition", description: "Tout savoir sur une alimentation saine" },
            { label: "Protéines", description: "Pourquoi les protéines sont importantes" },
            { label: "Aliments", description: "Informations sur les aliments" },
          ],
        },
        activity: {
          label: "Activité",
          items: [
            { label: "Recommandations d’activité", description: "De combien d’activité avez-vous besoin ?" },
            { label: "Dépense énergétique", description: "Calculez la dépense par activité" },
          ],
        },
        hydration: {
          label: "Hydratation",
          items: [
            { label: "Hydratation", description: "Buvez-vous assez d’eau ?" },
          ],
        },
      },
    },
  },
  de: {
    navigationLabel: "Hauptnavigation",
    login: "Anmelden",
    languageLabel: "Sprache wählen",
    headerCta: "Kostenlos starten",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    goals: {
      label: "Ziele",
      items: [
        { label: "Abnehmen", description: "Gesund Gewicht verlieren" },
        { label: "Gewicht halten", description: "Im Gleichgewicht bleiben und sich wohlfühlen" },
        { label: "Zunehmen", description: "Gesund zunehmen und stärker werden" },
      ],
    },
    knowledge: {
      label: "Wissen & Tools",
      groups: {
        weight: {
          label: "Gewicht & Körper",
          items: [
            { label: "BMI berechnen", description: "BMI und BMI-Kategorie berechnen" },
            { label: "Energiebedarf", description: "Täglichen Bedarf entdecken" },
          ],
        },
        nutrition: {
          label: "Ernährung",
          items: [
            { label: "Ernährung", description: "Alles über gesunde Ernährung" },
            { label: "Protein", description: "Warum Protein wichtig ist" },
            { label: "Lebensmittel", description: "Informationen über Lebensmittel" },
          ],
        },
        activity: {
          label: "Bewegung",
          items: [
            { label: "Bewegungsempfehlungen", description: "Wie viel Bewegung brauchst du?" },
            { label: "Energieverbrauch", description: "Verbrauch je Aktivität berechnen" },
          ],
        },
        hydration: {
          label: "Flüssigkeitszufuhr",
          items: [
            { label: "Flüssigkeitszufuhr", description: "Trinkst du genug Wasser?" },
          ],
        },
      },
    },
  },
  pl: {
    navigationLabel: "Nawigacja główna",
    login: "Zaloguj się",
    languageLabel: "Wybierz język",
    headerCta: "Zacznij bezpłatnie",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    goals: {
      label: "Cele",
      items: [
        { label: "Schudnąć", description: "Zdrowo zmniejsz masę ciała" },
        { label: "Utrzymać wagę", description: "Zachowaj równowagę i dobre samopoczucie" },
        { label: "Przytyć", description: "Zdrowo zwiększ masę ciała i siłę" },
      ],
    },
    knowledge: {
      label: "Wiedza i narzędzia",
      groups: {
        weight: {
          label: "Waga i ciało",
          items: [
            { label: "Oblicz BMI", description: "Oblicz BMI i jego kategorię" },
            { label: "Zapotrzebowanie energetyczne", description: "Poznaj swoje dzienne zapotrzebowanie" },
          ],
        },
        nutrition: {
          label: "Odżywianie",
          items: [
            { label: "Odżywianie", description: "Wszystko o zdrowym odżywianiu" },
            { label: "Białko", description: "Dlaczego białko jest ważne" },
            { label: "Produkty spożywcze", description: "Informacje o produktach spożywczych" },
          ],
        },
        activity: {
          label: "Aktywność",
          items: [
            { label: "Zalecenia dotyczące ruchu", description: "Ile ruchu potrzebujesz?" },
            { label: "Wydatek energetyczny", description: "Oblicz wydatek dla aktywności" },
          ],
        },
        hydration: {
          label: "Nawodnienie",
          items: [
            { label: "Nawodnienie", description: "Czy pijesz wystarczająco dużo wody?" },
          ],
        },
      },
    },
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
