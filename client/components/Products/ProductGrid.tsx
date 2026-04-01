import ProductCard from "./ProductCard";
import type { ApiProduct, FilterState } from "@/types/Product";
import { CATEGORY_OPTIONS, SEASON_LABELS } from "@/types/Product";

interface Props {
  products:    ApiProduct[];
  totalCount:  number;
  page:        number;
  totalPages:  number;
  isLoading:   boolean;
  filters:     FilterState;
  onPage:      (p: number) => void;
  onClearFilter: (key: keyof FilterState) => void;
}

/** Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-neutral-200 rounded" />
        <div className="h-5 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-100 rounded" />
        <div className="h-3 w-5/6 bg-neutral-100 rounded" />
        <div className="flex justify-between items-end pt-3 border-t border-neutral-100">
          <div className="h-6 w-24 bg-neutral-200 rounded" />
          <div className="h-9 w-28 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Active filter pills shown above the grid */
function ActivePills({
  filters,
  onClearFilter,
}: {
  filters: FilterState;
  onClearFilter: (key: keyof FilterState) => void;
}) {
  const pills: { key: keyof FilterState; label: string }[] = [];

  if (filters.category) {
    const cat = CATEGORY_OPTIONS.find((c) => c.slug === filters.category);
    pills.push({ key: "category", label: cat?.label ?? filters.category });
  }
  if (filters.season)     pills.push({ key: "season",     label: SEASON_LABELS[filters.season as keyof typeof SEASON_LABELS] });
  if (filters.min_price)  pills.push({ key: "min_price",  label: `Min ${filters.min_price} DZD` });
  if (filters.max_price)  pills.push({ key: "max_price",  label: `Max ${filters.max_price} DZD` });
  if (filters.in_stock)   pills.push({ key: "in_stock",   label: "In Stock" });
  if (filters.min_rating) pills.push({ key: "min_rating", label: `★ ${filters.min_rating}+` });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {pills.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-dark"
        >
          {label}
          <button
            type="button"
            onClick={() => onClearFilter(key)}
            aria-label={`Remove ${label} filter`}
            className="hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </span>
      ))}
    </div>
  );
}

export default function ProductGrid({
  products, totalCount, page, totalPages, isLoading,
  filters, onPage, onClearFilter,
}: Props) {
  return (
    <div className="flex-1 min-w-0">

      {/* Results bar */}
      <div className="mb-4">
        <p className="text-sm text-neutral-500">
          {isLoading ? (
            "Loading products…"
          ) : (
            <>
              Showing{" "}
              <span className="font-bold text-neutral-900">{products.length}</span>{" "}
              of{" "}
              <span className="font-bold text-neutral-900">{totalCount}</span>{" "}
              products
            </>
          )}
        </p>
        <ActivePills filters={filters} onClearFilter={onClearFilter} />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <span
            className="material-symbols-outlined text-5xl mb-4"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            search_off
          </span>
          <p className="text-lg font-medium text-neutral-600">No products found.</p>
          <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1">
          <button
            onClick={() => onPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex items-center px-2 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => onPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-bold transition-colors ${
                n === page
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => onPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center px-2 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}