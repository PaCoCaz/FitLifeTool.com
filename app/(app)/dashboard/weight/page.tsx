"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import Card from "@/components/ui/Card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea, // ← ENIGE TOEVOEGING (import)
} from "recharts";

/* ───────────────── Types ───────────────── */

type WeightLog = {
  log_date: string;
  weight_kg: number;
  bmi?: number;
};

type PeriodOption = {
  label: string;
  days: 7 | 30 | 90 | 180 | 365;
};

/* ───────────────── Constants ───────────────── */

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Laatste 7 dagen", days: 7 },
  { label: "Laatste 30 dagen", days: 30 },
  { label: "Laatste 90 dagen", days: 90 },
  { label: "Laatste 180 dagen", days: 180 },
  { label: "Laatste 365 dagen", days: 365 },
];

/* ───────────────── Helpers ───────────────── */

function formatDateNL(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateBMI(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}

/* ───────────────── Trend helper ───────────────── */

function getWeightTrend(data: WeightLog[]) {
  if (data.length < 2) return null;

  const first = data[0].weight_kg;
  const last = data[data.length - 1].weight_kg;
  const diff = last - first;

  if (Math.abs(diff) < 0.2) {
    return { type: "stable", diff };
  }

  return diff < 0
    ? { type: "down", diff }
    : { type: "up", diff };
}

/* ───────────────── Moving average helper ───────────────── */

function calculateMovingAverage(
  data: WeightLog[],
  windowSize = 7
) {
  return data.map((point, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const slice = data.slice(start, index + 1);
    const avg =
      slice.reduce((sum, d) => sum + d.weight_kg, 0) /
      slice.length;

    return {
      ...point,
      moving_avg: Number(avg.toFixed(2)),
    };
  });
}

/* ───────────────── Extrapolatie helper ───────────────── */

function getTargetDate(
  data: WeightLog[],
  targetWeight: number
) {
  if (data.length < 2) return null;

  const first = data[0];
  const last = data[data.length - 1];

  const days =
    (new Date(last.log_date).getTime() -
      new Date(first.log_date).getTime()) /
    (1000 * 60 * 60 * 24);

  if (days <= 0) return null;

  const deltaPerDay =
    (last.weight_kg - first.weight_kg) / days;

  if (deltaPerDay === 0) return null;

  const remaining = targetWeight - last.weight_kg;
  const daysNeeded = remaining / deltaPerDay;

  if (daysNeeded <= 0) return null;

  const targetDate = new Date(last.log_date);
  targetDate.setDate(
    targetDate.getDate() + Math.round(daysNeeded)
  );

  return targetDate;
}

/* ───────────────── Page ───────────────── */

export default function WeightPage() {
  const { user } = useUser();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodDays, setPeriodDays] =
    useState<7 | 30 | 90 | 180 | 365>(30);

  const [targetWeight, setTargetWeight] =
    useState<number | null>(null);

  const [showBMI, setShowBMI] = useState(false);
  const [heightCm, setHeightCm] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () =>
      document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const since = new Date();
      since.setDate(since.getDate() - periodDays);
      const sinceKey = since.toISOString().slice(0, 10);

      const [{ data: logs }, { data: profile }] =
        await Promise.all([
          supabase
            .from("weight_logs")
            .select("log_date, weight_kg")
            .eq("user_id", user.id)
            .gte("log_date", sinceKey)
            .order("log_date", { ascending: true }),

          supabase
            .from("profiles")
            .select("target_weight_kg, height_cm")
            .eq("id", user.id)
            .single(),
        ]);

      const withMA = calculateMovingAverage(logs ?? []).map(
        (d) => ({
          ...d,
          bmi:
            profile?.height_cm != null
              ? calculateBMI(d.weight_kg, profile.height_cm)
              : undefined,
        })
      );

      setHeightCm(profile?.height_cm ?? null);
      setData(withMA);
      setTargetWeight(profile?.target_weight_kg ?? null);
      setLoading(false);
    };

    load();
  }, [user, periodDays]);

  if (loading) {
    return (
      <Card title="Gewicht">
        <div className="text-sm text-gray-500">
          Gewichtsgeschiedenis laden…
        </div>
      </Card>
    );
  }

  const trend = getWeightTrend(data);
  const currentPeriod =
    PERIOD_OPTIONS.find((p) => p.days === periodDays)!;

  const targetDate =
    targetWeight !== null && trend?.type !== "stable"
      ? getTargetDate(data, targetWeight)
      : null;

  return (
    <div className="space-y-6 -mt-41 -mx-4">

      {/* ================= GEWICHT CARD — ONGWIJZIGD ================= */}

      <Card
        title="Gewicht"
        icon={<Image src="/weight.svg" alt="" width={16} height={16} />}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBMI((v) => !v)}
              className="
                flex items-center gap-2
                rounded-[var(--radius)]
                border border-[#191970] hover:border-[#0095D3]
                px-3 py-1.5
                text-xs font-medium
                text-[#191970]
                hover:bg-[#0095D3] hover:text-white
              "
            >
              {showBMI ? "Verberg BMI" : "Toon BMI"}
            </button>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="
                  flex items-center gap-2
                  rounded-[var(--radius)]
                  bg-[#191970]
                  border border-[#191970]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-white
                "
              >
                {currentPeriod.label}
                <span className="text-[10px]">▼</span>
              </button>

              {open && (
                <div
                  className="
                    absolute right-0 mt-2
                    w-48
                    rounded-[var(--radius)]
                    border border-[#191970]
                    bg-white
                    py-2
                    shadow-xl
                    z-50
                  "
                >
                  {PERIOD_OPTIONS.map((p) => (
                    <button
                      key={p.days}
                      onClick={() => {
                        setPeriodDays(p.days);
                        setOpen(false);
                      }}
                      className="
                        block w-full text-left
                        px-4 py-2
                        text-xs
                        hover:bg-gray-100
                      "
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className="mt-2 text-base font-medium text-[#191970]">
          Periode: {currentPeriod.label}
        </div>

        <div className="mt-2 space-y-1 text-xs text-gray-600">
          {trend?.type === "down" && (
            <div>
              ↓ Gewicht afgenomen ({trend.diff.toFixed(1)} kg)
            </div>
          )}
          {trend?.type === "up" && (
            <div>
              ↑ Gewicht toegenomen (+{trend.diff.toFixed(1)} kg)
            </div>
          )}
          {trend?.type === "stable" && <div>→ Gewicht stabiel</div>}

          {targetDate && (
            <div className="text-gray-500">
              Verwachte datum streefgewicht rond{" "}
              {formatDateNL(
                targetDate.toISOString().slice(0, 10)
              )}
            </div>
          )}
        </div>

        <div className="mt-4 h-64 w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="log_date" tick={{ fontSize: 11 }} />
                <YAxis
                  width={32}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tick={{ fontSize: 11 }}
                  padding={{ top: 10, bottom: 10 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight_kg"
                  stroke="#0095D3"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="moving_avg"
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                {targetWeight !== null && (
                  <ReferenceLine
                    y={targetWeight}
                    stroke="#16a34a"
                    strokeDasharray="6 4"
                    strokeWidth={1}
                    ifOverflow="extendDomain"
                    label={{
                      value: `Streefgewicht ${targetWeight.toFixed(
                        1
                      )} kg`,
                      position: "insideTopRight",
                      fill: "#16a34a",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* ================= BMI CARD — MET ZONES ================= */}

      {showBMI && heightCm && (
        <Card title="BMI">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height={256}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="log_date" tick={{ fontSize: 11 }} />
                <YAxis width={32} domain={[18, 35]} tick={{ fontSize: 11 }} />
                <Tooltip />

                {/* BMI zones — ENIGE FUNCTIONELE TOEVOEGING */}
                <ReferenceArea y1={18} y2={18.5} fill="#0095D3" fillOpacity={0.4} />
                <ReferenceArea y1={18.5} y2={25} fill="#dcfce7" fillOpacity={0.6} />
                <ReferenceArea y1={25} y2={30} fill="#fef9c3" fillOpacity={0.6} />
                <ReferenceArea y1={30} y2={35} fill="#fee2e2" fillOpacity={0.6} />

                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#9333ea"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
