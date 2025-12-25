"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";

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
          justify-between
          gap-3
          px-4
        "
      >
        {/* Logo */}
        <div className="relative h-12 max-w-[55%] min-w-0 shrink">
          <Image
            src="/logo_fitlifetool.png"
            alt="FitLifeTool"
            width={1500}
            height={300}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        {/* User */}
        {!loading && user && (
          <div
            className="
              flex
              h-10
              max-w-[45%]
              min-w-0
              shrink
              items-center
              gap-2
              rounded-[var(--radius)]
              bg-[#191970]
              px-3
              text-white
            "
          >
            {/* Avatar */}
            <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/user.svg"
                alt=""
                fill
                className="object-contain"
              />
            </span>

            {/* Naam */}
            <span className="min-w-0 truncate text-sm font-medium">
              {firstName ?? "Gebruiker"}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
