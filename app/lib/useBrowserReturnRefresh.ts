"use client";

import { useEffect, useRef } from "react";

type Options = {
  enabled?: boolean;
  minIntervalMs?: number;
};

const DEFAULT_MIN_INTERVAL_MS = 1500;

function hasStripeReturnMarker() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(
    window.location.search
  );

  return (
    params.has("success") ||
    params.has("canceled") ||
    params.has("stripe_return")
  );
}

export function useBrowserReturnRefresh(
  refresh: () => Promise<void> | void,
  options: Options = {}
) {
  const {
    enabled = true,
    minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
  } = options;

  const refreshRef = useRef(refresh);
  const runningRef = useRef(false);
  const lastRefreshAtRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    mountedRef.current = true;

    const run = async () => {
      const now = Date.now();

      if (
        runningRef.current ||
        now - lastRefreshAtRef.current < minIntervalMs
      ) {
        return;
      }

      runningRef.current = true;
      lastRefreshAtRef.current = now;

      try {
        await refreshRef.current();
      } finally {
        if (mountedRef.current) {
          runningRef.current = false;
        }
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted || hasStripeReturnMarker()) {
        void run();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void run();
      }
    };

    const onFocus = () => {
      void run();
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );
    window.addEventListener("focus", onFocus);

    if (hasStripeReturnMarker()) {
      void run();
    }

    return () => {
      mountedRef.current = false;
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, minIntervalMs]);
}
