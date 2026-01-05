// app/lib/ToastProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ───────────────── Types ───────────────── */

type ToastType = "info";

type Toast = {
  id: number;
  message: string;
  type?: ToastType;
};

type ToastContextType = {
  showToast: (
    message: string,
    durationMs?: number,
    type?: ToastType
  ) => void;
};

/* ───────────────── Context ───────────────── */

const ToastContext = createContext<ToastContextType | null>(
  null
);

/* ───────────────── Provider ───────────────── */

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback(
    (
      message: string,
      durationMs = 3000,
      type?: ToastType
    ) => {
      const id = Date.now();

      setToasts((prev) => [
        ...prev,
        { id, message, type },
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter((t) => t.id !== id)
        );
      }, durationMs);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {mounted &&
        createPortal(
          <div
            className="
              fixed inset-0 z-[9999]
              pointer-events-none
              flex items-start justify-center
              pt-32
            "
          >
            <div className="space-y-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className="
                    pointer-events-auto
                    flex items-start gap-2
                    rounded-lg
                    bg-[#191970]
                    px-4 py-2
                    text-sm font-medium text-white
                    shadow-lg
                    animate-fade-in
                  "
                >
                  {toast.type === "info" && (
                    <Image
                      src="/info_white.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="mt-[2px] opacity-90"
                    />
                  )}

                  <span>{toast.message}</span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

/* ───────────────── Hook ───────────────── */

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used within ToastProvider"
    );
  }
  return ctx;
}
