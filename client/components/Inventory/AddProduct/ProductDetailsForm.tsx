import type { ProductListingForm, ProductCategory, StorageCondition, UploadedImage } from "@/types/AddProduct";
import { PRODUCT_CATEGORIES, STORAGE_CONDITIONS, OFFICIAL_PRICE_PER_KG } from "@/types/AddProduct";
import ImageUploadZone from "./ImageUploadZone";
import PriceWarningBanner from "./PriceWarningBanner";

interface Props {
  form: ProductListingForm;
  onChange: <K extends keyof ProductListingForm>(key: K, value: ProductListingForm[K]) => void;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm";

const labelClass = "text-sm font-bold";

export default function ProductDetailsForm({ form, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">List Your New Harvest</h3>
        <p className="text-slate-500 text-sm">
          Fill in the details below to accurately represent your product in the marketplace.
        </p>
      </div>

      {/* Category & Variety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className={labelClass}>Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value as ProductCategory)}
            className={inputClass}
          >
            {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="variety" className={labelClass}>Variety / Grade</label>
          <input
            id="variety"
            type="text"
            value={form.variety}
            onChange={(e) => onChange("variety", e.target.value)}
            placeholder="e.g. Long Grain Basmati, Grade A"
            className={inputClass}
          />
        </div>
      </div>

      {/* Quantity & Price */}
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
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              KG
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="price" className={labelClass}>Price per Unit</label>
            <span className="text-[10px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">info</span>
              Official Price: ${OFFICIAL_PRICE_PER_KG}/kg
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              $
            </span>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              value={form.pricePerUnit}
              onChange={(e) => onChange("pricePerUnit", e.target.value)}
              placeholder="0.00"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      {/* Harvest Date & Storage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="harvest-date" className={labelClass}>Harvest Date</label>
          <input
            id="harvest-date"
            type="date"
            value={form.harvestDate}
            onChange={(e) => onChange("harvestDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="storage" className={labelClass}>Storage Condition</label>
          <select
            id="storage"
            value={form.storageCondition}
            onChange={(e) => onChange("storageCondition", e.target.value as StorageCondition)}
            className={inputClass}
          >
            {STORAGE_CONDITIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Image upload */}
      <ImageUploadZone
        images={form.images}
        onAdd={(img) => onChange("images", [...form.images, img])}
        onRemove={(id) => onChange("images", form.images.filter((i) => i.id !== id))}
      />

      {/* Price validation hint */}
      <PriceWarningBanner priceValue={form.pricePerUnit} />
    </div>
  );
}