import type { ChartBar, ChartRange } from '@/types/EditOfficalPrice';

interface PriceTrendChartProps {
  bars:          ChartBar[];
  ranges:        ChartRange[];
  activeRange:   ChartRange;
  onRangeChange: (range: ChartRange) => void;
}

export default function PriceTrendChart({
  bars,
  ranges,
  activeRange,
  onRangeChange,
}: PriceTrendChartProps) {
  return (
    <div className="md:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-xl min-h-100 flex flex-col relative overflow-hidden border border-primary/10 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Price Trend Analysis
          </h3>
          <p className="text-slate-500 text-sm">Historical volatility and official adjustments (12 Months)</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Chart time range">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              aria-pressed={activeRange === r}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeRange === r
                  ? 'bg-primary text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div
        className="flex-1 flex items-end justify-between gap-2 mt-4 relative z-10"
        role="img"
        aria-label="Price trend bar chart"
      >
        {bars.map((bar) => (
          <div key={bar.month} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex items-end justify-center" style={{ height: '256px' }}>
              {bar.isPeak && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-1 px-2 rounded-md font-bold whitespace-nowrap z-10">
                  PEAK
                </div>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  bar.isPeak ? 'bg-primary' : 'bg-primary/70'
                } group-hover:bg-primary`}
                style={{ height: `${bar.percent}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{bar.month}</span>
          </div>
        ))}
      </div>

      {/* Decorative background icon */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
        <span
          className="material-symbols-outlined text-[200px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          agriculture
        </span>
      </div>
    </div>
  );
}