// app/lib/useDashboardEvent.ts
"use client";

import { useEffect } from "react";
import { DashboardEventMap } from "./dashboardEvents";

export function useDashboardEvent<
  K extends keyof DashboardEventMap
>(
  type: K,
  handler: (detail: DashboardEventMap[K]) => void
) {
  useEffect(() => {
    function listener(event: Event) {
      const custom = event as CustomEvent<DashboardEventMap[K]>;
      handler(custom.detail);
    }

    window.addEventListener(type, listener as EventListener);

    return () => {
      window.removeEventListener(type, listener as EventListener);
    };
  }, [type, handler]);
}
