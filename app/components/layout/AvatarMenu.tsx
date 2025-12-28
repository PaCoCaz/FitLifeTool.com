"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  firstName: string;
};

export default function AvatarMenu({ firstName }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Sluit menu bij klik buiten
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
  
    await fetch("/auth/logout", {
      method: "POST",
      cache: "no-store",
    });
  
    // 🔴 HARD navigation: nieuwe request, nieuwe middleware run
    window.location.assign("/login");
  };  

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          rounded-[var(--radius)]
          bg-[#191970]
          px-3 py-2
          text-white
          max-w-full
          cursor-pointer
          hover:bg-[#0BA4E0]
          transition-colors
        "
      >
        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/user.svg"
            alt=""
            fill
            className="object-contain"
          />
        </span>

        <span className="min-w-0 truncate text-sm font-medium">
          {firstName}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48
            rounded-[var(--radius)]
            bg-white
            shadow-lg
            border
            py-1
            z-50
          "
        >
          {/* Instellingen */}
          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="block w-full"
          >
            <div
              className="
                mx-1
                rounded-[var(--radius)]
                px-3 py-1.5
                text-left text-sm
                hover:bg-gray-50
              "
            >
              Instellingen
            </div>
          </button>

          {/* Divider */}
          <div className="mx-3 my-1 h-px bg-gray-100" />

          {/* Uitloggen */}
          <button
            onClick={handleLogout}
            className="block w-full"
          >
            <div
              className="
                mx-1
                rounded-[var(--radius)]
                px-3 py-1.5
                text-left text-sm
                text-red-600
                hover:bg-gray-50
              "
            >
              Uitloggen
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
