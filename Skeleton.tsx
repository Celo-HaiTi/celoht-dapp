import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/** A loading placeholder. Respects prefers-reduced-motion via globals.css. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("celoht-skeleton rounded-[var(--celoht-radius-sm)]", className)}
      {...props}
    />
  );
}
