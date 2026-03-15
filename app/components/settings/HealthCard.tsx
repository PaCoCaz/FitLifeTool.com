//  app/components/settings/AccountCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

export default function AccountCard() {
  const { user } = useUser();

  const [profile, setProfile] = useState<any>(null);

  const [draft, setDraft] = useState({
    first_name: "",
    last_name: "",
  });

  const [saving, setSaving] = useState(false);

  /* load */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select(
        "first_name, last_name, abonnement"
      )
      .eq("id", user.id)
      .single()
      .then((res: any) => {
        if (!res.data) return;

        setProfile(res.data);

        setDraft({
          first_name:
            res.data.first_name ?? "",
          last_name:
            res.data.last_name ?? "",
        });
      });
  }, [user]);

  const dirty =
    profile &&
    (
      draft.first_name !==
        (profile.first_name ?? "") ||
      draft.last_name !==
        (profile.last_name ?? "")
    );

  const invalid =
    !draft.first_name ||
    !draft.last_name;

  /* save */

  async function save() {
    if (!user) return;
    if (invalid) return;

    setSaving(true);

    await supabase
      .from("profiles")
      .update({
        first_name: draft.first_name,
        last_name: draft.last_name,
      })
      .eq("id", user.id);

    setProfile({
      ...profile,
      first_name: draft.first_name,
      last_name: draft.last_name,
    });

    setSaving(false);
  }

  return (
    <Card title="Account">

      <div className="space-y-4">

        {/* voornaam */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Voornaam
          </div>

          <input
            value={draft.first_name}
            onChange={e =>
              setDraft({
                ...draft,
                first_name:
                  e.target.value,
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

        {/* achternaam */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Achternaam
          </div>

          <input
            value={draft.last_name}
            onChange={e =>
              setDraft({
                ...draft,
                last_name:
                  e.target.value,
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

        {/* email */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Email
          </div>

          <div className="border-t border-b py-2 text-sm text-gray-400">
            {user?.email}
          </div>

        </div>

        {/* abonnement */}

        <div>

          <div className="text-xs font-semibold text-gray-400">
            Abonnement
          </div>

          <div className="border-t border-b py-2 text-sm text-gray-400">
            {profile?.abonnement ?? "free"}
          </div>

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