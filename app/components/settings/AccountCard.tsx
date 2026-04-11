//  app/components/settings/AccountCard.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLang, useSetUserLanguage } from "@/lib/useLang";

type Lang = "en" | "nl" | "de" | "fr" | "pl";

const OPTIONS: {
  value: Lang;
  label: string;
  flag: string;
  desc: string;
}[] = [
  { value: "en", label: "English", flag: "/images/flags/en.svg", desc: "The dashboard language is English." },
  { value: "nl", label: "Nederlands", flag: "/images/flags/nl.svg", desc: "De taal van het dashboard is Nederlands." },
  { value: "de", label: "Deutsch", flag: "/images/flags/de.svg", desc: "Die Sprache des Dashboards ist Deutsch." },
  { value: "fr", label: "Français", flag: "/images/flags/fr.svg", desc: "La langue du tableau de bord est le français." },
  { value: "pl", label: "Polski", flag: "/images/flags/pl.svg", desc: "Język panelu to polski." },
];

export default function AccountCard() {
  const { user } = useUser();

  const lang = useLang();
  const setUserLanguage = useSetUserLanguage();

  const [profile, setProfile] = useState<any>(null);

  const [draft, setDraft] = useState({
    first_name: "",
    last_name: "",
  });

  const [langDraft, setLangDraft] = useState<Lang | null>(null);
  const [openLang, setOpenLang] = useState(false);

  const [saving, setSaving] = useState(false);

  /* ───────── LOAD PROFILE ───────── */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()
      .then((res: any) => {
        if (!res.data) return;

        setProfile(res.data);

        setDraft({
          first_name: res.data.first_name ?? "",
          last_name: res.data.last_name ?? "",
        });
      });
  }, [user]);

  /* ───────── LOAD LANGUAGE ───────── */

  useEffect(() => {
    if (lang) {
      setLangDraft(lang as Lang);
    }
  }, [lang]);

  /* ───────── STATES ───────── */

  const dirtyProfile =
    profile &&
    (
      draft.first_name !== (profile.first_name ?? "") ||
      draft.last_name !== (profile.last_name ?? "")
    );

  const dirtyLang = langDraft !== lang;

  const dirty = dirtyProfile || dirtyLang;

  const invalid =
    !draft.first_name ||
    !draft.last_name;

  const activeLang = OPTIONS.find(o => o.value === langDraft);

  /* ───────── SAVE ───────── */

  async function save() {
    if (!user) return;
    if (invalid) return;

    setSaving(true);

    // profiel
    if (dirtyProfile) {
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
    }

    // taal
    if (dirtyLang && langDraft) {
      await setUserLanguage(langDraft);
    }

    setSaving(false);
  }

  /* ───────── UI ───────── */

  return (
    <Card header={<CardHeader title="Account" />}>

      <div className="space-y-4">

        {/* voornaam */}
        <div className="pt-3">
          <div className="text-xs font-semibold text-gray-400">
            Voornaam
          </div>

          <input
            value={draft.first_name}
            onChange={e =>
              setDraft({
                ...draft,
                first_name: e.target.value,
              })
            }
            className="w-full border-t border-b py-2"
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
                last_name: e.target.value,
              })
            }
            className="w-full border-t border-b py-2"
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

        {/* taal */}
        <div>
          <div className="text-xs font-semibold text-gray-400">
            Taal
          </div>

          <div
            onClick={() => setOpenLang(!openLang)}
            className="cursor-pointer border-t border-b py-2"
          >
            <div className="flex justify-between">

              <div className="flex items-center gap-3">
                {activeLang && (
                  <Image
                    src={activeLang.flag}
                    alt=""
                    width={18}
                    height={18}
                  />
                )}

                <span className="text-[#191970] text-sm">
                  {activeLang?.label ?? "Selecteer"}
                </span>
              </div>

              <span className={`transition-transform ${openLang ? "rotate-180" : ""}`}>
                ▾
              </span>

            </div>

            <div className="text-xs text-gray-500">
              {activeLang?.desc}
            </div>
          </div>

          {openLang && (
            <div className="border-b">
              {OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => {
                    setLangDraft(o.value);
                    setOpenLang(false);
                  }}
                  className="w-full text-left py-2 border-t hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">

                    <Image
                      src={o.flag}
                      alt=""
                      width={18}
                      height={18}
                    />

                    <div>
                      <div className="text-sm">
                        {o.label}
                      </div>

                      <div className="text-xs text-gray-500">
                        {o.desc}
                      </div>
                    </div>

                  </div>
                </button>
              ))}
            </div>
          )}
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