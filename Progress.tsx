"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className={cn(
        "bg-navy-700/10 dark:bg-parchment-100/10 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
    >
      <ProgressPrimitive.Indicator
        className="bg-gold-500 h-full transition-transform duration-300"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
