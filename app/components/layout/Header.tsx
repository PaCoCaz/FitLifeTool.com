"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import AvatarMenu from "@/components/layout/AvatarMenu";

export default function Header() {
  const { user, loading } = useUser();
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

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

  return (
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
        <div className="relative h-10 sm:h-11 md:h-12 shrink-0">
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

        {/* User menu */}
        {!loading && user && firstName && (
          <div className="max-w-[55%]">
            <AvatarMenu firstName={firstName} />
          </div>
        )}
      </div>
    </header>
  );
}
