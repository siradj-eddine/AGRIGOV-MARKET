import type { ProductListingForm, Season } from "@/types/AddProduct";
import { SEASONS, OFFICIAL_PRICE_PER_KG } from "@/types/AddProduct";
import ImageUploadZone from "./ImageUploadZone";
import PriceWarningBanner from "./PriceWarningBanner";

interface ApiCategory { id: number; name: string; }
interface ApiFarm     { id: number; name: string; wilaya: string; }

interface Props {
  form:          ProductListingForm;
  onChange:      <K extends keyof ProductListingForm>(key: K, value: ProductListingForm[K]) => void;
  categories:    ApiCategory[];
  farms:         ApiFarm[];
  isLoadingMeta: boolean;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";
const labelClass = "text-sm font-bold";

// Skeleton shimmer used while remote data loads
const Skeleton = () => (
  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
);

export default function ProductDetailsForm({
  form, onChange, categories, farms, isLoadingMeta,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">List Your New Harvest</h3>
        <p className="text-slate-500 text-sm">
          Fill in the details below to accurately represent your product in the marketplace.
        </p>
      </div>

      {/* ── Title & Category ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className={labelClass}>
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Premium Yellow Maize – Grade A"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className={labelClass}>Category</label>
          {isLoadingMeta ? <Skeleton /> : (
            <select
              id="category"
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Farm ── */}
      <div className="space-y-2">
        <label htmlFor="farm" className={labelClass}>
          Farm <span className="text-red-500">*</span>
        </label>
        {isLoadingMeta ? <Skeleton /> : farms.length === 0 ? (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            No farms found. Please create a farm first.
          </p>
        ) : (
          <select
            id="farm"
            value={form.farm_id}
            onChange={(e) => onChange("farm_id", e.target.value)}
            className={inputClass}
          >
            {farms.map((f) => (
              <option key={f.id} value={String(f.id)}>
                {f.name} — {f.wilaya}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Quantity & Price ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
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
              className={`${inputClass} pr-12`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">KG</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="price" className={labelClass}>Price per Unit (DZD)</label>
            <span className="text-[10px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">info</span>
              Ref: {OFFICIAL_PRICE_PER_KG.toLocaleString("fr-DZ")} DZD/kg
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">DZD</span>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              value={form.pricePerUnit}
              onChange={(e) => onChange("pricePerUnit", e.target.value)}
              placeholder="0.00"
              className={`${inputClass} pl-14`}
            />
          </div>
        </div>
      </div>

      {/* ── Season ── */}
      <div className="space-y-2">
        <label className={labelClass}>Season</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEASONS.map((s) => {
            const icons: Record<Season, string> = {
              winter: "ac_unit", summer: "wb_sunny", fall: "park", spring: "local_florist",
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
      </div>

      {/* ── Description ── */}
      <div className="space-y-2">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your product: growing conditions, certifications, intended use…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* ── Images ── */}
      <ImageUploadZone
        images={form.images}
        onAdd={(img)  => onChange("images", [...form.images, img])}
        onRemove={(id) => onChange("images", form.images.filter((i) => i.id !== id))}
      />

      <PriceWarningBanner priceValue={form.pricePerUnit} />
    </div>
  );
}