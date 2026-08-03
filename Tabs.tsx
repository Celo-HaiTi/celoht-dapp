"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "border-navy-700/15 dark:border-parchment-100/10 inline-flex gap-1 rounded-full border p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "text-ink-soft data-[state=active]:bg-navy-950 data-[state=active]:text-parchment-50 dark:text-parchment-100/70 dark:data-[state=active]:bg-gold-500 dark:data-[state=active]:text-navy-950 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
