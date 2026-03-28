import type { SummaryStat } from '@/types/Inventory';

interface SummaryStatsProps {
  stats: SummaryStat[];
}

export default function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4"
        >
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}