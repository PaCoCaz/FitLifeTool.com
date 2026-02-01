// app/lib/dashboardEvents.ts

/**
 * Centrale mapping van alle dashboard events
 * Zorgt voor volledige type-safety tussen zenders en ontvangers
 */

export type DashboardEventMap = {
  "hydration-updated": {
    score: number;
    color: string;
  };

  "activity-updated": {
    score: number;
    color: string;
  };

  "nutrition-updated": {
    score: number;
    color: string;
  };

  "weight-updated": {
    weightKg: number;
  };
};
