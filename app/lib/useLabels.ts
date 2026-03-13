// app/lib/useLabels.ts

import { labels, Language, Labels } from "./labels";

export function useLabels(language: Language = "nl"): Labels {
  return labels[language];
}
