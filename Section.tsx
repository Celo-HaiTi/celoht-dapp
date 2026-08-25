import type { ReactNode } from "react";

type Props = { title?: string; eyebrow?: string; children: ReactNode; className?: string };

export function Section({ title, eyebrow, children, className = "" }: Props) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-parchment-100/45">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h2>}
      <div className={title || eyebrow ? "mt-6" : ""}>{children}</div>
    </section>
  );
}
