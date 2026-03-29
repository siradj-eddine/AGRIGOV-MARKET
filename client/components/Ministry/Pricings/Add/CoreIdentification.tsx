import type { CommodityForm, CommodityCategory, MeasurementUnit } from '@/types/AddOfficialPrice';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/types/AddOfficialPrice';

interface CoreIdentificationCardProps {
  form:     CommodityForm;
  onChange: (field: keyof CommodityForm, value: string | number) => void;
}

const inputCls =
  'w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all';

export default function CoreIdentificationCard({ form, onChange }: CoreIdentificationCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 space-y-6 border border-primary/10 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary">edit_note</span>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Core Identification</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="com-name" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Commodity Name
          </label>
          <input
            id="com-name"
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Winter Wheat Grade A"
            className={inputCls}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="com-cat" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Commodity Category
          </label>
          <select
            id="com-cat"
            value={form.category}
            onChange={(e) => onChange('category', e.target.value as CommodityCategory)}
            className={inputCls}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="baseline" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Baseline Price (USD/T)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">$</span>
            <input
              id="baseline"
              type="number"
              min={0}
              step={0.01}
              value={form.baselinePrice}
              onChange={(e) => onChange('baselinePrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.00"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="eff-date" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Effective Date
          </label>
          <input
            id="eff-date"
            type="date"
            value={form.effectiveDate}
            onChange={(e) => onChange('effectiveDate', e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="unit" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Measurement Unit
          </label>
          <select
            id="unit"
            value={form.unit}
            onChange={(e) => onChange('unit', e.target.value as MeasurementUnit)}
            className={inputCls}
          >
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}