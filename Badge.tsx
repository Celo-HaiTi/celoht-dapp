import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide",
  {
    variants: {
      tone: {
        neutral: "bg-navy-700/10 text-ink-soft dark:bg-parchment-100/10 dark:text-parchment-100/70",
        gold: "bg-gold-500/15 text-gold-800 dark:text-gold-300",
        forest: "bg-forest-500/15 text-forest-600 dark:text-forest-400",
        warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        danger: "bg-red-500/15 text-red-700 dark:text-red-400",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
