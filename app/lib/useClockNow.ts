// app/lib/useClockNow.ts
"use client";

import { useEffect, useState } from "react";

export function useClockNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());

    const interval = setInterval(tick, 1000);
    tick(); // directe sync bij mount

    return () => clearInterval(interval);
  }, []);

  return now;
}
