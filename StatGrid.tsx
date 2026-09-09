export function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="surface-panel rounded-[var(--celoht-radius-md)] border p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-gold-300/30"
        >
          <dt className="text-xs uppercase tracking-[0.16em] text-parchment-100/48">
            {stat.label}
          </dt>
          <dd className="mt-2 font-mono text-2xl font-semibold tabular-nums text-gold-300">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
