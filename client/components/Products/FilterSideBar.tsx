"use client";

import type { FilterState } from "@/types/Product";
import {
  SEASON_LABELS,
  SEASON_ICONS,
  EMPTY_FILTERS,
} from "@/types/Product";
import type { ProductSeason } from "@/types/Product";
import type { ApiCategory } from "@/types/CategoryManagement";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  categories: ApiCategory[];
  isLoading: boolean;
}

const SEASONS = Object.keys(SEASON_LABELS) as ProductSeason[];
const RATINGS = [4, 3, 2, 1];

const inputCls =
  "block w-full py-2 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition";

export default function FiltersSidebar({
  filters,
  onChange,
  categories,
  isLoading,
}: Props) {
  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    onChange({ ...filters, [key]: val });

  const isDirty =
    filters.category !== EMPTY_FILTERS.category ||
    filters.season !== EMPTY_FILTERS.season ||
    filters.min_price !== EMPTY_FILTERS.min_price ||
    filters.max_price !== EMPTY_FILTERS.max_price ||
    filters.in_stock !== EMPTY_FILTERS.in_stock ||
    filters.min_rating !== EMPTY_FILTERS.min_rating;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 sticky top-24 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              filter_list
            </span>
            Filters
          </h2>

          {isDirty && (
            <button
              type="button"
              onClick={() => onChange({ ...EMPTY_FILTERS })}
              className="text-xs text-primary-dark font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* ── Category ───────────────────────────────── */}
        <fieldset>
          <legend className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Category
          </legend>

          <div className="space-y-1.5">
            {isLoading ? (
              <p className="text-sm text-neutral-400">Loading...</p>
            ) : (
              categories.map((cat) => {
                const active = filters.category === cat.slug;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      set("category", active ? "" : cat.slug)
                    }
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      active
                        ? "bg-primary/10 text-primary-dark"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >

                    {cat.name}

                    {active && (
                      <span
                        className="material-symbols-outlined text-primary text-sm ml-auto"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </fieldset>

        <hr className="border-neutral-100" />

        {/* ── Season ───────────────────────────────── */}
        <fieldset>
          <legend className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Season
          </legend>

          <div className="grid grid-cols-2 gap-2">
            {SEASONS.map((s) => {
              const active = filters.season === s;

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("season", active ? "" : s)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-neutral-200 text-neutral-600 hover:border-primary/40 hover:bg-neutral-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {SEASON_ICONS[s]}
                  </span>
                  {SEASON_LABELS[s]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <hr className="border-neutral-100" />

        {/* ── Price Range ───────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Price Range (DZD / unit)
          </p>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.min_price}
              onChange={(e) => set("min_price", e.target.value)}
              className={inputCls}
            />

            <span className="text-neutral-400 text-sm">–</span>

            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.max_price}
              onChange={(e) => set("max_price", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <hr className="border-neutral-100" />

        {/* ── In Stock ─────────────────────────────── */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">
            In Stock Only
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={filters.in_stock === true}
            onClick={() =>
              set("in_stock", filters.in_stock === true ? null : true)
            }
            className={`relative inline-flex h-6 w-11 rounded-full transition ${
              filters.in_stock === true ? "bg-primary" : "bg-neutral-200"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                filters.in_stock === true ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <hr className="border-neutral-100" />

        {/* ── Rating ─────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Minimum Rating
          </p>

          <div className="space-y-1.5">
            {RATINGS.map((r) => {
              const active = filters.min_rating === String(r);

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    set("min_rating", active ? "" : String(r))
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    active
                      ? "bg-primary/10 text-primary-dark"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined ${
                          i < r ? "text-yellow-400" : "text-neutral-200"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </span>

                  <span className="text-xs">& up</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}