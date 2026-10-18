"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import type { AdminRegistrationState, RegistrationAction } from "@/lib/auth/publicRegistration";
import { uiText } from "@/lib/uiText";
import { useLang } from "@/lib/useLang";

const DURATIONS = Array.from({ length: 60 }, (_, index) => index + 1);

function readState(value: unknown): AdminRegistrationState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const state = (value as { state?: unknown }).state;
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;
  const row = state as Record<string, unknown>;
  if (typeof row.open !== "boolean" || typeof row.serverNow !== "string") return null;
  if (row.openUntil !== null && typeof row.openUntil !== "string") return null;
  if (typeof row.version !== "number") return null;
  return state as AdminRegistrationState;
}

export default function RegistrationControlPanel() {
  const language = useLang();
  const t = uiText[language].registrationControl;
  const [state, setState] = useState<AdminRegistrationState | null>(null);
  const [duration, setDuration] = useState(10);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/registration-control", {
        credentials: "include",
        cache: "no-store",
      });
      const next = readState(await response.json());
      if (!response.ok || !next) throw new Error("unavailable");
      setState(next);
      setNow(Date.parse(next.serverNow));
      setError(false);
    } catch {
      setState(null);
      setError(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow((current) => current + 1000), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remainingMinutes = useMemo(() => {
    if (!state?.open || !state.openUntil) return null;
    return Math.max(0, Math.ceil((Date.parse(state.openUntil) - now) / 60000));
  }, [now, state]);

  async function update(action: RegistrationAction) {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    setError(false);
    try {
      const response = await fetch("/api/admin/registration-control", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      const next = readState(await response.json());
      if (!response.ok || !next) throw new Error("unavailable");
      setState(next);
      setNow(Date.parse(next.serverNow));
      setMessage(t.saved);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const effectiveOpen = Boolean(state?.open && (state.openUntil === null || (remainingMinutes ?? 0) > 0));

  return (
    <div className="mx-auto max-w-2xl">
      <Card header={<CardHeader as="h1" title={t.title} />}>
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600">{t.description}</p>
          <p className="text-sm text-amber-800">{t.inviteRestriction}</p>
          <div aria-live="polite" className="rounded-[var(--radius)] bg-gray-50 p-4">
            <p className="text-sm font-semibold text-[#191970]">
              {t.currentStatus}: {state ? (effectiveOpen ? t.open : t.closed) : t.loading}
            </p>
            {effectiveOpen && state?.openUntil && (
              <p className="mt-1 text-sm text-gray-600">
                {t.closesAt}: {new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(state.openUntil))}
                {remainingMinutes !== null ? ` · ${t.remaining.replace("{{minutes}}", String(remainingMinutes))}` : ""}
              </p>
            )}
            {effectiveOpen && state?.openUntil === null && <p className="mt-1 text-sm text-gray-600">{t.noEndTime}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="registration-duration" className="block text-sm font-medium">{t.duration}</label>
            <select id="registration-duration" value={duration} disabled={busy} onChange={(event) => setDuration(Number(event.target.value))} className="w-full rounded border px-3 py-2">
              {DURATIONS.map((minutes) => <option key={minutes} value={minutes}>{t.minutes.replace("{{minutes}}", String(minutes))}</option>)}
            </select>
            <button type="button" disabled={busy} onClick={() => void update({ action: "open_temporary", durationMinutes: duration })} className="w-full rounded-[var(--radius)] bg-[#191970] px-4 py-2 text-white disabled:opacity-50">
              {t.openTemporary}
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" disabled={busy} onClick={() => void update({ action: "open_indefinite" })} className="rounded-[var(--radius)] border border-[#0095D3] px-4 py-2 text-[#0077A8] disabled:opacity-50">
              {t.openIndefinite}
            </button>
            <button type="button" disabled={busy} onClick={() => void update({ action: "close" })} className="rounded-[var(--radius)] border border-red-600 px-4 py-2 text-red-700 disabled:opacity-50">
              {t.closeNow}
            </button>
          </div>
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-700">{t.error}</p>}
        </div>
      </Card>
    </div>
  );
}
