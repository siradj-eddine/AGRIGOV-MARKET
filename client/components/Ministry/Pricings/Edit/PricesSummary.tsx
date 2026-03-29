import type { MarketHealthBar } from '@/types/EditOfficalPrice';

interface PriceSummaryCardProps {
  currentPrice:   number;
  priceUnit:      string;
  quarterDeltaPct: number;
  healthBars:     MarketHealthBar[];
}

export default function PriceSummaryCard({
  currentPrice,
  priceUnit,
  quarterDeltaPct,
  healthBars,
}: PriceSummaryCardProps) {
  const isUp = quarterDeltaPct >= 0;

  return (
    <>
      {/* Current price */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/10 border-l-4 border-l-primary">
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">
          Current Official Price
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-primary">
            ${currentPrice.toFixed(2)}
          </span>
          <span className="text-xl font-bold text-slate-400">/ {priceUnit}</span>
        </div>
        <div className={`mt-6 flex items-center gap-2 font-bold text-sm ${isUp ? 'text-primary' : 'text-red-500'}`}>
          <span className="material-symbols-outlined">{isUp ? 'trending_up' : 'trending_down'}</span>
          <span>
            {isUp ? '+' : ''}{quarterDeltaPct}% from last quarter
          </span>
        </div>
      </div>

      {/* Market health */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl space-y-4 border border-primary/10 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Market Health</h3>
        <div className="space-y-3">
          {healthBars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1">
                <span>{bar.label}</span>
                <span>{bar.percent}%</span>
              </div>
              <div className="h-2 bg-neutral-light dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}