"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import Card from "../../components/ui/Card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/* ───────────────── Types ───────────────── */

type WeightLog = {
  log_date: string;
  weight_kg: number;
};

type PeriodOption = {
  label: string;
  days: 7 | 30 | 90 | 180 | 365;
};

/* ───────────────── Constants ───────────────── */

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "week", days: 7 },
  { label: "maand", days: 30 },
  { label: "kwartaal", days: 90 },
  { label: "half jaar", days: 180 },
  { label: "jaar", days: 365 },
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
            .select("target_weight_kg")
            .eq("id", user.id)
            .single(),
        ]);

      const withMA = calculateMovingAverage(logs ?? []);

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

  if (data.length === 0) {
    return (
      <Card title="Gewicht">
        <div className="text-sm text-gray-500">
          Nog geen gewichtshistorie beschikbaar.
        </div>
      </Card>
    );
  }

  const trend = getWeightTrend(data);
  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.days === periodDays)
      ?.label ?? "";

  const fromDate = formatDateNL(data[0].log_date);
  const toDate = formatDateNL(data[data.length - 1].log_date);

  const targetDate =
    targetWeight !== null && trend?.type !== "stable"
      ? getTargetDate(data, targetWeight)
      : null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => window.location.assign("/dashboard")}
        className="
          text-xs
          font-medium
          text-[#0095D3]
          hover:underline
          cursor-pointer
        "
      >
        ← Terug naar dashboard
      </button>

      <Card
        title={`Gewicht | Periode: ${currentPeriodLabel} (${fromDate} t/m ${toDate})`}
        icon={
          <Image
            src="/weight.svg"
            alt=""
            width={16}
            height={16}
          />
        }
      >
        {/* Trend + periode-selector */}
        <div className="mt-2 flex items-center justify-between">
          <div className="space-y-1 text-xs text-gray-600">
            {trend && (
              <>
                {trend.type === "down" && (
                  <div>
                    ↓ Gewicht afgenomen ({trend.diff.toFixed(1)} kg)
                  </div>
                )}
                {trend.type === "up" && (
                  <div>
                    ↑ Gewicht toegenomen (+{trend.diff.toFixed(1)} kg)
                  </div>
                )}
                {trend.type === "stable" && (
                  <div>→ Gewicht stabiel</div>
                )}
              </>
            )}

            {targetWeight !== null && (
              <div>
                Streefgewicht: {targetWeight.toFixed(1)} kg
              </div>
            )}

            {targetDate && (
              <div className="text-gray-500">
                Bij dit tempo bereik je je streefgewicht rond{" "}
                {formatDateNL(
                  targetDate.toISOString().slice(0, 10)
                )}
              </div>
            )}
          </div>

          <select
            value={periodDays}
            onChange={(e) =>
              setPeriodDays(
                Number(e.target.value) as
                  | 7
                  | 30
                  | 90
                  | 180
                  | 365
              )
            }
            className="
              rounded-[var(--radius)]
              bg-[#191970]
              px-2
              py-1
              text-xs
              font-medium
              text-white
              cursor-pointer
              focus:outline-none
            "
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.days} value={p.days}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grafiek */}
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="log_date" tick={{ fontSize: 11 }} />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value !== "number") {
                    return ["", "Gewicht"];
                  }
                  return [`${value.toFixed(1)} kg`, "Gewicht"];
                }}
                labelFormatter={(label) =>
                  `Datum: ${label}`
                }
              />

              <Line
                type="monotone"
                dataKey="weight_kg"
                stroke="#0095D3"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="moving_avg"
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              {targetWeight !== null && (
                <ReferenceLine
                  y={targetWeight}
                  stroke="#16a34a"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  ifOverflow="extendDomain"
                  label={{
                    value: `Streefgewicht ${targetWeight.toFixed(1)} kg`,
                    position: "insideTopRight",
                    fill: "#16a34a",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
