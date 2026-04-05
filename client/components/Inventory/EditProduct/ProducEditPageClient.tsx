'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductGalleryCard from './ProductGallery';
import CropSpecificationsCard from './CropsSpecifications';
import MarketPricingCard from './Pricing';
import { InventoryStatusCard, MarketExpertCard } from './InventoryStatusCard';
import {
  PRODUCT_IMAGES,
  MARKET_REFERENCE,
  INVENTORY_STATUSES,
  BREADCRUMBS,
} from '@/types/ProductEdit';
import type { ProductForm, ProductImage } from '@/types/ProductEdit';
import { farmerProductApi, ApiError } from '@/lib/api';

// ─── skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className ?? ''}`}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-10">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Map an API product to the local form state. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiToForm(data: any): ProductForm {
  return {
    name:            data.title       ?? '',
    varietyCode:     data.variety_code ?? '',
    quantityTons:    Number(data.stock ?? 0),
    moisturePercent: Number(data.moisture_percent ?? 0),
    description:     data.description ?? '',
    askingPrice:     Number(data.unit_price ?? 0),
    minPrice:        Number(data.min_price ?? 0),
    in_stock:        data.in_stock    ?? true,
  };
}

/** Map an API product's image list to ProductImage[]. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiToImages(data: any): ProductImage[] {
  const imgs = Array.isArray(data.images) ? data.images : [];
  return imgs.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (img: any, i: number): ProductImage => ({
      id:        String(img.id ?? i),
      src:       img.image ?? img.url ?? img,
      alt:       `Product image ${i + 1}`,
      isPrimary: i === 0,
    }),
  );
}

/** Build description string bundling moisture % and variety code. */
function buildDescription(form: ProductForm): string {
  const lines: string[] = [];
  if (form.description.trim())  lines.push(form.description.trim());
  if (form.varietyCode.trim())  lines.push(`Variety Code: ${form.varietyCode.trim()}`);
  if (form.moisturePercent)     lines.push(`Moisture: ${form.moisturePercent}%`);
  return lines.join('\n');
}

// ─── component ───────────────────────────────────────────────────────────────

export default function ProductEditPage() {
  // ── route ──────────────────────────────────────────────────────────────────
  const params    = useParams();
  const router    = useRouter();
  // Works for routes like /farmer/products/[id]/edit or /farmer/products/[productId]/edit
  const productId = (params?.id ?? params?.productId) as string | undefined;

  // ── state ──────────────────────────────────────────────────────────────────
  const [form,        setForm]        = useState<ProductForm | null>(null);
  const [images,      setImages]      = useState<ProductImage[]>(PRODUCT_IMAGES);
  const [newImgFiles, setNewImgFiles] = useState<File[]>([]);

  const [isLoading,   setIsLoading]   = useState(!!productId);
  const [loadError,   setLoadError]   = useState<string | null>(null);
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveError,   setSaveError]   = useState<string | null>(null);
  const [showToast,   setShowToast]   = useState(false);

  const cancelledRef = useRef(false);

  // ── fetch product ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;        // no id in URL → new product / wrong route
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    farmerProductApi.detail(productId)
      .then((data) => {
        if (cancelledRef.current) return;
        setForm(apiToForm(data));
        const apiImgs = apiToImages(data);
        if (apiImgs.length > 0) setImages(apiImgs);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError ? err.message : 'Failed to load product. Please retry.',
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, [productId]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof ProductForm, value: string | number | boolean) =>
      setForm((prev) => prev ? { ...prev, [field]: value } : prev),
    [],
  );

  const handlePriceChange = useCallback(
    (field: 'askingPrice' | 'minPrice', value: number) =>
      setForm((prev) => prev ? { ...prev, [field]: value } : prev),
    [],
  );

  const handleAddImage = useCallback((file: File, previewSrc: string) => {
    setNewImgFiles((prev) => [...prev, file]);
    setImages((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, src: previewSrc, alt: file.name, isPrimary: false, file },
    ]);
  }, []);

  function handleDiscard() {
    setNewImgFiles([]);
    // Re-fetch to restore original state
    if (productId) {
      setIsLoading(true);
      farmerProductApi.detail(productId)
        .then((data) => { setForm(apiToForm(data)); setImages(apiToImages(data)); })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }

  async function handleSave() {
    if (!form || !productId) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      const fd = new FormData();
      fd.append('title',       form.name.trim());
      fd.append('description', buildDescription(form));
      fd.append('unit_price',  String(form.askingPrice));
      fd.append('stock',       String(form.quantityTons));
      fd.append('in_stock',    form.in_stock ? 'true' : 'false');

      // Only append newly uploaded files
      newImgFiles.forEach((file) => fd.append('images', file));

      await farmerProductApi.update(productId, fd);

      setNewImgFiles([]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setSaveError(
        err instanceof ApiError ? err.message : 'Failed to save changes. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  // ── render: loading ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">

        <main className="md:ml-64 pt-12 pb-12 px-4 md:px-12">
          <div className="max-w-4xl mx-auto">
            <PageSkeleton />
          </div>
        </main>
      </div>
    );
  }

  // ── render: load error ─────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
        <main className="md:ml-64 pt-12 pb-12 px-4 md:px-12 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <span className="material-symbols-outlined text-5xl text-red-400">error</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-primary text-slate-900 font-bold"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Use fetched form or fall back to blank
  const currentForm = form ?? {
    name: '', varietyCode: '', quantityTons: 0, moisturePercent: 0,
    description: '', askingPrice: 0, minPrice: 0, in_stock: true,
  };

  // ── render: main ───────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">

      <main className=" pt-12 pb-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                {BREADCRUMBS.map((crumb, i) => (
                  <span key={crumb} className="flex items-center gap-2">
                    <span className="hover:text-primary cursor-pointer transition-colors">{crumb}</span>
                    {i < BREADCRUMBS.length - 1 && (
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    )}
                  </span>
                ))}
              </nav>
              <h1 className="text-4xl font-extrabold tracking-tight">Edit Product</h1>
              <p className="text-slate-500 mt-1">
                Manage specifications for{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {currentForm.name || 'this product'}
                </span>{' '}
                {productId && <span className="text-xs text-slate-400">#{productId}</span>}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleDiscard}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-primary text-slate-900 font-bold shadow-sm active:scale-95 transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              >
                {isSaving && (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                )}
                Save Changes
              </button>
            </div>
          </div>

          {/* Save error banner */}
          {saveError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{saveError}</span>
              <button
                type="button"
                onClick={() => setSaveError(null)}
                className="shrink-0"
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — media + specs */}
            <div className="lg:col-span-2 space-y-6">
              <ProductGalleryCard
                images={images}
                onEditPrimary={() => console.log('Edit primary image')}
                onAddImage={handleAddImage}
              />
              <CropSpecificationsCard form={currentForm} onChange={handleChange} />
            </div>

            {/* Right column — pricing + status */}
            <div className="space-y-6">
              <MarketPricingCard
                form={currentForm}
                marketRef={MARKET_REFERENCE}
                onPriceChange={handlePriceChange}
              />
              <InventoryStatusCard statuses={INVENTORY_STATUSES} />
              <MarketExpertCard onConnect={() => console.log('Connect to broker')} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        aria-label="Save changes"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-slate-900 rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-3xl">
          {isSaving ? 'progress_activity' : 'check'}
        </span>
      </button>

      {/* Success toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in"
        >
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-bold text-sm">Product updated successfully</span>
        </div>
      )}
    </div>
  );
}