import Image from 'next/image';
import type { PriceRevisionForm, CropSpec } from '@/types/EditOfficalPrice';

interface PriceRevisionCardProps {
  form:         PriceRevisionForm;
  cropSpec:     CropSpec;
  currentPrice: number;
  onChange:     (field: keyof PriceRevisionForm, value: string | number) => void;
  onPublish:    () => void;
  isPublishing: boolean;
}

export default function PriceRevisionCard({
  form,
  cropSpec,
  currentPrice,
  onChange,
  onPublish,
  isPublishing,
}: PriceRevisionCardProps) {
  const delta =
    form.newPrice !== '' && currentPrice > 0
      ? (((form.newPrice as number) - currentPrice) / currentPrice) * 100
      : null;

  return (
    <div className="md:col-span-12 bg-slate-100 dark:bg-slate-800 p-8 md:p-12 rounded-xl relative overflow-hidden border border-primary/10">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="grid md:grid-cols-2 gap-12 relative z-10">
        {/* Left — description + crop spec */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            Official Price Revision
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
            Adjustments made here are sent to the Executive Review Board. Once approved, the new
            price will propagate to the National Agriculture Portal and regional trade hubs.
          </p>

          <div className="flex items-center gap-6 p-6 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/30 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 shadow-lg">
              <Image
                src={cropSpec.imageUrl}
                alt={cropSpec.imageAlt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-primary">Crop Specification</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                <li>• Grade: {cropSpec.grade}</li>
                <li>• Moisture Content: {cropSpec.moisture}</li>
                <li>• Origin: {cropSpec.origin}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right — form inputs */}
        <div className="space-y-6">
          {/* New target price */}
          <div>
            <label
              htmlFor="new-price"
              className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest"
            >
              New Target Price (USD / Ton)
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary pointer-events-none">
                $
              </span>
              <input
                id="new-price"
                type="number"
                min={0}
                step={0.01}
                value={form.newPrice}
                onChange={(e) =>
                  onChange('newPrice', e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder="000.00"
                className="w-full bg-white dark:bg-slate-900 border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-3xl font-black py-4 pl-12 pr-6 rounded-t-xl outline-none transition-all text-slate-900 dark:text-slate-100"
              />
            </div>
            {delta !== null && (
              <p className={`text-xs font-bold mt-2 ${delta >= 0 ? 'text-primary' : 'text-red-500'}`}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(2)}% vs current official price
              </p>
            )}
          </div>

          {/* Justification */}
          <div>
            <label
              htmlFor="justification"
              className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-widest"
            >
              Justification for Adjustment
            </label>
            <textarea
              id="justification"
              rows={4}
              value={form.justification}
              onChange={(e) => onChange('justification', e.target.value)}
              placeholder="Enter formal reasoning (e.g., fuel subsidy cuts, seasonal yield forecasts, global commodity index shifts)..."
              className="w-full bg-white dark:bg-slate-900 border-0 border-b-2 border-primary/20 focus:border-primary focus:ring-0 text-sm py-4 px-6 rounded-t-xl outline-none transition-all resize-none text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              onClick={onPublish}
              disabled={isPublishing || form.newPrice === '' || !form.justification.trim()}
              className="w-full h-16 bg-primary text-slate-900 font-extrabold text-lg rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPublishing ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">publish</span>
              )}
              Publish to National Portal
            </button>
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-4">
              Authentication Required • Encrypted Submission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}