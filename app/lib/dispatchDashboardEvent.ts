// app/lib/dispatchDashboardEvent.ts

import { DashboardEventMap } from "./dashboardEvents";

/**
 * Dispatch een typed dashboard event.
 *
 * - Volledig type-safe
 * - Ondersteunt events mét en zonder detail
 * - Centrale event-bus voor dashboard cards
 */
export function dispatchDashboardEvent<
  K extends keyof DashboardEventMap
>(
  type: K,
  detail: DashboardEventMap[K]
): void {
  if (detail === undefined) {
    window.dispatchEvent(new Event(type));
  } else {
    window.dispatchEvent(
      new CustomEvent<DashboardEventMap[K]>(type, {
        detail,
      })
    );
  }
}
