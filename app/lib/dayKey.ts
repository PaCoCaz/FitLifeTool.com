// app/lib/dayKey.ts

/**
 * Bepaalt de lokale dag-key (YYYY-MM-DD)
 * op basis van de lokale tijd van de gebruiker.
 *
 * ⚠️ NOOIT toISOString gebruiken voor dagkeys
 */

 export type DayKey = string & { readonly __brand: "DayKey" };

 export function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
