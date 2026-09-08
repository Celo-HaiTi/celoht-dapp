type Props = { eyebrow: string; title: string; lead: string };

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <header className="page-hero mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-6 lg:px-8">
      <p className="section-kicker">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-parchment-100/65 sm:text-base">{lead}</p>
    </header>
  );
}
