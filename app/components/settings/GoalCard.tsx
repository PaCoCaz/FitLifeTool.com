//  app/components/settings/GoalCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useGoalContext, GoalKey } from "@/lib/GoalProvider";
import { useDashboard } from "@/lib/DashboardStore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

export default function GoalCard() {
  const langCode = useLang();
  const t = uiText[langCode];

  const OPTIONS: {
    value: GoalKey;
    label: string;
    desc: string;
  }[] = [
    {
      value: "LOSE",
      label: t.goals.lose,
      desc: t.goalDescriptions.lose,
    },
    {
      value: "MAINTAIN",
      label: t.goals.maintain,
      desc: t.goalDescriptions.maintain,
    },
    {
      value: "GAIN",
      label: t.goals.gain,
      desc: t.goalDescriptions.gain,
    },
    {
      value: "HOLIDAY",
      label: t.goals.holiday,
      desc: t.goalDescriptions.holiday,
    },
  ];
  
  const { goal, setUserGoal } = useGoalContext();
  const { refreshDashboard } = useDashboard();

  const [draft, setDraft] =
    useState<GoalKey | null>(null);

  const [open, setOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  /* load */

  useEffect(() => {
    if (goal) {
      setDraft(goal);
    }
  }, [goal]);

  const dirty = draft !== goal;

  /* save */

  async function save() {
    if (!draft) return;

    setSaving(true);

    await setUserGoal(draft);

    await refreshDashboard();

    setSaving(false);
  }

  const active = OPTIONS.find(
    o => o.value === draft
  );

  return (
    <Card
      header={<CardHeader title={t.common.goal} />}
    >

      <div className="space-y-3">

        {/* label */}

        <div className="pt-3 text-xs font-semibold text-gray-400">
          {t.goal.current}
        </div>

        {/* header */}

        <div
          onClick={() => setOpen(!open)}
          className="
            cursor-pointer
            border-t
            border-b
            py-2
          "
        >
          <div className="flex justify-between">

            <div className="text-[#191970] text-sm">
              {active?.label ?? t.common.select}
            </div>

            <div
              className={`transition-transform ${
                open ? "rotate-180" : ""
              }`}
            >
              ▾
            </div>

          </div>

          <div className="text-xs text-gray-500">
            {active?.desc}
          </div>

        </div>

        {/* options */}

        {open && (

          <div className="border-b">

            {OPTIONS.map(o => (

              <button
                key={o.value}
                onClick={() => {
                  setDraft(o.value);
                  setOpen(false);
                }}
                className="
                  w-full
                  text-left
                  py-2
                  border-t
                  hover:bg-gray-50
                "
              >

                <div className="text-sm">
                  {o.label}
                </div>

                <div className="text-xs text-gray-500">
                  {o.desc}
                </div>

              </button>

            ))}

          </div>

        )}

        {/* save */}

        <div className="flex justify-end pt-2">

          <button
            onClick={save}
            disabled={saving || !dirty}
            className={`
              rounded-[var(--radius)]
              border
              px-4
              py-2
              text-sm
              transition-colors

              ${
                saving
                  ? "border-gray-300 text-gray-400"
                  : !dirty
                  ? "border-green-500 text-green-600"
                  : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
              }
            `}
          >
            {saving
              ? t.common.saving
              : !dirty
              ? t.common.saved
              : t.common.save}
          </button>

        </div>

      </div>

    </Card>
  );
}