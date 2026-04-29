// app/(app)/dashboard/weight/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useDashboard } from "@/lib/DashboardStore";
import { useRouter } from "next/navigation";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
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

const getPeriodOptions = (t: typeof uiText.en): PeriodOption[] => [
  {
    label: t.common.lastDays.replace("{{days}}", "7"),
    days: 7,
  },
  {
    label: t.common.lastDays.replace("{{days}}", "30"),
    days: 30,
  },
  {
    label: t.common.lastDays.replace("{{days}}", "90"),
    days: 90,
  },
  {
    label: t.common.lastDays.replace("{{days}}", "180"),
    days: 180,
  },
  {
    label: t.common.lastDays.replace("{{days}}", "365"),
    days: 365,
  },
];

/* ───────────────── Helpers ───────────────── */

function formatDate(date: Date, lang: string) {
  return date.toLocaleDateString(lang, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateBMI(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}

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

/* ───────────────── Save weight ───────────────── */

async function saveWeight(
  user: any,
  draftWeight: string,
  draftTarget: string,
  heightCm: number | null,
  setSaving: (v: boolean) => void,
  refreshDashboard: () => Promise<void>,
  router: any
) {
  if (!user) return;

  const w = parseFloat(draftWeight);

  const targetWeight =
    draftTarget.trim() === ""
      ? null
      : parseFloat(draftTarget);

  if (!w || w <= 0) return;

  const bmi =
    heightCm != null
      ? calculateBMI(w, heightCm)
      : null;

  const waterGoal = Math.round(w * 35);

  setSaving(true);

  await supabase
    .from("profiles")
    .update({
      weight_kg: w,
      target_weight_kg: targetWeight,
      bmi,
      water_goal_ml: waterGoal,
    })
    .eq("id", user.id);

  await supabase.rpc("recalculate_user_targets", {
    p_user_id: user.id,
  });

  const now = new Date();

  await supabase.from("weight_logs").upsert(
    {
      user_id: user.id,
      weight_kg: w,
      bmi,
      log_date: now.toISOString().slice(0, 10),
      log_time_local: now.toTimeString().slice(0, 8),
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    { onConflict: "user_id,log_date" }
  );

  setSaving(false);

  await refreshDashboard();

  router.push("/dashboard");
}

/* ───────────────── Page ───────────────── */

export default function WeightPage() {
  const langCode = useLang();
  const t = uiText[langCode];

  const PERIOD_OPTIONS = getPeriodOptions(t);

  const { user } = useUser();
  const router = useRouter();

  const { refreshDashboard } = useDashboard();
  const [draftWeight, setDraftWeight] = useState("");
  const [draftTarget, setDraftTarget] = useState("");
  const [saving, setSaving] = useState(false);

  const [dirty, setDirty] = useState(false);

  const originalWeightRef = useRef<string>("");
  const originalTargetRef = useRef<string>("");

  const invalid =
    !draftWeight ||
    isNaN(parseFloat(draftWeight)) ||
    parseFloat(draftWeight) <= 0;

  const handleSave = async () => {
    await saveWeight(
      user,
      draftWeight,
      draftTarget,
      heightCm,
      setSaving,
      refreshDashboard,
      router
    );

    originalWeightRef.current = draftWeight;
    originalTargetRef.current = draftTarget;
    setDirty(false);
  };

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
    const isDirty =
      draftWeight !== originalWeightRef.current ||
      draftTarget !== originalTargetRef.current;

    setDirty(isDirty);
  }, [draftWeight, draftTarget]);

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
            .select("weight_kg, target_weight_kg, height_cm")
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

      const w =
        profile?.weight_kg != null
          ? String(profile.weight_kg)
          : "";

      const target =
        profile?.target_weight_kg != null
          ? String(profile.target_weight_kg)
          : "";

      setDraftWeight(w);
      setDraftTarget(target);

      originalWeightRef.current = w;
      originalTargetRef.current = target;

      setLoading(false);
    };

    load();
  }, [user, periodDays]);

  if (loading) {
    return (
      <Card title={t.weight.title}>
        <div className="text-sm text-gray-500">
          {t.weight.loadingHistory}
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
    <div className="space-y-6">

      <Card header={<CardHeader icon="/weight.svg" title={t.weight.editWeight} />}>
        <div className="space-y-4">

          <div className="flex items-end gap-3">

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t.weight.title}
              </div>
              <input
                type="number"
                step="0.1"
                value={draftWeight}
                onChange={(e) => setDraftWeight(e.target.value)}
                className="border rounded-[var(--radius)] px-3 py-1.5 w-20"
              />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t.weight.targetWeight}
              </div>
              <input
                type="number"
                step="0.1"
                value={draftTarget}
                onChange={(e) => setDraftTarget(e.target.value)}
                className="border rounded-[var(--radius)] px-3 py-1.5 w-20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={!dirty || invalid || saving}
                className={`
                  rounded-[var(--radius)]
                  border
                  px-4
                  py-2
                  text-sm

                  ${
                    saving
                      ? "border-gray-300 text-gray-400"
                      : !dirty || invalid
                      ? "border-green-500 text-green-600"
                      : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
                  }
                `}
              >
                {saving
                  ? t.common.saving
                  : !dirty || invalid
                  ? t.common.saved
                  : t.common.save}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= GEWICHT CARD — ONGWIJZIGD ================= */}

      <Card
        header={
          <CardHeader
            icon="/weight.svg"
            title={t.weight.title}
          />
        }
      >
        <div className="mt-2 flex items-center justify-between">
  
          {/* LINKS: Periode */}
          <div className="text-base font-medium text-[#191970]">
            {t.common.period} {currentPeriod.label}
          </div>

          {/* RECHTS: buttons */}
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
              {showBMI ? t.weight.hideBMI : t.weight.showBMI}
            </button>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="
                  flex items-center gap-2
                  rounded-[var(--radius)]
                  bg-[#191970]
                  border border-[#191970]
                  px-3 py-1.5
                  text-xs font-medium
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
        </div>

        <div className="mt-2 space-y-1 text-xs text-gray-600">
          {trend?.type === "down" && (
            <div>
              ↓ {t.weight.lost} ({trend.diff.toFixed(1)} kg)
            </div>
          )}
          {trend?.type === "up" && (
            <div>
              ↑ {t.weight.gained} (+{trend.diff.toFixed(1)} kg)
            </div>
          )}
          {trend?.type === "stable" && <div>→ {t.weight.stable}</div>}

          {targetDate && (
            <div className="text-gray-500">
              {t.weight.estimatedTargetDate}{" "}
              {formatDate(targetDate, langCode)}
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
                <XAxis
                  dataKey="log_date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    formatDate(new Date(value), langCode)
                  }
                />
                <YAxis
                  width={32}
                  domain={[
                    (dataMin: number) => Math.floor(dataMin - 1),
                    (dataMax: number) => Math.ceil(dataMax + 1),
                  ]}
                  tick={{ fontSize: 11 }}
                  padding={{ top: 10, bottom: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(label) =>
                    formatDate(new Date(label), langCode)
                  }
                  formatter={(value, name) => {
                    const num = Number(value);

                    if (name === "weight_kg") {
                      return [`${num.toFixed(1)} kg`, t.weight.title];
                    }

                    if (name === "moving_avg") {
                      return [`${num.toFixed(1)} kg`, t.weight.average];
                    }

                    return [String(value), String(name)];
                  }}
                />
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
                      value: `${t.weight.targetWeight} ${targetWeight.toFixed(
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
        <Card
          header={<CardHeader title={t.weight.bmi} />}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height={256}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="log_date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    formatDate(new Date(value), langCode)
                  }
                />
                <YAxis width={32} domain={[18, 35]} tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={(label) =>
                    formatDate(new Date(label), langCode)
                  }
                  formatter={(value) => [
                    Number(value).toFixed(1),
                    t.weight.bmi,
                  ]}
                />
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
