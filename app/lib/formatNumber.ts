// app/lib/formatNumber.ts

import { Lang } from "./useLang";

export function formatNumber(value: number, lang: Lang) {
  const localeMap: Record<Lang, string> = {
    en: "en-US",
    nl: "nl-NL",
    de: "de-DE",
    fr: "fr-FR",
    pl: "pl-PL",
  };

  return new Intl.NumberFormat(localeMap[lang]).format(value);
}
