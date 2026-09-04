"use client";

import { useRef, useState } from "react";
import type { AppLanguage } from "@/lib/languagePreference";
import { getLocalizedPublicHome } from "@/lib/auth/sessionLifecycle";
import { notifyClientSessionEvent } from "@/lib/auth/clientSessionLifecycle";
import { uiText } from "@/lib/uiText";

export default function LogoutControl({ language, className = "" }: {
  language: AppLanguage;
  className?: string;
}) {
  const inFlight = useRef(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const t = uiText[language];

  async function logout() {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch("/auth/logout", {
        method: "POST", credentials: "include", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const body: unknown = await response.json();
      const destination = body && typeof body === "object" && "destination" in body
        ? (body as { destination?: unknown }).destination : null;
      if (response.ok && (body as { code?: unknown })?.code === "LOGOUT_COMPLETED" &&
          destination === getLocalizedPublicHome(language)) {
        notifyClientSessionEvent("logout");
        window.location.assign(destination);
        return;
      }
      setFailed(true);
    } catch { setFailed(true); }
    finally { inFlight.current = false; setLoading(false); }
  }

  return <div>
    <button type="button" onClick={() => void logout()} disabled={loading} className={className}>
      {t.common.logout}
    </button>
    {failed && <p role="alert" className="px-4 py-1 text-sm text-red-600">{t.auth.logoutFailure}</p>}
  </div>;
}
