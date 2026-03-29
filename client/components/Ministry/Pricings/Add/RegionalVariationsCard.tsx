import type { RegionVariation } from '@/types/AddOfficialPrice';

interface RegionalVariationsCardProps {
  regions:   RegionVariation[];
  onAdd:     () => void;
  onRemove:  (id: string) => void;
  onChange:  (id: string, field: keyof RegionVariation, value: string | number) => void;
}

export default function RegionalVariationsCard({
  regions,
  onAdd,
  onRemove,
  onChange,
}: RegionalVariationsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-primary/10 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">map</span>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Regional Variations</h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add Region
        </button>
      </div>

      <div className="space-y-4">
        {regions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 font-medium">
            No regional variations added yet.
          </p>
        ) : (
          regions.map((region) => {
            const isPositive = region.priceAdjust.startsWith('+');
            return (
              <div
                key={region.id}
                className="grid grid-cols-12 gap-4 items-center bg-background-light dark:bg-slate-800 p-4 rounded-xl"
              >
                {/* Region name */}
                <div className="col-span-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Region</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{region.regionName}</p>
                </div>

                {/* Price adjust input */}
                <div className="col-span-3">
                  <label
                    htmlFor={`adjust-${region.id}`}
                    className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                  >
                    Price Adjust %
                  </label>
                  <input
                    id={`adjust-${region.id}`}
                    type="text"
                    value={region.priceAdjust}
                    onChange={(e) => onChange(region.id, 'priceAdjust', e.target.value)}
                    className={`w-full bg-transparent border-none font-bold p-0 focus:ring-0 outline-none ${
                      isPositive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  />
                </div>

                {/* Yield gauge */}
                <div className="col-span-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Yield Forecast
                  </p>
                  <div className="h-2 w-full bg-neutral-light dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${region.yieldPercent}%` }}
                    />
                  </div>
                </div>

                {/* Delete */}
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(region.id)}
                    aria-label={`Remove ${region.regionName}`}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}