//  app/components/layout/AvatarMenu.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLang, setUserLanguage } from "@/lib/useLang";

type Props = {
  firstName: string;
};

export default function AvatarMenu({ firstName }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const lang = useLang();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
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
    await setUserLanguage(newLang);
  }

  const languages = [
    { code: "en", label: "English", flag: "/images/flags/en.svg" },
    { code: "nl", label: "Nederlands", flag: "/images/flags/nl.svg" },
    { code: "de", label: "Deutsch", flag: "/images/flags/de.svg" },
    { code: "fr", label: "Français", flag: "/images/flags/fr.svg" },
    { code: "pl", label: "Polski", flag: "/images/flags/pl.svg" },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
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
  <details className="group">
    <summary className="flex items-center justify-between cursor-pointer list-none py-2">
      <div className="flex items-center gap-3">
        <Image
          src={languages.find(l => l.code === lang)?.flag || "/images/flags/en.svg"}
          alt=""
          width={18}
          height={18}
          className="object-cover"
        />
        <span className="font-semibold text-[#191970]">
          {languages.find(l => l.code === lang)?.label}
        </span>
      </div>

      <span className="text-gray-400 group-open:rotate-180 transition-transform">
        ▾
      </span>
    </summary>

    <div className="mt-1 rounded-md border bg-white shadow-sm overflow-hidden">
      {languages
        .filter(l => l.code !== lang)
        .map(l => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Image
              src={l.flag}
              alt=""
              width={18}
              height={18}
              className="object-cover"
            />
            {l.label}
          </button>
        ))}
    </div>
  </details>
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
