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
      <DialogPrimitive.Overlay className="bg-navy-950/60 data-[state=open]:animate-in data-[state=open]:fade-in fixed inset-0 z-50" />
      <DialogPrimitive.Content
        className={cn(
          "border-navy-700/15 bg-parchment-50 dark:border-parchment-100/10 dark:bg-navy-900 fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="text-ink-soft hover:bg-navy-700/10 dark:text-parchment-100/60 dark:hover:bg-parchment-100/10 absolute top-4 right-4 rounded-full p-1">
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
