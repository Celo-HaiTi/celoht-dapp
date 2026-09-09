"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--celoht-radius-sm)] text-sm font-semibold tracking-[0.01em] transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-500 text-navy-950 shadow-[0_0.55rem_1.5rem_rgba(245,200,66,0.14)] hover:-translate-y-0.5 hover:bg-gold-300 hover:shadow-[0_0.8rem_2rem_rgba(245,200,66,0.2)] active:translate-y-0",
        secondary:
          "border border-white/15 bg-white/[0.025] text-parchment-100 hover:-translate-y-0.5 hover:border-gold-500/60 hover:bg-white/10 active:translate-y-0",
        ghost:
          "text-parchment-100/70 hover:text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";
