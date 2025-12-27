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
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4">

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

        {/* User block */}
        {!loading && user && (
          <div
            className="
              ml-auto
              flex
              items-center
              gap-2
              min-w-0
              rounded-[var(--radius)]
              bg-[#191970]
              text-white

              h-10 px-3
              sm:h-11 sm:px-3
              md:h-12 md:px-4
            "
          >
            {/* Avatar */}
            <span
              className="
                relative
                shrink-0
                overflow-hidden
                rounded-full

                h-6 w-6
                sm:h-7 sm:w-7
                md:h-8 md:w-8
              "
            >
              <Image
                src="/user.svg"
                alt=""
                fill
                className="object-contain"
              />
            </span>

            {/* Name */}
            <span
              className="
                min-w-0
                truncate
                text-sm
                md:text-base
                font-medium
                leading-none
              "
            >
              {firstName ?? "Gebruiker"}
            </span>
          </div>
        )}

      </div>
    </header>
  );
}
