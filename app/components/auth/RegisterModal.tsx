// app/components/auth/RegisterModal.tsx

"use client";

import { useEffect, useState } from "react";
import RegisterStep from "@/components/auth/RegisterStep";
import OnboardingPersonalStep from "@/components/auth/OnboardingPersonalStep";
import OnboardingBodyStep from "@/components/auth/OnboardingBodyStep";
import OnboardingFinalStep from "@/components/auth/OnboardingFinalStep";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TOTAL_STEPS = 4;

export default function RegisterModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);

  /* ───────────────── Close handlers ───────────────── */

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  if (!open) return null;

  /* ───────────────── Step titles ───────────────── */

  const stepTitle =
    step === 1
      ? "Account aanmaken"
      : step === 2
      ? "Persoonlijke gegevens"
      : step === 3
      ? "Lichaamsgegevens"
      : "Je doelen";

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40
      "
    >
      <div
        className="
          w-full max-w-md
          mx-4
          sm:mx-0
          rounded-[var(--radius)]
          bg-white
          shadow-xl
          p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#191970]">
            {stepTitle}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Sluiten"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>
              Stap {step} van {TOTAL_STEPS}
            </span>
          </div>

          <div className="h-1 w-full rounded bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-[#191970] transition-all"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[140px]">
          {step === 1 && (
            <RegisterStep onSuccess={() => setStep(2)} />
          )}

          {step === 2 && (
            <OnboardingPersonalStep
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <OnboardingBodyStep
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <OnboardingFinalStep
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
