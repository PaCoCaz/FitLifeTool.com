// app/components/layout/Header.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";

import AvatarMenu from "@/components/layout/AvatarMenu";
import LoginMenu from "@/components/layout/LoginMenu";
import RegisterModal from "@/components/auth/RegisterModal";

export default function Header() {
  const { user, loading } = useUser();

  /* ❗ Hooks ALTIJD bovenin, onvoorwaardelijk */
  const [firstName, setFirstName] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (!user) {
      setFirstName(null);
      return;
    }

    const loadProfile = async () => {
      const {
        data,
        error,
      }: {
        data: { first_name: string | null } | null;
        error: { message: string } | null;
      } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFirstName(data.first_name);
      }
    };

    loadProfile();
  }, [user]);

  /* ✅ TOEGEVOEGD: luister naar globale register-trigger */
  useEffect(() => {
    function openRegisterModal() {
      setShowRegister(true);
    }

    window.addEventListener("open-register", openRegisterModal);
    return () =>
      window.removeEventListener("open-register", openRegisterModal);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-[#B8CAE0]">
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-[1200px]
            items-center
            gap-3
            px-4
          "
        >
          {/* Logo */}
          <div className="relative h-10 sm:h-11 md:h-12 max-w-[55%]">
            <Image
              src="/logo_fitlifetool.png"
              alt="FitLifeTool"
              width={1500}
              height={300}
              className="h-full w-auto object-contain"
              priority
            />
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-0" />

          {/* Tijdens laden: niets renderen */}
          {!loading && user && firstName && (
            <div className="max-w-[55%]">
              <AvatarMenu firstName={firstName} />
            </div>
          )}

          {!loading && !user && (
            <LoginMenu onRegister={() => setShowRegister(true)} />
          )}
        </div>
      </header>

      {/* Register modal */}
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
