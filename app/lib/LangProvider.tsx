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

export type Lang = "en" | "nl" | "fr" | "de" | "pl";

type LangContextType = {
  lang: Lang;
  setUserLanguage: (newLang: Lang) => Promise<void>;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [lang, setLang] = useState<Lang>("en");
  const [hasLoaded, setHasLoaded] = useState(false);

  /* ───────────────── LOAD LANGUAGE FROM DB ───────────────── */

  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    async function loadLanguage() {
      const { data, error } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Language load error:", error);
        return;
      }

      if (data?.language) {
        setLang(data.language as Lang);
      }

      setHasLoaded(true);
    }

    loadLanguage();
  }, [user]);

  /* ───────────────── CHANGE LANGUAGE ───────────────── */

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
    <LangContext.Provider value={{ lang, setUserLanguage }}>
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