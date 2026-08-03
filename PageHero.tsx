type Props = { eyebrow: string; title: string; lead: string };

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 pb-8 sm:px-6">
      <p className="text-gold-800 dark:text-gold-300 font-mono text-xs tracking-[0.2em] uppercase">
        {eyebrow}
      </p>
      <h1 className="font-display mt-3 text-4xl leading-tight font-semibold sm:text-5xl">
        {title}
      </h1>
      <p className="text-ink-soft dark:text-parchment-100/75 mt-4 max-w-2xl text-lg">{lead}</p>
    </div>
  );
}
