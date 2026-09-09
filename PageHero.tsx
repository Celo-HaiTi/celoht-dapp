type Props = { eyebrow: string; title: string; lead: string };

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <header className="page-hero mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
      <p className="section-kicker">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-parchment-100/62 sm:text-base">{lead}</p>
    </header>
  );
}
