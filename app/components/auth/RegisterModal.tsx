"use client";

import { useCallback, useEffect, useState } from "react";
import RegisterStep from "@/components/auth/RegisterStep";
import type { Lang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

type Props = { open: boolean; onClose: () => void };

export default function RegisterModal({ open, onClose }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<Lang | null>(null);
  const t = uiText[selectedLanguage ?? "en"];

  const closeModal = useCallback(() => {
    setSelectedLanguage(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div role="dialog" aria-modal="true" aria-labelledby="register-title" className="mx-4 w-full max-w-md rounded-[var(--radius)] bg-white p-6 shadow-xl sm:mx-0" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="register-title" className="text-lg font-semibold text-[#191970]">{t.auth.accountTitle}</h2>
          <button onClick={closeModal} className="text-xl text-gray-400 hover:text-gray-600" aria-label={t.common.close}>×</button>
        </div>
        <RegisterStep
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
        />
      </div>
    </div>
  );
}
