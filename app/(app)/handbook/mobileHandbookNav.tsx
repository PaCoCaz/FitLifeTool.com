// app/(app)/handbook/mobileHandbookNav.tsx

"use client";

import { useState } from "react";
import HandbookNavigation from "./navigation";

const BREADCRUMB_HEIGHT = 44;

export default function MobileHandbookNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== FIXED FOOTER BAR ===== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#191970] text-white flex items-center"
        style={{ height: BREADCRUMB_HEIGHT }}
      >
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between px-4"
        >
          <span className="font-semibold">Menu handboek</span>
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* ===== FULLSCREEN OVERLAY MENU ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 bg-[#191970] text-white"
            style={{ height: BREADCRUMB_HEIGHT }}
          >
            <span className="font-semibold">Menu handboek</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xl"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>

          {/* Scrollable menu */}
          <div
            className="flex-1 overflow-y-auto px-4 py-6"
            onClick={() => setOpen(false)}
          >
            <HandbookNavigation />
          </div>
        </div>
      )}
    </>
  );
}
