//  app/components/layout/AvatarMenu.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLang, useSetUserLanguage } from "@/lib/useLang";
import { useGoalContext } from "@/lib/GoalProvider";

type Props = {
  firstName: string;
};

export default function AvatarMenu({ firstName }: Props) {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<"language" | "goal" | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const lang = useLang();
  const setUserLanguage = useSetUserLanguage();
  const { goal, setUserGoal } = useGoalContext();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setOpenSection(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await fetch("/auth/logout", {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    });
    window.location.assign("/");
  };

  async function changeLanguage(newLang: any) {
    setOpen(false);
    setOpenSection(null);
    await setUserLanguage(newLang);
  }

  async function changeGoal(newGoal: any) {
    setOpen(false);
    setOpenSection(null);
    await setUserGoal(newGoal);
  }

  const languages = [
    { code: "en", label: "English", flag: "/images/flags/en.svg" },
    { code: "nl", label: "Nederlands", flag: "/images/flags/nl.svg" },
    { code: "de", label: "Deutsch", flag: "/images/flags/de.svg" },
    { code: "fr", label: "Français", flag: "/images/flags/fr.svg" },
    { code: "pl", label: "Polski", flag: "/images/flags/pl.svg" },
  ];

  const goals = [
    { code: "LOSE", label: "Lose weight" },
    { code: "MAINTAIN", label: "Maintain weight" },
    { code: "GAIN", label: "Gain weight" },
    { code: "HOLIDAY", label: "Holiday mode" },
  ];

  const activeLanguage = languages.find(l => l.code === lang);
  const activeGoal = goals.find(g => g.code === goal);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-[var(--radius)] bg-[#191970] px-3 py-2 text-white hover:bg-[#0BA4E0] transition-colors"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full">
          <Image src="/user.svg" alt="" fill className="object-contain" />
        </span>
        <span className="truncate text-sm font-medium">{firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[260px] rounded-[var(--radius)] bg-white shadow-lg border py-2 z-50">

          {/* ACCOUNT */}
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400">
            Account
          </div>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Settings
          </button>

          <div className="my-2 h-px bg-gray-100" />

          {/* LANGUAGE */}
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400">
            Language
          </div>

          <div className="px-4">
            <div
              onClick={() =>
                setOpenSection(openSection === "language" ? null : "language")
              }
              className="flex items-center justify-between cursor-pointer py-2"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={activeLanguage?.flag || "/images/flags/en.svg"}
                  alt=""
                  width={18}
                  height={18}
                />
                <span className="text-sm text-[#191970]">
                  {activeLanguage?.label}
                </span>
              </div>

              <span
                className={`text-gray-400 transition-transform ${
                  openSection === "language" ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </div>

            {openSection === "language" && (
              <div>
                {languages
                  .filter(l => l.code !== lang)
                  .map(l => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 border-t border-gray-100"
                    >
                      <Image
                        src={l.flag}
                        alt=""
                        width={18}
                        height={18}
                      />
                      {l.label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="my-2 h-px bg-gray-100" />

          {/* GOAL */}
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400">
            Goal
          </div>

          <div className="px-4">
            <div
              onClick={() =>
                setOpenSection(openSection === "goal" ? null : "goal")
              }
              className="flex items-center justify-between cursor-pointer py-2"
            >
              <span className="text-sm text-[#191970]">
                {activeGoal?.label}
              </span>

              <span
                className={`text-gray-400 transition-transform ${
                  openSection === "goal" ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </div>

            {openSection === "goal" && (
              <div>
                {goals
                  .filter(g => g.code !== goal)
                  .map(g => (
                    <button
                      key={g.code}
                      onClick={() => changeGoal(g.code)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-t border-gray-100"
                    >
                      {g.label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="my-2 h-px bg-gray-100" />

          {/* SESSION */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}