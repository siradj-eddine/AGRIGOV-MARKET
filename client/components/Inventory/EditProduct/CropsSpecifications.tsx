import type { ProductForm, MinistryProductOption, ApiFieldErrors } from '@/types/ProductEdit';

const SEASONS = ["winter", "summer", "fall", "spring"] as const;
const SEASON_ICONS: Record<string, string> = {
  winter: "ac_unit",
  summer: "wb_sunny",
  fall:   "park",
  spring: "local_florist",
};

interface Props {
  form:                ProductForm;
  onChange:            (field: keyof ProductForm, value: string | number | boolean) => void;
  ministryProducts:    MinistryProductOption[];
  isLoadingProducts:   boolean;
  fieldErrors:         ApiFieldErrors;
}

const inputBase =
  "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 outline-none transition-all font-medium text-slate-900 dark:text-slate-100";
const inputNormal  = `${inputBase} focus:ring-primary/50`;
const inputError   = `${inputBase} ring-2 ring-red-400 focus:ring-red-400 bg-red-50 dark:bg-red-900/20`;

// Inline field-error helper
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

const Skeleton = () => (
  <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
);

export default function CropSpecificationsCard({
  form, onChange, ministryProducts, isLoadingProducts, fieldErrors,
}: Props) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      {/* Header + in_stock toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Crop Specifications</h3>
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
          <span className={`w-2 h-2 rounded-full transition-colors ${form.in_stock ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {form.in_stock ? 'In Stock' : 'Out of Stock'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ministry Product dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block">
            Product <span className="text-red-500">*</span>
          </label>
          {isLoadingProducts ? (
            <Skeleton />
          ) : (
            <select
              value={form.ministry_product_id}
              onChange={(e) => onChange('ministry_product_id', e.target.value ? Number(e.target.value) : "")}
              className={fieldErrors.ministry_product_id ? inputError : inputNormal}
            >
              <option value="">— Select a product —</option>
              {ministryProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          <FieldError errors={fieldErrors} field="ministry_product_id" />
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block">
            Quantity (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              step={0.1}
              value={form.quantityKg}
              onChange={(e) => onChange('quantityKg', parseFloat(e.target.value) || 0)}
              className={`${fieldErrors.stock ? inputError : inputNormal} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
              KG
            </span>
          </div>
          <FieldError errors={fieldErrors} field="stock" />
        </div>
      </div>

      {/* Season */}
      <div className="mt-8 space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block">
          Season
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEASONS.map((s) => {
            const selected = form.season === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange('season', s)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{SEASON_ICONS[s]}</span>
                {s}
              </button>
            );
          })}
        </div>
        <FieldError errors={fieldErrors} field="season" />
      </div>

      {/* Description */}
      <div className="mt-8 pt-6 border-t border-primary/10 space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 block">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`${fieldErrors.description ? inputError : inputNormal} resize-none`}
          placeholder="Growing conditions, certifications, intended use…"
        />
        <FieldError errors={fieldErrors} field="description" />
      </div>
    </section>
  );
}