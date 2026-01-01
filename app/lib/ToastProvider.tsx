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

type Toast = {
  id: number;
  message: string;
};

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(
  null
);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  // Zorgt ervoor dat portal pas rendert op client
  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {mounted &&
        createPortal(
          <div
            className="
              fixed
              inset-0
              pointer-events-none
              z-[9999]
              flex
              items-start
              justify-center
              pt-32
            "
          >
            <div className="space-y-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className="
                    pointer-events-auto
                    rounded-lg
                    bg-[#191970]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    shadow-lg
                    animate-fade-in
                  "
                >
                  {toast.message}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used within ToastProvider"
    );
  }
  return ctx;
}
