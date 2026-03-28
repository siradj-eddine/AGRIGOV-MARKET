import type { StatCard } from '@/types/UserManagement';
import { STAT_CARDS } from '@/types/UserManagement';

export default function UserStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {STAT_CARDS.map((card) => (
        <StatCardItem key={card.label} card={card} />
      ))}
    </div>
  );
}

function StatCardItem({ card }: { card: StatCard }) {
  if (card.highlight) {
    return (
      <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20">
        <div className="flex justify-between items-start mb-2">
          <p className="text-slate-900 text-sm font-bold">{card.label}</p>
          <span className="bg-slate-900 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
            {card.trend}
          </span>
        </div>
        <p className="text-slate-900 text-3xl font-black tracking-tight">{card.value}</p>
        <p className="mt-2 text-slate-900/70 text-xs font-medium">Requires validation</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</p>
        <span className="text-emerald-500 text-xs font-bold">{card.trend}</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{card.value}</p>
      <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${card.barPercent}%` }}
        />
      </div>
    </div>
  );
}