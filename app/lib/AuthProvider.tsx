// app/lib/AuthProvider.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/auth-js";
import { supabase } from "./supabaseClient";

/* ───────────────── Types ───────────────── */

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

/* ───────────────── Context ───────────────── */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/* ───────────────── Provider ───────────────── */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      // ✅ sneller dan getUser bij refresh
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* ✅ blokkeer render tot auth bekend is → voorkomt flicker */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/* ───────────────── Hook ───────────────── */

export function useUser() {
  return useContext(AuthContext);
}