"use client";

/**
 * Pure UI-tijd (visueel):
 * - altijd exact gelijk aan systeemtijd
 * - geen interval / geen drift
 * - volledig los van logica, schema en resets
 *
 * ⚠️ Alleen bedoeld voor WEERGAVE
 */
export function useDisplayTime(): Date {
  return new Date();
}
