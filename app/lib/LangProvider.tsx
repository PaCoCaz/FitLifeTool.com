//  app/lib/LangProvider.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import {
  asAppLanguage,
  resolveInterfaceLanguage,
  type AppLanguage,
} from "@/lib/languagePreference";

export type Lang = AppLanguage;

type LangContextType = {
  lang: Lang;
  isLoading: boolean;
  setInterfaceLanguage: (newLang: Lang) => void;
  setUserLanguage: (newLang: Lang) => Promise<void>;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const metadataLanguage = asAppLanguage(user?.user_metadata?.language);
  const [lang, setLang] = useState<Lang>(() =>
    resolveInterfaceLanguage(null, user?.user_metadata?.language)
  );
  const [loadedUserId, setLoadedUserId] =
    useState<string | null>(null);
  const isLoading =
    userId !== null && loadedUserId !== userId;

  /* ───────────────── LOAD LANGUAGE FROM DB ───────────────── */

  useEffect(() => {
    let cancelled = false;

    if (!userId) return;

    async function loadLanguage() {
      // Signup metadata bridges the short period before profile bootstrap exists.
      await Promise.resolve();
      if (cancelled) return;
      if (metadataLanguage) setLang(metadataLanguage);

      const { data, error } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Language load error:", error);
        setLoadedUserId(userId);
        return;
      }

      const profileLanguage = asAppLanguage(data?.language);
      if (profileLanguage) {
        // Once present, profiles.language is the persistent source of truth.
        setLang(profileLanguage);
      }

      setLoadedUserId(userId);
    }

    void loadLanguage();

    return () => {
      cancelled = true;
    };
  }, [metadataLanguage, userId]);

  /* ───────────────── CHANGE LANGUAGE ───────────────── */

  const setInterfaceLanguage = useCallback((newLang: Lang) => {
    setLang(newLang);
  }, []);

  const setUserLanguage = useCallback(
    async (newLang: Lang) => {
      if (!user) return;

      const userId = user.id;

      // 1️⃣ Direct live UI update
      setLang(newLang);

      // 2️⃣ Persist to database
      const { error } = await supabase
        .from("profiles")
        .update({ language: newLang })
        .eq("id", userId);

      if (error) {
        console.error("Language update failed:", error);

        // 🔁 Revert if DB update failed
        const { data } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", userId)
          .single();

        if (data?.language) {
          setLang(data.language as Lang);
        }
      }
    },
    [user]
  );

  /* ───────────────── PROVIDER ───────────────── */

  return (
    <LangContext.Provider
      value={{
        lang,
        isLoading,
        setInterfaceLanguage,
        setUserLanguage,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLangContext() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLangContext must be used inside LangProvider");
  }
  return ctx;
}
