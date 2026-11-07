type Props = { eyebrow: string; title: string; lead: string };

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <header className="page-hero mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pb-9 sm:pt-10 lg:px-8 lg:pb-10 lg:pt-12">
      <div className="page-hero-copy">
        <p className="section-kicker">{eyebrow}</p>
        <h1 className="page-hero-title mt-3 max-w-4xl font-display text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        <p className="page-hero-lead mt-4 max-w-2xl text-sm leading-7 text-parchment-100/62 sm:text-base">{lead}</p>
      </div>
    </header>
  );
}
