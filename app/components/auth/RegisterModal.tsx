"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterStep from "@/components/auth/RegisterStep";
import type { Lang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

export type AuthModalMode = "login" | "register";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: AuthModalMode;
  initialLanguage?: Lang;
  onModeChange?: (mode: AuthModalMode) => void;
  publicWebLayout?: boolean;
  returnFocusTo?: HTMLElement | null;
  onFocusReady?: () => void;
};

export default function RegisterModal({
  open,
  onClose,
  mode = "register",
  initialLanguage,
  onModeChange,
  publicWebLayout = false,
  returnFocusTo,
  onFocusReady,
}: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<Lang | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const activeLanguage = selectedLanguage ?? initialLanguage ?? "en";
  const t = initialLanguage
    ? uiText[selectedLanguage ?? initialLanguage]
    : uiText[selectedLanguage ?? "en"];

  const closeModal = useCallback(() => {
    const returnFocus = returnFocusRef.current;
    setSelectedLanguage(null);
    onClose();
    requestAnimationFrame(() => {
      const fallback = publicWebLayout
        ? Array.from(
            document.querySelectorAll<HTMLElement>(
              ".public-web-mobile-menu-trigger, .public-web-header-login"
            )
          ).find((element) => element.getClientRects().length > 0)
        : null;
      const target = returnFocus?.isConnected && returnFocus.getClientRects().length > 0
        ? returnFocus
        : fallback;
      target?.focus();
    });
  }, [onClose, publicWebLayout]);

  useEffect(() => {
    if (!open || publicWebLayout) return;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  }, [initialLanguage, open, publicWebLayout]);

  useLayoutEffect(() => {
    if (!open || !publicWebLayout) return;
    returnFocusRef.current = returnFocusTo ?? null;
    const dialog = dialogRef.current;
    const initialControl = dialog?.querySelector<HTMLElement>(
      "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
    );
    (initialControl ?? dialog)?.focus();
    if (dialog?.contains(document.activeElement)) onFocusReady?.();
  }, [mode, onFocusReady, open, publicWebLayout, returnFocusTo]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const focusFrame = publicWebLayout
      ? null
      : requestAnimationFrame(() => {
          const dialog = dialogRef.current;
          const initialControl = dialog?.querySelector<HTMLElement>(
            "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
          );
          (initialControl ?? dialog)?.focus();
        });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      if (focusFrame !== null) cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [closeModal, mode, open, publicWebLayout]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6${
        publicWebLayout ? " public-web-auth-modal-overlay" : ""
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[var(--radius)] bg-white p-6 shadow-xl${
          publicWebLayout ? " public-web-auth-modal-dialog" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold text-[#191970]">
            {mode === "login" ? t.auth.loginTitle : t.auth.accountTitle}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="rounded text-xl text-gray-400 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0BA4E0]"
            aria-label={t.common.close}
          >
            ×
          </button>
        </div>
        {mode === "login" ? (
          <LoginForm
            language={activeLanguage}
            onRegister={
              onModeChange
                ? () => onModeChange("register")
                : undefined
            }
          />
        ) : (
          <RegisterStep
            selectedLanguage={selectedLanguage ?? initialLanguage ?? null}
            onLanguageSelect={setSelectedLanguage}
          />
        )}
      </div>
    </div>
  );
}
