// app/components/layout/LoginMenu.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

type Props = {
  onRegister: () => void;
};

export default function LoginMenu({ onRegister }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center
          rounded-[var(--radius)]
          bg-[#191970]
          px-4 py-2
          text-white
          text-sm font-medium
          hover:bg-[#0BA4E0]
          transition-colors
        "
      >
        Inloggen
      </button>

      {/* Dropdown met formulier */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-[360px]
            rounded-[var(--radius)]
            bg-white
            shadow-xl
            border
            p-6
            z-50
          "
        >
          <h2 className="mb-4 text-xl font-semibold text-[#191970]">
            Inloggen
          </h2>

          <LoginForm onRegister={onRegister} />
        </div>
      )}
    </div>
  );
}
