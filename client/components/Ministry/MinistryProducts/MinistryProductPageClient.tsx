"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { ministryProductApi, categoryApi, ApiError } from "@/lib/api";
import type { MinistryProduct, MinistryProductPayload, ProductFormErrors } from "@/types/MinistryProduct";
import { EMPTY_PRODUCT_FORM, slugify, validateProductForm } from "@/types/MinistryProduct";
import type { ApiCategory } from "@/types/CategoryManagement";

const PAGE_SIZE = 10;

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          {i === 1 && <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mt-1.5" />}
        </td>
      ))}
    </tr>
  );
}

// ─── Product Edit / Create Panel ──────────────────────────────────────────────
interface PanelProps {
  mode: "create" | "edit";
  initial: MinistryProductPayload;
  categories: ApiCategory[];
  isSaving: boolean;
  saveError: string | null;
  onSave: (payload: MinistryProductPayload) => void;
  onCancel: () => void;
}

function ProductPanel({ mode, initial, categories, isSaving, saveError, onSave, onCancel }: PanelProps) {
  const [form, setForm] = useState<MinistryProductPayload>(initial);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  // Reset when switching between items
  useEffect(() => {
    setForm(initial);
    setErrors({});
    setSlugTouched(mode === "edit");
  }, [initial, mode]);

  function handleChange(field: keyof MinistryProductPayload, value: string | number | boolean | null) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from name unless user has manually edited it
      if (field === "name" && !slugTouched && typeof value === "string") {
        next.slug = slugify(value);
      }
      if (field === "slug") setSlugTouched(true);
      return next;
    });
    // Clear field error on change
    if (errors[field as keyof ProductFormErrors]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field as keyof ProductFormErrors]; return n; });
    }
  }

  function handleSubmit() {
    const errs = validateProductForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  }

  const inputBase =
    "block w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors";
  const inputNormal = `${inputBase} border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary`;
  const inputError  = `${inputBase} border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-light dark:border-border-dark bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${mode === "create" ? "bg-primary/20 text-primary-dark dark:text-primary" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
            <span className="material-icons text-base">{mode === "create" ? "add_circle" : "edit"}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {mode === "create" ? "New Product" : "Edit Product"}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
          aria-label="Close panel"
        >
          <span className="material-icons text-base">close</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Save error */}
        {saveError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-xs text-red-700 dark:text-red-300">
            <span className="material-icons text-sm mt-0.5 shrink-0">error</span>
            <span>{saveError}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Durum Wheat"
            className={errors.name ? inputError : inputNormal}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="durum-wheat"
              className={`${errors.slug ? inputError : inputNormal} pr-16`}
            />
            {!slugTouched && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase">
                Auto
              </span>
            )}
          </div>
          {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
          <p className="mt-1 text-[11px] text-slate-400">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={form.category ?? ""}
            onChange={(e) => handleChange("category", e.target.value ? Number(e.target.value) : null)}
            className={inputNormal}
          >
            <option value="">— No category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            placeholder="Optional product description…"
            className={`${inputNormal} resize-none`}
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-neutral-light dark:border-border-dark">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Active</p>
            <p className="text-xs text-slate-500">Visible and usable in price entries.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.is_active ?? true}
            onClick={() => handleChange("is_active", !(form.is_active ?? true))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              (form.is_active ?? true) ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                (form.is_active ?? true) ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-neutral-light dark:border-border-dark text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-sm font-bold rounded-lg bg-primary text-slate-900 shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving && (
              <span className="material-icons text-sm animate-spin">progress_activity</span>
            )}
            {isSaving ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MinistryProductsClient() {
  // ── data ────────────────────────────────────────────────────────────────────
  const [items,      setItems]      = useState<MinistryProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading,  setIsLoading]  = useState(true);
  const [loadError,  setLoadError]  = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  // ── panel ───────────────────────────────────────────────────────────────────
  const [panelMode,   setPanelMode]   = useState<"create" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<MinistryProduct | null>(null);
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveError,   setSaveError]   = useState<string | null>(null);

  // ── delete ──────────────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const cancelledRef = useRef(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // ── fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    Promise.allSettled([
      ministryProductApi.list(page, PAGE_SIZE, debouncedSearch || undefined),
      categoryApi.list(1, 100),
    ]).then(([productsResult, catsResult]) => {
      if (cancelledRef.current) return;

      if (productsResult.status === "fulfilled") {
        setItems(productsResult.value.results);
        setTotalCount(productsResult.value.count);
      } else {
        const err = productsResult.reason;
        setLoadError(err instanceof ApiError ? err.message : "Failed to load products.");
      }

      if (catsResult.status === "fulfilled") {
        setCategories(catsResult.value.results);
      }
    }).finally(() => {
      if (!cancelledRef.current) setIsLoading(false);
    });

    return () => { cancelledRef.current = true; };
  }, [page, debouncedSearch]);

  useEffect(() => { return fetchProducts(); }, [fetchProducts]);

  // ── save (create or update) ─────────────────────────────────────────────────
  const handleSave = useCallback(async (payload: MinistryProductPayload) => {
    setSaveError(null);
    setIsSaving(true);
    try {
      if (panelMode === "create") {
        const created = await ministryProductApi.create(payload);
        setItems((prev) => [created, ...prev]);
        setTotalCount((c) => c + 1);
        showToast(`"${created.name}" created successfully.`, true);
      } else if (panelMode === "edit" && editingItem) {
        const updated = await ministryProductApi.update(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        showToast(`"${updated.name}" updated.`, true);
      }
      setPanelMode(null);
      setEditingItem(null);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }, [panelMode, editingItem]);

  // ── delete ──────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (item: MinistryProduct) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    try {
      await ministryProductApi.delete(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setTotalCount((c) => Math.max(0, c - 1));
      if (editingItem?.id === item.id) { setPanelMode(null); setEditingItem(null); }
      showToast(`"${item.name}" deleted.`, true);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete.", false);
    } finally {
      setDeletingId(null);
    }
  }, [editingItem]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function openCreate() {
    setEditingItem(null);
    setSaveError(null);
    setPanelMode("create");
  }

  function openEdit(item: MinistryProduct) {
    setEditingItem(item);
    setSaveError(null);
    setPanelMode("edit");
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end   = Math.min(page * PAGE_SIZE, totalCount);
  const activeCount = items.filter((i) => i.is_active).length;

  const panelInitial: MinistryProductPayload = useMemo(() => {
    if (!editingItem) return { ...EMPTY_PRODUCT_FORM };
    return {
      name:        editingItem.name,
      slug:        editingItem.slug,
      category:    editingItem.category,
      description: editingItem.description,
      is_active:   editingItem.is_active,
    };
  }, [editingItem]);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">
      <main className="p-8 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              <Link href="/Ministry/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <span className="material-icons text-xs">chevron_right</span>
              <span className="text-primary">Products</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ministry Product Registry
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage official agricultural commodity products used across the platform.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            {/* KPI chips */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-neutral-light dark:border-border-dark shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-icons text-xl">inventory_2</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Products</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {isLoading ? "—" : totalCount}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-neutral-light dark:border-border-dark shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/20 text-primary-dark dark:text-primary">
                  <span className="material-icons text-xl">verified</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Active</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {isLoading ? "—" : activeCount}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-slate-900 font-bold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-icons text-base">add</span>
              New Product
            </button>
          </div>
        </div>

        {/* Load error */}
        {loadError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            <span className="material-icons mt-0.5 shrink-0">error</span>
            <span className="flex-1">{loadError}</span>
            <button onClick={fetchProducts} className="shrink-0 underline font-semibold text-xs">
              Retry
            </button>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Table (left 2/3) ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-slate-400 text-lg">search</span>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or slug…"
                  className="block w-full pl-10 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <span className="material-icons text-base">close</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {debouncedSearch && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {totalCount} result{totalCount !== 1 ? "s" : ""} for &ldquo;{debouncedSearch}&rdquo;
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-light dark:divide-border-dark">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      {["Product", "Category", "Slug", "Status", ""].map((h, i) => (
                        <th
                          key={i}
                          scope="col"
                          className={`px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                            i === 4 ? "relative w-20" : "text-left"
                          }`}
                        >
                          {h || <span className="sr-only">Actions</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-light dark:divide-border-dark">
                    {isLoading ? (
                      Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                          <span className="material-icons text-3xl block mb-2 opacity-40">
                            {debouncedSearch ? "search_off" : "inventory_2"}
                          </span>
                          {debouncedSearch
                            ? `No products match "${debouncedSearch}".`
                            : "No products yet. Click «New Product» to add one."}
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => {
                        const isEditing = panelMode === "edit" && editingItem?.id === item.id;
                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                              isEditing ? "bg-primary/5 dark:bg-primary/5" : ""
                            }`}
                          >
                            {/* Product name */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-slate-400 font-mono">
                                    id #{item.id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.category_name ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 capitalize">
                                  {item.category_name}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Uncategorised</span>
                              )}
                            </td>

                            {/* Slug */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 dark:text-slate-400">
                              {item.slug}
                            </td>

                            {/* Active */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.is_active ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-light dark:bg-primary/20 text-primary-dark text-[11px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 text-[11px] font-bold">
                                  Inactive
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEdit(item)}
                                  className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded"
                                  aria-label={`Edit ${item.name}`}
                                >
                                  <span className="material-icons text-base">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  disabled={deletingId === item.id}
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded disabled:opacity-40"
                                  aria-label={`Delete ${item.name}`}
                                >
                                  {deletingId === item.id ? (
                                    <span className="material-icons text-base animate-spin">progress_activity</span>
                                  ) : (
                                    <span className="material-icons text-base">delete</span>
                                  )}
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
                  <span className="font-medium">{totalCount}</span> products
                </p>

                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-icons text-base">chevron_left</span>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-icons text-base">chevron_right</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5">
            {panelMode ? (
              <ProductPanel
                mode={panelMode}
                initial={panelInitial}
                categories={categories}
                isSaving={isSaving}
                saveError={saveError}
                onSave={handleSave}
                onCancel={() => { setPanelMode(null); setEditingItem(null); setSaveError(null); }}
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-8 text-center text-slate-400 text-sm">
                <span className="material-icons text-3xl mb-2 block opacity-60">touch_app</span>
                Select a product to edit, or click
                <button
                  onClick={openCreate}
                  className="mx-1 text-primary font-semibold hover:underline"
                >
                  New Product
                </button>
                to add one.
              </div>
            )}

            {/* Info card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
              <div className="flex gap-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 shrink-0">info</span>
                <div>
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    Registry Guidelines
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Ministry products are referenced by official price entries and farmer
                    listings. Deactivating a product hides it from new price regulation
                    forms without removing existing data.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats card */}
            {!isLoading && items.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Page Overview
                </h3>

                {/* Active ratio bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Active products</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {activeCount} / {items.length}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${items.length ? (activeCount / items.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Category breakdown */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Category breakdown</p>
                  <div className="space-y-1.5">
                    {(() => {
                      const uncatCount = items.filter((i) => !i.category).length;
                      const catMap = new Map<string, number>();
                      items.forEach((i) => {
                        if (i.category_name) catMap.set(i.category_name, (catMap.get(i.category_name) ?? 0) + 1);
                      });
                      const rows: { label: string; count: number }[] = [];
                      catMap.forEach((count, label) => rows.push({ label, count }));
                      if (uncatCount) rows.push({ label: "Uncategorised", count: uncatCount });
                      return rows.slice(0, 4).map(({ label, count }) => (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-slate-500 capitalize truncate">{label}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0 ml-2">{count}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className={`material-icons text-base ${toast.ok ? "text-primary" : "text-red-400"}`}>
            {toast.ok ? "check_circle" : "error"}
          </span>
          <span className="font-medium text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}