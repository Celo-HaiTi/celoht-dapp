"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
};
type ToastContextValue = { push: (toast: Omit<Toast, "id">) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            duration={5000}
            onOpenChange={(open) => !open && remove(toast.id)}
            className={cn(
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 rounded-[var(--celoht-radius-md)] border p-4 text-parchment shadow-[0_1.25rem_3rem_rgba(1,5,12,0.3)] backdrop-blur-xl",
              toast.tone === "success" && "border-emerald-300/25 bg-emerald-950/75",
              toast.tone === "error" && "border-red-300/25 bg-red-950/75",
              (!toast.tone || toast.tone === "default") &&
                "border-white/12 bg-[#101d31]/95",
            )}
          >
            <ToastPrimitive.Title className="text-sm font-semibold">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className="text-ink-soft dark:text-parchment-100/70 mt-1 text-xs">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[100] flex w-80 flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
