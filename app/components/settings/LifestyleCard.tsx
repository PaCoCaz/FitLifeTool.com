//  app/components/settings/LifestyleCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDashboard } from "@/lib/DashboardStore";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export default function LifestyleCard() {
  const langCode = useLang();
  const t = uiText[langCode];

  const OPTIONS: {
    value: ActivityLevel;
    label: string;
    desc: string;
  }[] = [
    {
      value: "sedentary",
      label: t.lifestyle.sedentary.label,
      desc: t.lifestyle.sedentary.desc,
    },
    {
      value: "light",
      label: t.lifestyle.light.label,
      desc: t.lifestyle.light.desc,
    },
    {
      value: "moderate",
      label: t.lifestyle.moderate.label,
      desc: t.lifestyle.moderate.desc,
    },
    {
      value: "active",
      label: t.lifestyle.active.label,
      desc: t.lifestyle.active.desc,
    },
    {
      value: "very_active",
      label: t.lifestyle.veryActive.label,
      desc: t.lifestyle.veryActive.desc,
    },
  ];

  const { user } = useUser();
  const { refreshDashboard } = useDashboard();

  const [level, setLevel] =
    useState<ActivityLevel | null>(null);

  const [draft, setDraft] =
    useState<ActivityLevel | null>(null);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const dirty = draft !== level;

  /* load */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("activity_level")
      .eq("id", user.id)
      .single()
      .then((res: any) => {
        if (res.data?.activity_level) {
          setLevel(res.data.activity_level);
          setDraft(res.data.activity_level);
        }
      });
  }, [user]);

  /* save */

  async function save() {
    if (!user || !draft) return;
  
    setSaving(true);
  
    await supabase
      .from("profiles")
      .update({
        activity_level: draft,
      })
      .eq("id", user.id);
  
    await supabase.rpc(
      "recalculate_user_targets",
      {
        p_user_id: user.id,
      }
    );
  
    await refreshDashboard();
  
    setLevel(draft);
  
    setSaving(false);
  }

  const active = OPTIONS.find(o => o.value === draft) ?? null;

  return (
    <Card
      header={<CardHeader title={t.lifestyle.title} />}
    >

      <div className="space-y-3">

        {/* label */}

        <div className="pt-3 text-xs font-semibold text-gray-400">
          {t.lifestyle.activityLevel}
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