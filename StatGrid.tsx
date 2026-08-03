export function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-navy-700/10 dark:border-parchment-100/10 rounded-xl border p-5"
        >
          <dt className="text-ink-soft dark:text-parchment-100/50 text-xs tracking-wide uppercase">
            {stat.label}
          </dt>
          <dd className="text-navy-800 dark:text-gold-300 mt-1 font-mono text-2xl font-semibold">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
