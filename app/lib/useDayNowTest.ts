// app/lib/useDayNowTest.ts
"use client";

import { useState } from "react";
import { getLocalDayKey } from "./dayKey";

/**
 * TEST hook — simuleert dagwissel handmatig
 *
 * ❗️ALLEEN voor development
 * ❗️NIET gebruiken in productie
 */
export function useDayNowTest() {
  const [now, setNow] = useState<Date>(new Date());

  function setFakeTime(hours: number, minutes = 0) {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    setNow(d);
  }

  return {
    now,
    dayKey: getLocalDayKey(now),
    setFakeTime,
  };
}
