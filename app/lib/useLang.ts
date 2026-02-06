// app/lib/useLang.ts

"use client";

import { useLangContext } from "./LangProvider";
import type { Lang } from "./LangProvider";

export type { Lang };

// Alleen taal uitlezen
export function useLang(): Lang {
  const { lang } = useLangContext();
  return lang;
}

// Hook om taal te wijzigen
export function useSetUserLanguage() {
  const { setUserLanguage } = useLangContext();
  return setUserLanguage;
}
