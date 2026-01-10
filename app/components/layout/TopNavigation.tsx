"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Voeding", href: "/dashboard#nutrition" },
  { label: "Activiteit", href: "/dashboard#activity" },
  { label: "Gewicht", href: "/dashboard/weight" },
  { label: "Instellingen", href: "/settings" },
];

export default function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
    <nav className="sticky top-16 z-40 bg-[#B8CAE0]">
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
            {NAV_ITEMS.map((item) => {
              const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);            

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
                    <span className="absolute left-0 bottom-1 h-[3px] w-full rounded-full bg-[#C80000]" />
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
