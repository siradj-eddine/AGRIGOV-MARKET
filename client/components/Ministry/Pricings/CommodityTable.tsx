"use client";

import { useState, useMemo, useCallback } from "react";
import type { ApiOfficialPrice } from "@/types/Prices";
import {
  formatPriceRange,
  formatOfficialPriceDate,
  regionBadgeClass,
} from "@/types/Prices";

interface Props {
  items:        ApiOfficialPrice[];
  totalCount:   number;
  page:         number;
  pageSize:     number;
  isLoading:    boolean;
  onEdit:       (item: ApiOfficialPrice) => void;
  onDelete:     (id: number) => void;
  onPageChange: (page: number) => void;
  editingId:    number | null;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          {i === 1 && <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mt-1.5" />}
        </td>
      ))}
    </tr>
  );
}

// ── CSV helpers ────────────────────────────────────────────────────────────────

function escapeCsv(value: string | number | boolean | null | undefined): string {
  const str = String(value ?? "");
  // Wrap in quotes if it contains comma, newline, or quote
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRows(items: ApiOfficialPrice[]): string {
  const headers = [
    "ID", "Product", "Category", "Region", "Wilaya",
    "Unit", "Min Price (DZD)", "Max Price (DZD)",
    "Valid From", "Valid Until", "Status",
  ];

  const rows = items.map((item) => [
    item.id,
    item.product_detail.name,
    item.product_detail.category_name ?? "",
    item.region_name || "National",
    item.wilaya || "",
    item.unit,
    item.min_price,
    item.max_price,
    formatOfficialPriceDate(item.valid_from),
    item.valid_until ? formatOfficialPriceDate(item.valid_until) : "",
    item.is_active ? "Active" : "Inactive",
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // BOM for Excel
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CommodityTable({
  items, totalCount, page, pageSize, isLoading,
  onEdit, onDelete, onPageChange, editingId,
}: Props) {
  const [search,      setSearch]      = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.product_detail.name.toLowerCase().includes(q) ||
        item.wilaya.toLowerCase().includes(q) ||
        item.region_name.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleExport = useCallback(() => {
    if (filtered.length === 0) return;
    setIsExporting(true);
    try {
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const csv  = buildCsvRows(filtered);
      downloadCsv(csv, `official-prices-${date}.csv`);
    } finally {
      // Small delay so the icon flash is visible
      setTimeout(() => setIsExporting(false), 600);
    }
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start      = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end        = Math.min(page * pageSize, totalCount);

  return (
    <div className="lg:col-span-2 flex flex-col space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-slate-400">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, wilaya, region…"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
          />
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || filtered.length === 0}
          title={filtered.length === 0 ? "No data to export" : `Export ${filtered.length} rows to CSV`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-slate-900 bg-primary hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isExporting ? (
            <span className="material-icons text-lg mr-1 animate-spin">progress_activity</span>
          ) : (
            <span className="material-icons text-lg mr-1">file_download</span>
          )}
          {isExporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      {/* Export row count hint */}
      {search && filtered.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
          {filtered.length} filtered row{filtered.length !== 1 ? "s" : ""} will be exported.
        </p>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-light dark:divide-border-dark">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                {["Product", "Region / Wilaya", "Unit", "Price Range (DZD)", "Validity", "Status", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                        i === 3 ? "text-right" : i === 6 ? "relative" : "text-left"
                      }`}
                    >
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light dark:divide-border-dark">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                    <span className="material-icons text-3xl block mb-2 opacity-40">price_change</span>
                    No price entries match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isEditing = item.id === editingId;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isEditing ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Product */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                          {item.product_detail.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          #{item.product} · {item.product_detail.category_name ?? "—"}
                        </div>
                      </td>

                      {/* Region / Wilaya */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${regionBadgeClass(item.region_name)}`}>
                          {item.region_name || "National"}
                        </span>
                        {item.wilaya && (
                          <div className="text-xs text-slate-400 mt-0.5 capitalize">{item.wilaya}</div>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {item.unit}
                      </td>

                      {/* Price range */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {formatPriceRange(item)}
                      </td>

                      {/* Validity */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                        <span className="block">{formatOfficialPriceDate(item.valid_from)}</span>
                        {item.valid_until ? (
                          <span className="block text-slate-400">→ {formatOfficialPriceDate(item.valid_until)}</span>
                        ) : (
                          <span className="block text-slate-300 italic">No expiry</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-light dark:bg-primary/20 text-primary-dark text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded"
                            aria-label={`Edit ${item.product_detail.name}`}
                          >
                            <span className="material-icons text-base">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded"
                            aria-label={`Delete price #${item.id}`}
                          >
                            <span className="material-icons text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-t border-neutral-light dark:border-border-dark sm:px-6 mt-auto">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalCount}</span> entries
          </p>

          <nav className="inline-flex rounded-md shadow-sm -space-x-px">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons text-base">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                disabled={isLoading}
                aria-current={n === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                  n === page
                    ? "z-10 bg-primary/20 border-primary text-primary-dark dark:text-primary"
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons text-base">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}