//  app/lib/LangProvider.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  // Taal laden bij login
  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .single()
      .then(({ data }: { data: { language: Lang } | null }) => {
        if (data?.language) setLang(data.language);
      });
  }, [user]);

  async function setUserLanguage(newLang: Lang) {
    setLang(newLang); // 🔥 DIRECT LIVE UPDATE

    if (!user) return;

    await supabase
      .from("profiles")
      .update({ language: newLang })
      .eq("id", user.id);
  }

  return (
    <LangContext.Provider value={{ lang, setUserLanguage }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLangContext() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLangContext must be used inside LangProvider");
  return ctx;
}
