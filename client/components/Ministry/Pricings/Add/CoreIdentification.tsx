import type { OfficialPriceForm } from "@/types/AddOfficialPrice";
import { UNIT_OPTIONS } from "@/types/Prices";
import type { MinistryProduct } from "@/types/MinistryProduct";

interface Props {
  form:              OfficialPriceForm;
  onChange:          (field: keyof OfficialPriceForm, value: string) => void;
  errors:            Partial<Record<keyof OfficialPriceForm, string>>;
  products:          MinistryProduct[];
  isLoadingProducts: boolean;
}

const inputCls =
  "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm";
const inputErrorCls =
  "w-full bg-red-50 dark:bg-red-900/20 border-none rounded-lg p-3 text-slate-900 dark:text-slate-100 ring-2 ring-red-400 focus:ring-red-400 outline-none transition-all text-sm";

const Skeleton = () => (
  <div className="h-11 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
);

export default function CoreIdentificationCard({
  form, onChange, errors, products, isLoadingProducts,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 space-y-6 border border-primary/10 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary">edit_note</span>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Price Entry Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ministry product dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="product-select"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Product <span className="text-red-500">*</span>
          </label>

          {isLoadingProducts ? (
            <Skeleton />
          ) : products.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-300">
              <span className="material-symbols-outlined text-sm shrink-0">warning</span>
              No active ministry products found.
            </div>
          ) : (
            <select
              id="product-select"
              value={form.product}
              onChange={(e) => onChange("product", e.target.value)}
              className={errors.product ? inputErrorCls : inputCls}
            >
              <option value="">— Select a product —</option>
              {products.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                  {p.category_name ? ` — ${p.category_name}` : ""}
                </option>
              ))}
            </select>
          )}

          {errors.product && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {errors.product}
            </p>
          )}
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <label
            htmlFor="unit"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            id="unit"
            value={form.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            className={inputCls}
          >
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="bag">bag</option>
            <option value="quintal">quintal</option>
          </select>
        </div>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="min-price" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Min Price (DZD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
              DZD
            </span>
            <input
              id="min-price"
              type="number"
              min={0}
              step={0.01}
              value={form.min_price}
              onChange={(e) => onChange("min_price", e.target.value)}
              placeholder="0.00"
              className={`${errors.min_price ? inputErrorCls : inputCls} pl-12`}
            />
          </div>
          {errors.min_price && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {errors.min_price}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="max-price" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price (DZD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
              DZD
            </span>
            <input
              id="max-price"
              type="number"
              min={0}
              step={0.01}
              value={form.max_price}
              onChange={(e) => onChange("max_price", e.target.value)}
              placeholder="0.00"
              className={`${errors.max_price ? inputErrorCls : inputCls} pl-12`}
            />
          </div>
          {errors.max_price && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {errors.max_price}
            </p>
          )}
          {form.min_price && form.max_price &&
            parseFloat(form.min_price) > parseFloat(form.max_price) && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <span className="material-symbols-outlined text-[13px]">error</span>
                Max must be ≥ min.
              </p>
            )}
        </div>
      </div>

      {/* Wilaya */}
      <div className="space-y-2">
        <label htmlFor="wilaya" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Wilaya <span className="text-xs font-normal normal-case text-slate-400">(leave empty for national)</span>
        </label>
        <input
          id="wilaya"
          type="text"
          value={form.wilaya}
          onChange={(e) => onChange("wilaya", e.target.value)}
          placeholder="e.g. Constantine, Algiers"
          className={inputCls}
        />
        <p className="text-[10px] text-slate-400">
          The backend will derive the region (north / south / east / west / national) from the wilaya.
        </p>
      </div>

      {/* Valid from / until */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="valid-from" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Valid From <span className="text-red-500">*</span>
          </label>
          <input
            id="valid-from"
            type="datetime-local"
            value={form.valid_from}
            onChange={(e) => onChange("valid_from", e.target.value)}
            className={errors.valid_from ? inputErrorCls : inputCls}
          />
          {errors.valid_from && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {errors.valid_from}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="valid-until" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Valid Until <span className="text-xs font-normal normal-case text-slate-400">(leave empty = no expiry)</span>
          </label>
          <input
            id="valid-until"
            type="datetime-local"
            value={form.valid_until}
            onChange={(e) => onChange("valid_until", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}