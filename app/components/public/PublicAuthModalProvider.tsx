"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import RegisterModal, {
  type AuthModalMode,
} from "@/components/auth/RegisterModal";
import { LangProvider } from "@/lib/LangProvider";
import type { AppLanguage } from "@/lib/languagePreference";
import { useSetInterfaceLanguage } from "@/lib/useLang";

type PublicAuthModalContextValue = {
  openAuthModal: (mode: AuthModalMode) => void;
};

const PublicAuthModalContext =
  createContext<PublicAuthModalContextValue | null>(null);

function LocaleSynchronizer({ locale }: { locale: AppLanguage }) {
  const setInterfaceLanguage = useSetInterfaceLanguage();

  useEffect(() => {
    setInterfaceLanguage(locale);
  }, [locale, setInterfaceLanguage]);

  return null;
}

function PublicAuthModalState({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLanguage;
}) {
  const [mode, setMode] = useState<AuthModalMode | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const openAuthModal = useCallback((nextMode: AuthModalMode) => {
    setMode(nextMode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setMode(null);
  }, []);

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    if (mode) {
      background.setAttribute("inert", "");
    } else {
      background.removeAttribute("inert");
    }

    return () => background.removeAttribute("inert");
  }, [mode]);

  return (
    <PublicAuthModalContext.Provider value={{ openAuthModal }}>
      <LocaleSynchronizer locale={locale} />
      <div
        ref={backgroundRef}
        className="public-web-auth-background"
        aria-hidden={mode ? true : undefined}
      >
        {children}
      </div>
      <RegisterModal
        open={mode !== null}
        mode={mode ?? "register"}
        initialLanguage={locale}
        publicWebLayout
        onModeChange={setMode}
        onClose={closeAuthModal}
      />
    </PublicAuthModalContext.Provider>
  );
}

export default function PublicAuthModalProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLanguage;
}) {
  return (
    <LangProvider>
      <PublicAuthModalState locale={locale}>
        {children}
      </PublicAuthModalState>
    </LangProvider>
  );
}

export function PublicAuthTrigger({
  mode,
  className = "",
  onClick,
  children,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  mode: AuthModalMode;
}) {
  const context = useContext(PublicAuthModalContext);
  if (!context) {
    throw new Error(
      "PublicAuthTrigger must be used inside PublicAuthModalProvider"
    );
  }

  return (
    <button
      {...buttonProps}
      type="button"
      className={`public-web-auth-trigger ${className}`.trim()}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.openAuthModal(mode);
      }}
    >
      {children}
    </button>
  );
}
