"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import ProductsTable from "./ProductsTable";
import SummaryStats from "./SummaryStats";
import type { ApiCategory } from "@/types/CategoryManagement";

// ── Import everything from the SINGLE shared lib/api.ts (doc 25) ──────────────
import {
  inventoryApi,
  buildProductParams, // ← uses FilterState + separate search + SortOption
  ApiError,
  categoryApi,
} from "@/lib/api";

// ── FilterState and SortOption live in @/types/Product (as used by lib/api.ts) ─
import type { FilterState, SortOption } from "@/types/Product";
import { EMPTY_FILTERS, SORT_LABELS, SORT_TO_ORDERING } from "@/types/Product";

// ── MyProduct and display-only constants stay in @/types/Inventory ────────────
import type { MyProduct } from "@/types/Inventory";
import { CATEGORY_SLUGS, SEASON_OPTIONS } from "@/types/Inventory";

const PAGE_SIZE = 12;

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({
  name,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-7 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-red-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              delete
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Delete Product
            </h3>
            <p className="text-sm text-slate-500">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          Are you sure you want to delete{" "}
          <span className="font-bold">{name}</span>? All images and listings
          will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && (
              <span className="material-symbols-outlined animate-spin text-base">
                progress_activity
              </span>
            )}
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductManagementPage() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // ── Filter state — uses FilterState from @/types/Product (same as lib/api.ts) ─
  //    search and sort are kept separate, exactly as buildProductParams expects.
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("created_at_desc");

  //categories
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Debounce search ──────────────────────────────────────────────────────────
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  // ── Fetch ────────────────────────────────────────────────────────────────────
  //    buildProductParams(filters, search, sort, page, pageSize) is the exact
  //    signature from lib/api.ts (doc 25).

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    // buildProductParams handles all mapping — SORT_TO_ORDERING, URLSearchParams, etc.
    const qs = buildProductParams(filters, search, sort, page, PAGE_SIZE);

    inventoryApi
      .list(qs)
      .then((data) => {
        if (!cancelled) {
          setProducts(data.results);
          setTotalCount(data.count);
          setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof ApiError ? err.message : "Failed to load products.",
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, search, sort, page]);

  useEffect(() => {
    let cancelled = false;

    setCategoriesLoading(true);

    categoryApi
      .list(1, 100) // get enough categories
      .then((data) => {
        if (!cancelled) {
          setCategories(data.results);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load categories.");
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const resetPage = () => setPage(1);

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await inventoryApi.delete(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotalCount((c) => c - 1);
      showToast(`"${deleteTarget.name}" deleted.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Toggle stock — optimistic ─────────────────────────────────────────────────

  const handleToggleStock = useCallback(
    async (id: number, current: boolean) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, in_stock: !current } : p)),
      );
      try {
        await inventoryApi.patch(id, { in_stock: !current });
        showToast("Stock status updated.");
      } catch {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, in_stock: current } : p)),
        );
        setError("Failed to update stock status.");
      }
    },
    [],
  );

  // ── Summary stats — computed from the current page ────────────────────────────

  const stats = useMemo(() => {
    const inStock = products.filter((p) => p.in_stock).length;
    const totalValue = products.reduce(
      (s, p) => s + parseFloat(p.unit_price) * p.stock,
      0,
    );
    const rated = products.filter((p) => p.average_rating > 0);
    const avgRating =
      rated.length > 0
        ? (
            rated.reduce((s, p) => s + p.average_rating, 0) / rated.length
          ).toFixed(1)
        : "—";

    return [
      {
        icon: "inventory_2",
        label: "Total Listings",
        value: String(totalCount),
        sub: `${inStock} in stock`,
      },
      {
        icon: "payments",
        label: "Inventory Value",
        value: `${totalValue.toLocaleString("fr-DZ")} DZD`,
        sub: "across all stock",
      },
      {
        icon: "star",
        label: "Avg. Rating",
        value: avgRating,
        sub: "across rated products",
      },
      {
        icon: "local_florist",
        label: "Categories",
        value: String(new Set(products.map((p) => p.category_name)).size),
        sub: "product types",
      },
    ];
  }, [products, totalCount]);

  const farmName = products[0]?.farm.name;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-widest uppercase">
            Product Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            My Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalCount} product{totalCount !== 1 ? "s" : ""} in your catalogue
          </p>
        </div>
        <Link
          href="/farmer/dashboard/products/add"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-black text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_circle
          </span>
          Add New Product
        </Link>
      </div>

      {/* ── Banners ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-dark font-medium"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          {toast}
        </div>
      )}

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <span className="material-symbols-outlined text-xl">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-primary/10 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Category — maps to FilterState.category (slug) */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => {
              setFilters((f) => ({ ...f, category: e.target.value }));
              resetPage();
            }}
            disabled={categoriesLoading}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-primary/10 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value="">
              {categoriesLoading ? "Loading..." : "All Categories"}
            </option>
            {!categoriesLoading &&
              categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-symbols-outlined text-base">
              expand_more
            </span>
          </span>
        </div>

        {/* Season — maps to FilterState.season */}
        <div className="relative">
          <select
            value={filters.season}
            onChange={(e) => {
              setFilters((f) => ({ ...f, season: e.target.value }));
              resetPage();
            }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-primary/10 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value={SEASON_OPTIONS[0].value}>
              {SEASON_OPTIONS[0].label}
            </option>
            {SEASON_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-symbols-outlined text-base">
              expand_more
            </span>
          </span>
        </div>

        {/* Sort — SortOption from @/types/Product, mapped to ordering by buildProductParams */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              resetPage();
            }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-primary/10 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-symbols-outlined text-base">
              swap_vert
            </span>
          </span>
        </div>

        {/* In Stock toggle — maps to FilterState.in_stock */}
        <button
          type="button"
          role="switch"
          aria-checked={filters.in_stock === true}
          onClick={() => {
            setFilters((f) => ({
              ...f,
              in_stock: f.in_stock === true ? null : true,
            }));
            resetPage();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            filters.in_stock === true
              ? "bg-primary/10 border-primary text-primary-dark"
              : "bg-white dark:bg-slate-900 border-primary/10 text-slate-500 hover:border-primary/30"
          }`}
        >
          <span
            className="material-symbols-outlined text-base"
            style={
              filters.in_stock === true
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            inventory
          </span>
          In Stock
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onDelete={async (id) => {
          const p = products.find((p) => p.id === id);
          if (p) setDeleteTarget({ id, name: p.ministry_product.name });
        }}
        onToggleStock={handleToggleStock}
      />

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-primary/10 bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`w-9 h-9 rounded-lg border text-sm font-bold transition-colors ${
                n === page
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-primary/10 bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary/5"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-primary/10 bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>
      )}

      {/* ── Summary stats ─────────────────────────────────────────────────── */}
      <SummaryStats stats={stats} />
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
