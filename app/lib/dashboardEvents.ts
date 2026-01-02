// app/lib/dashboardEvents.ts

export type DashboardEventMap = {
    "hydration-updated": void;
  
    "activity-updated": void;
  
    "nutrition-updated": {
      score: number;
      color: string;
    };
  };
  