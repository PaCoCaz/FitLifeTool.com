// app/lib/formatNumber.ts

import { Lang } from "./useLang";

export function formatNumber(value: number, lang: Lang) {
  const localeMap: Record<Lang, string> = {
    en: "en-US",
    nl: "nl-NL",
  };

  const locale = localeMap[lang] ?? "en-US";

  return new Intl.NumberFormat(locale).format(value);
}
