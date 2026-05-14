// app/(app)/dashboard/breadcrumb.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildBreadcrumbs } from "./dashboardRegistry";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLangContext } from "@/lib/LangProvider";

/* ✅ cache buiten component (BELANGRIJK) */
const productNameCache = new Map<string, string>();

export default function DashboardBreadcrumb() {
  const pathname = usePathname();

  const langCode = useLang();
  const t = uiText[langCode];

  const { lang } = useLangContext();

  const crumbs = buildBreadcrumbs(pathname, t);

  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null);

  /* 🔥 detect productKey */
  const productKey =
    pathname.includes("/add/")
      ? pathname.split("/add/")[1]?.split("/")[0] ?? null
      : null;

  /* ✅ reset bij route change */
  useEffect(() => {
    setDynamicLabel(null);
  }, [pathname]);

  /* 🔥 load product naam */
  useEffect(() => {
    if (!productKey || !lang) return;

    const key = productKey;
    const cacheKey = `${key}_${lang}`;

    if (productNameCache.has(cacheKey)) {
      setDynamicLabel(productNameCache.get(cacheKey)!);
      return;
    }

    async function loadProductName() {
      const { data } = await supabase
        .from("nutrition_product_translations")
        .select("name")
        .eq("product_key", key)
        .eq("lang", lang)
        .maybeSingle();

      if (data?.name) {
        productNameCache.set(cacheKey, data.name);
        setDynamicLabel(data.name);
      }
    }

    loadProductName();
  }, [productKey, lang]);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm w-full overflow-hidden relative">
      <ol className="flex items-center text-white/80 overflow-hidden whitespace-nowrap w-full">

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li
              key={crumb.path}
              className={`flex items-center ${
                isLast ? "flex-1 min-w-0" : "shrink-0"
              }`}
            >
              {/* separator */}
              {index > 0 && (
                <span className="mx-1 text-white/40 shrink-0 select-none">
                  ›
                </span>
              )}

              {/* 🔥 wrapper die mag krimpen */}
              <div className={isLast ? "flex-1 min-w-0" : "shrink-0"}>
    
                {isLast ? (
                  <span className="text-white font-medium truncate block">
                    {productKey && dynamicLabel
                      ? dynamicLabel
                      : crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                )}

              </div>
            </li>
          );
        })}

      </ol>

      {/* 🔥 FADE OUT RECHTS */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#191970] to-transparent" />
    </nav>
  );
}