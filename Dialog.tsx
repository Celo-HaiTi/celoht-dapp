"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#01050c]/72 backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--celoht-radius-lg)] border border-gold-300/18 bg-[radial-gradient(circle_at_top,rgba(248,220,143,0.08),transparent_22rem),linear-gradient(180deg,#101d31,#0a1424)] p-6 text-parchment shadow-[0_2.25rem_6.5rem_rgba(1,5,12,0.48)] backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-parchment-100/60 transition duration-200 hover:border-gold-300/35 hover:bg-gold-500/10 hover:text-white hover:scale-[1.03]">
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
