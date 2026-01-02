// app/lib/dbDay.ts

import { DayKey } from "./dayKey";

/**
 * Type-veilige helper voor dag-filters in Supabase queries.
 *
 * ❗️Voorkomt dat per ongeluk een verkeerde string
 * (bijv. UTC-dag of handmatige YYYY-MM-DD) wordt gebruikt.
 */
export function eqDay<T>(
  query: T & { eq: (column: string, value: any) => T },
  column: string,
  dayKey: DayKey
): T {
  return query.eq(column, dayKey);
}
