type Props = { eyebrow: string; title: string; lead: string };

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-5 pt-8 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-parchment-100/65">{lead}</p>
    </div>
  );
}
