// app/lib/useDayNow.ts

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Logische dag-tijd:
 * - verandert ALLEEN bij lokale dagwissel (00:00)
 * - exact, zonder polling
 * - bedoeld voor: DB queries, resets, schema's
 */
export function useDayNow(): Date {
  const [dayNow, setDayNow] = useState(() => new Date());

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const now = new Date();

    // Volgende lokale middernacht
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );

    const msUntilMidnight =
      nextMidnight.getTime() - now.getTime();

    timeoutRef.current = window.setTimeout(() => {
      const newDay = new Date();

      setDayNow(newDay); // 🔥 DAG WISSELT HIER

      // 🔔 Dashboard refresh event
      window.dispatchEvent(
        new CustomEvent("dashboard-refresh")
      );

      // Daarna elke 24 uur exact
      intervalRef.current = window.setInterval(() => {
        const newDay = new Date();

        setDayNow(newDay);

        // 🔔 Dashboard refresh event
        window.dispatchEvent(
          new CustomEvent("dashboard-refresh")
        );

      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return dayNow;
}