import { useMemo } from 'react';
import type { ProductForm, MarketReference } from '@/types/ProductEdit';

interface MarketPricingCardProps {
  form:            ProductForm;
  marketRef:       MarketReference;
  onPriceChange:   (field: 'askingPrice' | 'minPrice', value: number) => void;
}

export default function MarketPricingCard({
  form,
  marketRef,
  onPriceChange,
}: MarketPricingCardProps) {
  // ── Derived values ────────────────────────────────────────────────────────
  const deltaPercent = useMemo(() => {
    if (marketRef.pricePerTon === 0) return 0;
    return ((form.askingPrice - marketRef.pricePerTon) / marketRef.pricePerTon) * 100;
  }, [form.askingPrice, marketRef.pricePerTon]);

  const estimatedProfit = useMemo(
    () => form.askingPrice * form.quantityTons,
    [form.askingPrice, form.quantityTons],
  );

  const profitBarPercent = useMemo(() => {
    // Normalise against a ~$65,000 ceiling for the visual bar
    return Math.min((estimatedProfit / 65_000) * 100, 100);
  }, [estimatedProfit]);

  const aboveIndex = deltaPercent >= 0;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 border-t-4 border-t-primary">
      <h3 className="font-bold text-lg mb-6">Market Pricing</h3>

      {/* Index reference */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Index Reference</span>
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {marketRef.indexBadge}
          </span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
          ${marketRef.pricePerTon.toFixed(2)}
          <span className="text-sm font-medium text-slate-400 ml-1">/ ton</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">{marketRef.indexLabel}</p>
      </div>

      {/* Price inputs */}
      <div className="space-y-4">
        {/* Asking price */}
        <div className="space-y-2">
          <label
            htmlFor="asking-price"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block"
          >
            Asking Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">
              $
            </span>
            <input
              id="asking-price"
              type="number"
              min={0}
              step={0.01}
              value={form.askingPrice}
              onChange={(e) => onPriceChange('askingPrice', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-bold text-lg outline-none transition-all"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span
              className={`text-[10px] font-bold uppercase ${
                aboveIndex ? 'text-primary' : 'text-red-500'
              }`}
            >
              {aboveIndex ? '+' : ''}
              {deltaPercent.toFixed(2)}% {aboveIndex ? 'above' : 'below'} index
            </span>
            <span
              className={`material-symbols-outlined text-sm ${
                aboveIndex ? 'text-primary' : 'text-red-500'
              }`}
            >
              {aboveIndex ? 'trending_up' : 'trending_down'}
            </span>
          </div>
        </div>

        {/* Min acceptable price */}
        <div className="space-y-2">
          <label
            htmlFor="min-price"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block"
          >
            Min. Acceptable Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">
              $
            </span>
            <input
              id="min-price"
              type="number"
              min={0}
              step={0.01}
              value={form.minPrice}
              onChange={(e) => onPriceChange('minPrice', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Estimated net profit */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Estimated Net Profit</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            $
            {estimatedProfit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-light dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${profitBarPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 italic">
          Calculated based on {form.quantityTons} tons @ ${form.askingPrice.toFixed(2)}
        </p>
      </div>
    </section>
  );
}