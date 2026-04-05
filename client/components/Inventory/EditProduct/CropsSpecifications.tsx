import type { ProductForm } from '@/types/ProductEdit';
import { MOISTURE_OPTIMAL_RANGE } from '@/types/ProductEdit';

interface CropSpecificationsCardProps {
  form:     ProductForm;
  onChange: (field: keyof ProductForm, value: string | number | boolean) => void;
}

export default function CropSpecificationsCard({ form, onChange }: CropSpecificationsCardProps) {
  const moistureOptimal =
    form.moisturePercent >= MOISTURE_OPTIMAL_RANGE.min &&
    form.moisturePercent <= MOISTURE_OPTIMAL_RANGE.max;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      {/* ── Header row: title + in_stock toggle ── */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Crop Specifications</h3>

        {/* Availability toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={form.in_stock}
          onClick={() => onChange('in_stock', !form.in_stock)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all ${
            form.in_stock
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              form.in_stock ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          {form.in_stock ? 'In Stock' : 'Out of Stock'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Name */}
        <div className="space-y-2">
          <label
            htmlFor="product-name"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block"
          >
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label
            htmlFor="quantity"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block"
          >
            Quantity (Metric Tons)
          </label>
          <div className="relative">
            <input
              id="quantity"
              type="number"
              min={0}
              step={0.1}
              value={form.quantityTons}
              onChange={(e) => onChange('quantityTons', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 pr-16 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
              TONS
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 pt-6 border-t border-primary/10">
        <label
          htmlFor="crop-desc"
          className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 mb-2 block"
        >
          Crop Description
        </label>
        <textarea
          id="crop-desc"
          rows={4}
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all resize-none"
        />
      </div>
    </section>
  );
}