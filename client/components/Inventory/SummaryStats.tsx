interface Stat {
  icon:  string;
  label: string;
  value: string;
  sub?:  string;
}

interface Props {
  stats: Stat[];
}

export default function SummaryStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary-dark shrink-0">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {stat.icon}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {stat.value}
            </p>
            {stat.sub && (
              <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}