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
import type { AuthModalMode } from "@/components/auth/RegisterModal";
import type { AppLanguage } from "@/lib/languagePreference";

type RegisterModalComponent =
  (typeof import("@/components/auth/RegisterModal"))["default"];
type LangProviderModule = typeof import("@/lib/LangProvider");

type PublicAuthModules = {
  RegisterModal: RegisterModalComponent;
  LangProvider: LangProviderModule["LangProvider"];
  useLangContext: LangProviderModule["useLangContext"];
};

type PublicAuthModalContextValue = {
  openAuthModal: (mode: AuthModalMode) => void;
};

const PublicAuthModalContext =
  createContext<PublicAuthModalContextValue | null>(null);

function LoadedAuthModal({
  modules,
  locale,
  mode,
  onModeChange,
  onClose,
}: {
  modules: PublicAuthModules;
  locale: AppLanguage;
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
  onClose: () => void;
}) {
  const { LangProvider } = modules;

  return (
    <LangProvider>
      <LocalizedAuthModal
        modules={modules}
        locale={locale}
        mode={mode}
        onModeChange={onModeChange}
        onClose={onClose}
      />
    </LangProvider>
  );
}

function LocalizedAuthModal({
  modules,
  locale,
  mode,
  onModeChange,
  onClose,
}: {
  modules: PublicAuthModules;
  locale: AppLanguage;
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
  onClose: () => void;
}) {
  const { RegisterModal, useLangContext } = modules;
  const { setInterfaceLanguage } = useLangContext();
  const [readyLocale, setReadyLocale] = useState<AppLanguage | null>(null);

  useEffect(() => {
    setInterfaceLanguage(locale);
    setReadyLocale(locale);
  }, [locale, setInterfaceLanguage]);

  if (readyLocale !== locale) return null;

  return (
    <RegisterModal
      open
      mode={mode}
      initialLanguage={locale}
      publicWebLayout
      onModeChange={onModeChange}
      onClose={onClose}
    />
  );
}

function PublicAuthModalState({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLanguage;
}) {
  const [mode, setMode] = useState<AuthModalMode | null>(null);
  const [authModules, setAuthModules] = useState<PublicAuthModules | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const modalPromiseRef = useRef<Promise<PublicAuthModules> | null>(null);
  const requestedModeRef = useRef<AuthModalMode | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const openAuthModal = useCallback((nextMode: AuthModalMode) => {
    requestedModeRef.current = nextMode;
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (authModules) {
      setMode(nextMode);
      return;
    }

    if (modalPromiseRef.current) return;

    const modalPromise = Promise.all([
      import("@/components/auth/RegisterModal"),
      import("@/lib/LangProvider"),
    ]).then(([registerModalModule, langProviderModule]) => ({
      RegisterModal: registerModalModule.default,
      LangProvider: langProviderModule.LangProvider,
      useLangContext: langProviderModule.useLangContext,
    }));
    modalPromiseRef.current = modalPromise;

    void modalPromise.then((modules) => {
      if (!mountedRef.current) return;
      setAuthModules(modules);
      openerRef.current?.focus();
      setMode(requestedModeRef.current);
    });
  }, [authModules]);

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
      <div
        ref={backgroundRef}
        className="public-web-auth-background"
        aria-hidden={mode ? true : undefined}
      >
        {children}
      </div>
      {authModules && mode ? (
        <LoadedAuthModal
          modules={authModules}
          locale={locale}
          mode={mode}
          onModeChange={setMode}
          onClose={closeAuthModal}
        />
      ) : null}
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
    <PublicAuthModalState locale={locale}>{children}</PublicAuthModalState>
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
