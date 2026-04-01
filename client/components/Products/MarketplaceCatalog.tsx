"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FiltersSidebar from "@/components/Products/FilterSideBar";
import ProductGrid    from "@/components/Products/ProductGrid";
import { productApi, buildProductParams } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { ApiProduct, FilterState, SortOption } from "@/types/Product";
import { EMPTY_FILTERS, SORT_LABELS, SORT_TO_ORDERING } from "@/types/Product";

const PAGE_SIZE = 12;

export default function MarketplaceCatalog() {
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState<SortOption>("created_at_desc");
  const [filters,    setFilters]    = useState<FilterState>(EMPTY_FILTERS);
  const [page,       setPage]       = useState(1);

  const [products,   setProducts]   = useState<ApiProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState("");

  // Debounce search so we don't fire on every keystroke
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  // Reset page on filter/sort change
  const handleFiltersChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  const handleSortChange = (s: SortOption) => {
    setSort(s);
    setPage(1);
  };

  const clearFilter = useCallback(
    (key: keyof FilterState) => {
      setFilters((prev) => ({ ...prev, [key]: EMPTY_FILTERS[key] }));
      setPage(1);
    },
    [],
  );

  // Fetch products whenever any dependency changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const qs   = buildProductParams(filters, debouncedSearch, sort, page, PAGE_SIZE);
        const data = await productApi.list(qs);

        if (!cancelled) {
          setProducts(data.results);
          setTotalCount(data.count);
          setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load products. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [filters, debouncedSearch, sort, page]);

  return (
    <div className="bg-background-light font-display text-neutral-800 antialiased min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Browse Fresh Produce
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 text-xl">search</span>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products, categories…"
                className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="appearance-none block w-full sm:w-52 pl-3 pr-10 py-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                  <option key={s} value={s}>{SORT_LABELS[s]}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <span className="material-symbols-outlined text-lg">swap_vert</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Error banner ──────────────────────────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
            <button
              type="button"
              onClick={() => setPage((p) => p)} // re-trigger effect
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar filters={filters} onChange={handleFiltersChange} />
          <ProductGrid
            products={products}
            totalCount={totalCount}
            page={page}
            totalPages={totalPages}
            isLoading={isLoading}
            filters={filters}
            onPage={setPage}
            onClearFilter={clearFilter}
          />
        </div>
      </main>
    </div>
  );
}