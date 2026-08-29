// app/components/layout/TopNavigation.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/lib/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { canAccessHandbook } from "@/lib/auth/handbookAccess";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

const getAuthNavItems = (t: typeof uiText.en, showHandbook: boolean) => [
  { label: t.nav.dashboard, href: "/dashboard" },
  { label: t.nav.hydration, href: "/dashboard/hydration" },
  { label: t.nav.nutrition, href: "/dashboard/food/search" },
  { label: t.nav.activity, href: "/dashboard/activity" },
  { label: t.nav.weight, href: "/dashboard/weight" },
  ...(showHandbook ? [{ label: t.nav.handbook, href: "/handbook" }] : []),
];

export default function TopNavigation() {
  const langCode = useLang();
  const t = uiText[langCode];

  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { user } = useUser();
  const isLoggedIn = !!user;
  const userId = user?.id ?? null;
  const [roleState, setRoleState] = useState<{
    userId: string;
    role: string | null;
  } | null>(null);
  const role = userId && roleState?.userId === userId ? roleState.role : null;

  useEffect(() => {
    if (!userId) return;
    const activeUserId = userId;
    let cancelled = false;

    async function loadRole() {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", activeUserId)
        .maybeSingle();

      if (!cancelled) {
        setRoleState({ userId: activeUserId, role: data?.role ?? null });
      }
    }

    void loadRole();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const navItems = isLoggedIn
    ? getAuthNavItems(t, canAccessHandbook(role))
    : [];

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1
      );
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav className="sticky top-16 z-30 bg-[#B8CAE0]">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex items-start">
          {/* Left chevron */}
          {canScrollLeft && (
            <div className="mr-2 pt-[4px] flex items-start">
              <Image
                src="/chevron-left.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-50"
              />
            </div>
          )}

          {/* Scrollbare tabs */}
          <div
            ref={scrollRef}
            className="flex flex-1 gap-6 overflow-x-auto no-scrollbar"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(item.href + "/");            

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="
                    relative
                    pb-2
                    text-base
                    font-medium
                    text-[#191970]
                    whitespace-nowrap
                    cursor-pointer
                  "
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute left-1/2 bottom-1 h-[2px] w-[90%] -translate-x-1/2 rounded-full bg-[#191970]/70" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right chevron */}
          {canScrollRight && (
            <div className="ml-2 pt-[4px] flex items-start">
              <Image
                src="/chevron-right.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
