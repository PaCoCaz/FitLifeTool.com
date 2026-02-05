// app/lib/useLang.ts

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ DEZE REGEL TOEVOEGEN
import { useUser } from "@/lib/AuthProvider";

export type Lang = "en" | "nl" | "fr" | "de" | "pl";

type ProfileLangRow = {
  language: Lang;
};

export function useLang(): Lang {
  const { user } = useUser();
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (!user) return;
  
    let mounted = true;
  
    supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .single()
      .then(({ data }: { data: ProfileLangRow | null }) => {
        if (!mounted) return;
        if (data?.language) {
          setLang(data.language);
        }
      });
  
    // 🔥 NIEUW — luister naar live taalwissel
    function handleLangChange(e: any) {
      setLang(e.detail);
    }
  
    window.addEventListener("language-changed", handleLangChange);
  
    return () => {
      mounted = false;
      window.removeEventListener("language-changed", handleLangChange);
    };
  }, [user]);  

  return lang;
}

export async function setUserLanguage(newLang: Lang) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ language: newLang })
    .eq("id", user.id);

  // 🔥 ZEG TEGEN DE HELE APP DAT TAAL VERANDERD IS
  window.dispatchEvent(new CustomEvent("language-changed", { detail: newLang }));
}
