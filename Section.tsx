import type { ReactNode } from "react";

type Props = { title?: string; eyebrow?: string; children: ReactNode; className?: string };

export function Section({ title, eyebrow, children, className = "" }: Props) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-10 sm:px-6 ${className}`}>
      {eyebrow && (
        <p className="text-ink-soft dark:text-parchment-100/50 font-mono text-xs tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>}
      <div className={title || eyebrow ? "mt-6" : ""}>{children}</div>
    </section>
  );
}
