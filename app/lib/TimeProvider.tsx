// app/lib/TimeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const TimeContext = createContext<Date>(new Date());

export function TimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateNow = () => {
      setNow(new Date());
    };

    // Init direct
    updateNow();

    // ✅ Optie A: snellere tick voor live schema’s
    intervalRef.current = setInterval(() => {
      updateNow();
    }, 10_000); // elke 10 seconden

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
