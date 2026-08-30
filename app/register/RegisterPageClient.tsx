"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RegisterStep from "@/components/auth/RegisterStep";
import type { AppLanguage } from "@/lib/languagePreference";
import { getPublicPagePath } from "@/lib/publicWeb";
import { uiText } from "@/lib/uiText";
import { useSetInterfaceLanguage } from "@/lib/useLang";

export default function RegisterPageClient({
  initialLanguage,
}: {
  initialLanguage: AppLanguage;
}) {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage);
  const setInterfaceLanguage = useSetInterfaceLanguage();
  const t = uiText[language];

  useEffect(() => {
    setInterfaceLanguage(initialLanguage);
  }, [initialLanguage, setInterfaceLanguage]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-6 bg-[#DBE4F0]"
      lang={language}
    >
      <section className="w-full max-w-md rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          {t.auth.accountTitle}
        </h1>
        <RegisterStep
          selectedLanguage={language}
          onLanguageSelect={setLanguage}
        />
        <Link
          href={getPublicPagePath("home", language)}
          className="mt-4 inline-block text-sm text-[#191970] hover:underline"
        >
          {t.auth.back}
        </Link>
      </section>
    </main>
  );
}
