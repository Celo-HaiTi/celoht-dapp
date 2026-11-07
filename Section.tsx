import type { ReactNode } from "react";

type Props = { title?: string; eyebrow?: string; children: ReactNode; className?: string };

export function Section({ title, eyebrow, children, className = "" }: Props) {
  return (
    <section className={`page-section mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9 ${className}`}>
      {eyebrow && (
        <p className="section-kicker">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="page-section-title mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>}
      <div className={title || eyebrow ? "page-section-content mt-5 sm:mt-6" : "page-section-content"}>{children}</div>
    </section>
  );
}
