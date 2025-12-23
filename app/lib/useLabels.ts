import { labels, Language } from "./labels";

export function useLabels(language: Language = "nl") {
  return labels[language];
}
