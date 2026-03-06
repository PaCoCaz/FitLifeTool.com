// app/lib/dashboardEvents.ts

/**
 * Centrale mapping van alle dashboard events
 * Zorgt voor volledige type-safety tussen zenders en ontvangers
 */

 export type DashboardEventMap = {
  "dashboard-refresh": {};

  "hydration-updated": {
    score: number;
    color: string;
    ml: number;
  };

  "activity-updated": {
    score: number;
    color: string;
    calories: number;
  };

  "nutrition-updated": {
    score: number;
    color: string;
    kcal: number;
  };

  "weight-updated": {
    weightKg: number;
  };
};

/* ───────────────── Dispatcher ───────────────── */

export function dispatchDashboardEvent<K extends keyof DashboardEventMap>(
  eventName: K,
  detail: DashboardEventMap[K]
) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/* ───────────────── Dashboard Refresh ───────────────── */

export function dispatchDashboardRefresh() {
  dispatchDashboardEvent("dashboard-refresh", {});
}