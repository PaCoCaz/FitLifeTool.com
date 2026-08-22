// app/components/layout/LoginMenu.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { asRecoveryLanguage } from "@/lib/auth/passwordRecovery";
import { uiText } from "@/lib/uiText";
import {
  useLang,
  useSetInterfaceLanguage,
} from "@/lib/useLang";

type Props = {
  onRegister: () => void;
};

export default function LoginMenu({ onRegister }: Props) {
  const lang = useLang();
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[lang].auth;
  const [open, setOpen] = useState(false);
  const [passwordResetNotice, setPasswordResetNotice] =
    useState(false);
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

  useEffect(() => {
    let cancelled = false;
    const url = new URL(window.location.href);
    const requestedLanguage = asRecoveryLanguage(
      url.searchParams.get("lang")
    );

    if (requestedLanguage) {
      setInterfaceLanguage(requestedLanguage);
    }

    if (url.searchParams.get("auth_notice") === "password_reset") {
      queueMicrotask(() => {
        if (cancelled) return;
        setPasswordResetNotice(true);
        setOpen(true);
      });
      url.searchParams.delete("auth_notice");
      url.searchParams.delete("lang");
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }

    return () => {
      cancelled = true;
    };
  }, [setInterfaceLanguage]);

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
            max-w-[calc(100vw-2rem)]
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

          {passwordResetNotice && (
            <p className="mb-4 text-sm text-green-700" role="status">
              {t.passwordResetSuccess} {t.loginAgain}
            </p>
          )}

          <LoginForm language={lang} onRegister={onRegister} />
        </div>
      )}
    </div>
  );
}
