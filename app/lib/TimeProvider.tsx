// app/lib/TimeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const TimeContext = createContext<Date>(new Date());

export function TimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateNow = () => {
      setNow(new Date());
    };

    updateNow();

    const msToNextMinute =
      60_000 - (Date.now() % 60_000);

    timeoutRef.current = setTimeout(() => {
      updateNow();

      intervalRef.current = setInterval(() => {
        updateNow();
      }, 60_000);
    }, msToNextMinute);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TimeContext.Provider value={now}>
      {children}
    </TimeContext.Provider>
  );
}

export function useNow(): Date {
  return useContext(TimeContext);
}
