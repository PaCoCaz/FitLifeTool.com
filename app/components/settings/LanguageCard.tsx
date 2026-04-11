//  app/components/settings/LanguageCard.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useLang, useSetUserLanguage } from "@/lib/useLang";

type Lang = "en" | "nl" | "de" | "fr" | "pl";

const OPTIONS: {
  value: Lang;
  label: string;
  flag: string;
  desc: string;
}[] = [
  {
    value: "en",
    label: "English",
    flag: "/images/flags/en.svg",
    desc: "The dashboard language is English.",
  },

  {
    value: "nl",
    label: "Nederlands",
    flag: "/images/flags/nl.svg",
    desc: "De taal van het dashboard is Nederlands.",
  },

  {
    value: "de",
    label: "Deutsch",
    flag: "/images/flags/de.svg",
    desc: "Die Sprache des Dashboards ist Deutsch.",
  },

  {
    value: "fr",
    label: "Français",
    flag: "/images/flags/fr.svg",
    desc: "La langue du tableau de bord est le français.",
  },

  {
    value: "pl",
    label: "Polski",
    flag: "/images/flags/pl.svg",
    desc: "Język panelu to polski.",
  },
];

export default function LanguageCard() {
  const lang = useLang();
  const setUserLanguage = useSetUserLanguage();

  const [draft, setDraft] = useState<Lang | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lang) {
      setDraft(lang as Lang);
    }
  }, [lang]);

  const dirty = draft !== lang;

  async function save() {
    if (!draft) return;

    setSaving(true);

    await setUserLanguage(draft);

    setSaving(false);
  }

  const active = OPTIONS.find(
    o => o.value === draft
  );

  return (
    <Card
      header={<CardHeader title="Taal" />}
    >

      <div className="space-y-3">

        {/* label */}

        <div className="pt-3 text-xs font-semibold text-gray-400">
          Taal van het dashboard
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

            <div className="flex items-center gap-3">

              {active && (
                <Image
                  src={active.flag}
                  alt=""
                  width={18}
                  height={18}
                />
              )}

              <span className="text-[#191970] text-sm">
                {active?.label ?? "Selecteer"}
              </span>

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
                  px-0
                  py-2
                  border-t
                  hover:bg-gray-50
                "
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
              ? "Opslaan…"
              : !dirty
              ? "Opgeslagen"
              : "Opslaan"}
          </button>

        </div>

      </div>

    </Card>
  );
}