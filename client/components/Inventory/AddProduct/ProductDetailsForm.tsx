import type { ProductListingForm, Season, MinistryProductOption, ApiFieldErrors } from "@/types/AddProduct";
import { SEASONS, OFFICIAL_PRICE_PER_KG, PRICE_TOLERANCE_PCT } from "@/types/AddProduct";
import ImageUploadZone from "./ImageUploadZone";

interface ApiFarm { id: number; name: string; wilaya: string; }

interface Props {
  form:             ProductListingForm;
  onChange:         <K extends keyof ProductListingForm>(key: K, value: ProductListingForm[K]) => void;
  ministryProducts: MinistryProductOption[];
  farms:            ApiFarm[];
  isLoadingMeta:    boolean;
  fieldErrors:      ApiFieldErrors;
  priceRange?: {
  min: number;
  max: number;
} | null;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";
const inputErrorClass =
  "w-full px-4 py-2.5 rounded-lg border border-red-400 dark:border-red-500 bg-white dark:bg-background-dark focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all text-sm";
const labelClass = "text-sm font-bold";

const Skeleton = () => (
  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
);

// Inline field error message
function FieldError({ errors, field }: { errors: ApiFieldErrors; field: string }) {
  const msgs = errors[field];
  if (!msgs?.length) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {msgs.map((msg, i) => (
        <li key={i} className="flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0">error</span>
          {msg}
        </li>
      ))}
    </ul>
  );
}

export default function ProductDetailsForm({
  form, onChange, ministryProducts, farms, isLoadingMeta, fieldErrors,priceRange
}: Props) {
  // Price out-of-range warning
  const price = parseFloat(form.pricePerUnit);
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">List Your New Harvest</h3>
        <p className="text-slate-500 text-sm">
          Fill in the details below to accurately represent your product in the marketplace.
        </p>
      </div>

      {/* ── Ministry Product & Farm ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ministry product dropdown */}
        <div className="space-y-1">
          <label htmlFor="ministry_product" className={labelClass}>
            Product <span className="text-red-500">*</span>
          </label>
          {isLoadingMeta ? (
            <Skeleton />
          ) : ministryProducts.length === 0 ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              No products available.
            </p>
          ) : (
            <select
              id="ministry_product"
              value={form.ministry_product_id}
              onChange={(e) => onChange("ministry_product_id", e.target.value)}
              className={fieldErrors.ministry_product_id ? inputErrorClass : inputClass}
            >
              <option value="">— Select a product —</option>
              {ministryProducts.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
          <FieldError errors={fieldErrors} field="ministry_product_id" />
        </div>

        {/* Farm dropdown */}
        <div className="space-y-1">
          <label htmlFor="farm" className={labelClass}>
            Farm <span className="text-red-500">*</span>
          </label>
          {isLoadingMeta ? (
            <Skeleton />
          ) : farms.length === 0 ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              No farms found. Please create a farm first.
            </p>
          ) : (
            <select
              id="farm"
              value={form.farm_id}
              onChange={(e) => onChange("farm_id", e.target.value)}
              className={fieldErrors.farm_id ? inputErrorClass : inputClass}
            >
              {farms.map((f) => (
                <option key={f.id} value={String(f.id)}>
                  {f.name} — {f.wilaya}
                </option>
              ))}
            </select>
          )}
          <FieldError errors={fieldErrors} field="farm_id" />
        </div>
      </div>

      {/* ── Quantity & Price ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="quantity" className={labelClass}>Quantity Available (kg)</label>
          <div className="relative">
            <input
              id="quantity"
              type="number"
              min={0}
              step={0.1}
              value={form.quantityKg}
              onChange={(e) => onChange("quantityKg", e.target.value)}
              placeholder="0.00"
              className={`${fieldErrors.stock ? inputErrorClass : inputClass} pr-12`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              KG
            </span>
          </div>
          <FieldError errors={fieldErrors} field="stock" />
        </div>

<div className="space-y-1">
  <div className="flex justify-between items-center">
    <label htmlFor="price" className={labelClass}>
      Price per Unit <span className="text-red-500">*</span>
    </label>
{priceRange && (
  <span className="text-[10px] font-bold text-primary flex items-center gap-1">
    <span className="material-symbols-outlined text-[12px]">info</span>
    {priceRange.min} – {priceRange.max} DZD/kg
  </span>
)}
  </div>

  <div className="relative">
    {/* Prefix Label */}
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">
      DZD
    </span>

    <input
      id="price"
      type="number"
      value={form.pricePerUnit}
      onChange={(e) => onChange("pricePerUnit", e.target.value)}
      min={priceRange?.min}
      max={priceRange?.max}
      step="0.01"
      placeholder="0.00"
      // Added pl-12 to make room for the DZD prefix
      className={`${
        fieldErrors.unit_price ? inputErrorClass : inputClass
      } pl-12`}
    />
  </div>

  {/* Dynamic Price Range Hint */}
{priceRange && (
  <p className="text-[11px] text-slate-500 flex items-center gap-1 px-1">
    Allowed range: 
    <span className="font-bold">
      {priceRange.min} – {priceRange.max}
    </span> DZD/kg
  </p>
)}

<FieldError errors={fieldErrors} field="unit_price" />
</div>
      </div>

      {/* ── Season ── */}
      <div className="space-y-2">
        <label className={labelClass}>Season</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEASONS.map((s) => {
            const icons: Record<Season, string> = {
              winter: "ac_unit",
              summer: "wb_sunny",
              fall:   "park",
              spring: "local_florist",
            };
            const selected = form.season === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange("season", s)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 dark:border-primary/20 hover:border-primary/40 text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{icons[s]}</span>
                {s}
              </button>
            );
          })}
        </div>
        <FieldError errors={fieldErrors} field="season" />
      </div>

      {/* ── Description ── */}
      <div className="space-y-1">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your product: growing conditions, certifications, intended use…"
          className={`${fieldErrors.description ? inputErrorClass : inputClass} resize-none`}
        />
        <FieldError errors={fieldErrors} field="description" />
      </div>

      {/* ── Images ── */}
      <ImageUploadZone
        images={form.images}
        onAdd={(img)   => onChange("images", [...form.images, img])}
        onRemove={(id) => onChange("images", form.images.filter((i) => i.id !== id))}
      />
      <FieldError errors={fieldErrors} field="images" />

{priceRange && (
  <p className="text-xs text-slate-500 mt-1">
    Allowed price: {priceRange.min} – {priceRange.max} DZD/kg
  </p>
)}
    </div>
  );
}