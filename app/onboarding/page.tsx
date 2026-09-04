"use client";

import OnboardingFlow from "@/components/auth/OnboardingFlow";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import LogoutControl from "@/components/auth/LogoutControl";

export default function OnboardingPage() {
  const lang = useLang();
  const t = uiText[lang].auth;

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-md rounded-[var(--radius)] bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="onboarding-title" className="text-lg font-semibold text-[#191970]">
            {t.onboardingTitle}
          </h1>
          <LogoutControl language={lang} className="text-sm text-red-600 hover:underline disabled:opacity-50" />
        </div>
        <OnboardingFlow />
      </section>
    </main>
  );
}
