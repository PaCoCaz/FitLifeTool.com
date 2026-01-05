"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../ui/Card";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import { useToast } from "../../lib/ToastProvider";
import { useDayNow } from "../../lib/useDayNow";
import { getLocalDayKey } from "../../lib/dayKey";

/* ───────────────── Types ───────────────── */

type WeightProfileResult = {
  weight_kg: number;
  bmi: number;
};

/* ───────────────── Helpers ───────────────── */

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Ondergewicht";
  if (bmi < 25) return "Gezond";
  if (bmi < 30) return "Overgewicht";
  return "Obesitas";
}

function calculateBMI(weightKg: number, heightM = 1.75): number {
  return weightKg / (heightM * heightM);
}

/* ───────────────── BMI segmentdefinitie ───────────────── */

const BMI_SEGMENTS = [
  { min: 15, max: 18.5, width: 22 },
  { min: 18.5, max: 25, width: 28 },
  { min: 25, max: 30, width: 25 },
  { min: 30, max: 40, width: 25 },
];

function getBMIPercentage(bmi: number): number {
  let offset = 0;

  for (const segment of BMI_SEGMENTS) {
    if (bmi >= segment.min && bmi <= segment.max) {
      const progress =
        (bmi - segment.min) / (segment.max - segment.min);
      return offset + progress * segment.width;
    }
    offset += segment.width;
  }

  if (bmi < BMI_SEGMENTS[0].min) return 0;
  return 100;
}

/* ───────────────── BMI Balk ───────────────── */

function BMIBar({ bmi }: { bmi: number }) {
  const percentage = getBMIPercentage(bmi);

  return (
    <div className="mt-4">
      <div className="relative w-full">
        <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="absolute left-0 top-0 h-2 w-[22%] bg-[#0095D3]" />
          <div className="absolute left-[22%] top-0 h-2 w-[28%] bg-green-600" />
          <div className="absolute left-[50%] top-0 h-2 w-[25%] bg-orange-500" />
          <div className="absolute left-[75%] top-0 h-2 w-[25%] bg-[#C80000]" />

          <div className="absolute left-[22%] top-0 h-2 w-[2px] bg-white" />
          <div className="absolute left-[50%] top-0 h-2 w-[2px] bg-white" />
          <div className="absolute left-[75%] top-0 h-2 w-[2px] bg-white" />
        </div>

        <div
          className="absolute -top-3 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        >
          <div
            className="
              w-0 h-0
              border-l-4 border-r-4
              border-t-6
              border-transparent
              border-t-[#191970]
            "
          />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[22%_28%_25%_25%] text-center">
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Ondergewicht
          </div>
          <div className="text-[9px] text-gray-400">&lt; 18.5</div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Gezond
          </div>
          <div className="text-[9px] text-gray-400">
            18.5 – 24.9
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Overgewicht
          </div>
          <div className="text-[9px] text-gray-400">
            25 – 29.9
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-gray-600">
            Obesitas
          </div>
          <div className="text-[9px] text-gray-400">≥ 30</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── WeightCard ───────────────── */

export default function WeightCard() {
  const { user } = useUser();
  const { showToast } = useToast();

  const dayNow = useDayNow();
  const dayKey = getLocalDayKey(dayNow);

  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draftWeight, setDraftWeight] = useState("");

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("weight_kg, bmi")
      .eq("id", user.id)
      .single()
      .then(
        ({
          data,
          error,
        }: {
          data: WeightProfileResult | null;
          error: { message: string } | null;
        }) => {
          if (error) return console.error(error.message);
          if (data) {
            setWeight(data.weight_kg);
            setBmi(data.bmi);
            setDraftWeight(String(data.weight_kg));
          }
        }
      );
  }, [user]);

  async function saveWeight() {
    if (!user || weight === null) return;

    const parsed = parseFloat(draftWeight);
    if (isNaN(parsed) || parsed <= 0) return;

    const newBMI = calculateBMI(parsed);

    const { error } = await supabase
      .from("profiles")
      .update({ weight_kg: parsed, bmi: newBMI })
      .eq("id", user.id);

    if (error) return console.error(error.message);

    /* ───── 🔹 GEWICHT LOGGEN (UPSERT, 1x per dag) ───── */

    const nowTs = new Date();

    await supabase
      .from("weight_logs")
      .upsert(
        {
          user_id: user.id,
          weight_kg: parsed,
          bmi: newBMI,
          log_date: dayKey,
          log_time_local: nowTs
            .toTimeString()
            .slice(0, 8),
          timezone:
            Intl.DateTimeFormat().resolvedOptions()
              .timeZone,
        },
        {
          onConflict: "user_id,log_date",
        }
      );

    /* ───────────────────────────────────────── */

    setWeight(parsed);
    setBmi(newBMI);
    setIsEditing(false);

    showToast("✓ Gewicht bijgewerkt · Nieuwe doelen vanaf morgen");
  }

  function cancelEdit() {
    if (weight === null) return;
    setDraftWeight(String(weight));
    setIsEditing(false);
  }

  if (weight === null || bmi === null) {
    return (
      <Card title="Gewicht">
        <div className="text-sm text-gray-500">
          Gegevens laden…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Gewicht"
      icon={<Image src="/weight.svg" alt="" width={16} height={16} />}
      action={
        !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="group relative h-6 w-6"
            aria-label="Gewicht wijzigen"
          >
            <Image
              src="/plus_sign.svg"
              alt=""
              fill
              className="object-contain group-hover:opacity-0"
            />
            <Image
              src="/plus_sign_hover.svg"
              alt=""
              fill
              className="object-contain opacity-0 group-hover:opacity-100"
            />
          </button>
        )
      }
    >
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={draftWeight}
                onChange={(e) => setDraftWeight(e.target.value)}
                className="w-24 rounded-[var(--radius)] border px-2 py-1 text-sm"
              />
              <span className="text-sm text-gray-500">kg</span>

              <button
                onClick={saveWeight}
                className="rounded-[var(--radius)] bg-[#0095D3] px-3 py-1 text-xs font-medium text-white"
              >
                Opslaan
              </button>

              <button
                onClick={cancelEdit}
                className="rounded-[var(--radius)] border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-400"
              >
                Annuleren
              </button>
            </div>
          ) : (
            <div className="text-2xl font-semibold text-[#191970]">
              {weight} kg
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              BMI: {bmi.toFixed(1)} ({getBMICategory(bmi)})
            </span>

            <button
              onClick={() =>
                showToast(
                  "BMI is een algemene indicatie en houdt geen rekening met spiermassa of vetpercentage.",
                  7000,
                  "info"
                )
              }
              className="group relative h-4 w-4"
              aria-label="BMI informatie"
            >
              <Image
                src="/info.svg"
                alt=""
                fill
                className="object-contain group-hover:opacity-0"
              />
              <Image
                src="/info_hover.svg"
                alt=""
                fill
                className="object-contain opacity-0 group-hover:opacity-100"
              />
            </button>
          </div>

          <BMIBar bmi={bmi} />
        </div>
      </div>
    </Card>
  );
}
