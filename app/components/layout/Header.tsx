"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../lib/AuthProvider";
import AvatarMenu from "./AvatarMenu";

export default function Header() {
  const { user, loading } = useUser();
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (data?.first_name) {
        setFirstName(data.first_name);
      }
    };

    loadProfile();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#B8CAE0]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4">

        {/* Logo */}
        <div className="relative h-12 shrink-0">
          <Image
            src="/logo_fitlifetool.png"
            alt="FitLifeTool"
            width={1500}
            height={300}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        {/* User menu */}
        {!loading && user && (
          <div className="ml-auto max-w-[55%]">
            <AvatarMenu firstName={firstName || "Gebruiker"} />
          </div>
        )}

      </div>
    </header>
  );
}
