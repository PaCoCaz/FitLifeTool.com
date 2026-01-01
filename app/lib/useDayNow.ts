// app/lib/useDayNow.ts
"use client";

import { useEffect, useState } from "react";

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function useDayNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNow(prev =>
        dayKey(prev) === dayKey(current) ? prev : current
      );
    }, 30_000); // check elke 30s is ruim voldoende

    return () => clearInterval(interval);
  }, []);

  return now;
}
