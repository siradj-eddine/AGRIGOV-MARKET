import { useMemo } from 'react';
import type { ProductForm, MarketReference, ApiFieldErrors } from '@/types/ProductEdit';

interface Props {
  form:          ProductForm;
  onPriceChange: (field: 'askingPrice', value: number) => void;
  fieldErrors:   ApiFieldErrors;
}

function FieldError({ errors, field }: { errors: ApiFieldErrors; field: string }) {
  const msgs = errors[field];
  if (!msgs?.length) return null;
  return (
    <ul className="mt-1.5 space-y-0.5">
      {msgs.map((msg, i) => (
        <li key={i} className="flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0">error</span>
          {msg}
        </li>
      ))}
    </ul>
  );
}

export default function MarketPricingCard({ form, onPriceChange, fieldErrors }: Props) {

  const estimatedRevenue = useMemo(
    () => form.askingPrice * form.quantityKg,
    [form.askingPrice, form.quantityKg],
  );

  const revenueBarPct = useMemo(
    () => Math.min((estimatedRevenue / 100_000) * 100, 100),
    [estimatedRevenue],
  );


  const hasUnitPriceError = !!fieldErrors.unit_price?.length;

  return (
    <section className={`bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-t-4 ${
      hasUnitPriceError ? 'border-red-300 border-t-red-500' : 'border-primary/10 border-t-primary'
    }`}>
      <h3 className="font-bold text-lg mb-6">Market Pricing</h3>


      {/* Asking price input */}
      <div className="space-y-1.5 mb-6">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block">
          Asking Price (DZD / kg)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-sm">
            DZD
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.askingPrice}
            onChange={(e) => onPriceChange('askingPrice', parseFloat(e.target.value) || 0)}
            className={`w-full rounded-xl pl-14 pr-4 py-3 focus:ring-2 text-slate-900 dark:text-slate-100 font-bold text-lg outline-none transition-all ${
              hasUnitPriceError
                ? 'bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400 focus:ring-red-400'
                : 'bg-slate-100 dark:bg-slate-800 focus:ring-primary/50'
            }`}
          />
        </div>
        <FieldError errors={fieldErrors} field="unit_price" />
      </div>

      {/* Estimated revenue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Estimated Revenue</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            {estimatedRevenue.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DZD
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-light dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${revenueBarPct}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 italic">
          {form.quantityKg} kg @ {form.askingPrice.toFixed(2)} DZD/kg
        </p>
      </div>
    </section>
  );
}