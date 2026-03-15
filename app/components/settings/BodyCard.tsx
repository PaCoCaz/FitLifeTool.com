//  app/components/settings/BodyCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useDashboard } from "@/lib/DashboardStore";

type Gender = "male" | "female";

const GENDER_OPTIONS = [
  {
    value: "male",
    label: "Man",
    desc:
      "Voor nauwkeurige gezondheids- en energieberekeningen gebruiken we biologisch geslacht.",
  },
  {
    value: "female",
    label: "Vrouw",
    desc:
      "Voor nauwkeurige gezondheids- en energieberekeningen gebruiken we biologisch geslacht.",
  },
];

const HEIGHTS = Array.from(
  { length: 81 },
  (_, i) => 140 + i
);

export default function BodyCard() {
  const { user } = useUser();
  const { refreshDashboard } = useDashboard();

  const [profile, setProfile] = useState<any>(null);

  const [draft, setDraft] = useState({
    birthdate: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
  });

  const [openGender, setOpenGender] =
    useState(false);

  const [openHeight, setOpenHeight] =
    useState(false);

  const [saving, setSaving] = useState(false);

  /* load */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select(
        "birthdate, gender, height_cm, weight_kg"
      )
      .eq("id", user.id)
      .single()
      .then((res: any) => {
        if (!res.data) return;

        setProfile(res.data);

        setDraft({
          birthdate: res.data.birthdate ?? "",
          gender: res.data.gender ?? "",
          height_cm:
            res.data.height_cm?.toString() ?? "",
          weight_kg:
            res.data.weight_kg?.toString() ?? "",
        });
      });
  }, [user]);

  const dirty =
    profile &&
    (
      draft.birthdate !==
        (profile.birthdate ?? "") ||
      draft.gender !==
        (profile.gender ?? "") ||
      draft.height_cm !==
        (profile.height_cm?.toString() ?? "") ||
      draft.weight_kg !==
        (profile.weight_kg?.toString() ?? "")
    );

  const invalid =
    !draft.birthdate ||
    !draft.gender ||
    !draft.height_cm ||
    !draft.weight_kg;

  /* save */

  async function save() {
    if (!user) return;
    if (invalid) return;

    setSaving(true);

    await supabase
      .from("profiles")
      .update({
        birthdate: draft.birthdate,
        gender: draft.gender,
        height_cm: Number(draft.height_cm),
        weight_kg: Number(draft.weight_kg),
      })
      .eq("id", user.id);

    await supabase.rpc(
      "recalculate_user_targets",
      {
        p_user_id: user.id,
      }
    );

    await refreshDashboard();

    setProfile({
      birthdate: draft.birthdate,
      gender: draft.gender,
      height_cm: draft.height_cm,
      weight_kg: draft.weight_kg,
    });

    setSaving(false);
  }

  const activeGender =
    GENDER_OPTIONS.find(
      g => g.value === draft.gender
    );

  return (
    <Card title="Gezondheidsprofiel">

      <div className="space-y-4">

        {/* birthdate */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Geboortedatum
          </div>

          <input
            type="date"
            value={draft.birthdate}
            onChange={e =>
              setDraft({
                ...draft,
                birthdate: e.target.value,
              })
            }
            className="
              w-full
              border-t
              border-b
              py-2
            "
          />

        </div>

        {/* gender */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Geslacht
          </div>

          <div
            onClick={() =>
              setOpenGender(!openGender)
            }
            className="
              cursor-pointer
              border-t
              border-b
              py-2
            "
          >

            <div className="flex justify-between">

              <span className="text-[#191970] text-sm">
                {activeGender?.label ??
                  "Selecteer"}
              </span>

              <span
                className={`transition-transform ${
                  openGender
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>

            </div>

            <div className="text-xs text-gray-500">
              {activeGender?.desc}
            </div>

          </div>

          {openGender && (

            <div className="border-b">

              {GENDER_OPTIONS.map(o => (

                <button
                  key={o.value}
                  onClick={() => {
                    setDraft({
                      ...draft,
                      gender: o.value,
                    });

                    setOpenGender(false);
                  }}
                  className="
                    w-full
                    text-left
                    py-2
                    border-t
                    hover:bg-gray-50
                  "
                >

                  <div>

                    <div className="text-sm">
                      {o.label}
                    </div>

                    <div className="text-xs text-gray-500">
                      {o.desc}
                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

        {/* height */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Lengte (cm)
          </div>

          <div
            onClick={() =>
              setOpenHeight(!openHeight)
            }
            className="
              cursor-pointer
              border-t
              border-b
              py-2
            "
          >

            <div className="flex justify-between">

              <span className="text-[#191970] text-sm">
                {draft.height_cm
                  ? `${draft.height_cm} cm`
                  : "Selecteer"}
              </span>

              <span
                className={`transition-transform ${
                  openHeight
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>

            </div>

          </div>

          {openHeight && (

            <div className="border-b max-h-40 overflow-y-auto">

              {HEIGHTS.map(h => (

                <button
                  key={h}
                  onClick={() => {
                    setDraft({
                      ...draft,
                      height_cm: String(h),
                    });

                    setOpenHeight(false);
                  }}
                  className="
                    w-full
                    text-left
                    py-2
                    border-t
                    hover:bg-gray-50
                  "
                >
                  {h} cm
                </button>

              ))}

            </div>

          )}

        </div>

        {/* weight */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Gewicht (kg)
          </div>

          <input
            type="number"
            step="0.1"
            value={draft.weight_kg}
            onChange={e =>
              setDraft({
                ...draft,
                weight_kg: e.target.value,
              })
            }
            className="
              w-full
              border-t
              border-b
              py-2
            "
          />

        </div>

        {/* save */}

        <div className="flex justify-end pt-2">

          <button
            onClick={save}
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
              ? "Opslaan…"
              : !dirty || invalid
              ? "Opgeslagen"
              : "Opslaan"}
          </button>

        </div>

      </div>

    </Card>
  );
}