import type { ReactNode } from "react";

type Props = { title?: string; eyebrow?: string; children: ReactNode; className?: string };

export function Section({ title, eyebrow, children, className = "" }: Props) {
  return (
    <section className={`page-section mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 ${className}`}>
      {eyebrow && (
        <p className="section-kicker">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.01em] text-white sm:text-3xl">{title}</h2>}
      <div className={title || eyebrow ? "mt-6" : ""}>{children}</div>
    </section>
  );
}
