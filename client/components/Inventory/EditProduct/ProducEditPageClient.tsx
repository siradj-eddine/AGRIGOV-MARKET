'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductGalleryCard from './ProductGallery';
import CropSpecificationsCard from './CropsSpecifications';
import MarketPricingCard from './Pricing';
import { InventoryStatusCard, MarketExpertCard } from './InventoryStatusCard';
import {
  PRODUCT_IMAGES,
  INVENTORY_STATUSES,
  BREADCRUMBS,
} from '@/types/ProductEdit';
import type { ProductForm, ProductImage, ApiFieldErrors, MinistryProductOption } from '@/types/ProductEdit';
import { farmerProductApi, ApiError, ministryProductApi } from '@/lib/api';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className ?? ''}`} />;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiToForm(data: any): ProductForm {
  return {
    ministry_product_id: data.ministry_product_id ?? data.ministry_product ?? "",
    quantityKg:          Number(data.stock ?? 0),
    description:         data.description ?? '',
    askingPrice:         Number(data.unit_price ?? 0),
    in_stock:            data.in_stock ?? true,
    season:              data.season ?? 'summer',
  };
}

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductEditPage() {
  const params    = useParams();
  const router    = useRouter();
  const productId = (params?.id ?? params?.productId) as string | undefined;

  const [form,        setForm]        = useState<ProductForm | null>(null);
  const [images,      setImages]      = useState<ProductImage[]>(PRODUCT_IMAGES);
  const [newImgFiles, setNewImgFiles] = useState<File[]>([]);

  // Ministry products for dropdown
  const [ministryProducts,  setMinistryProducts]  = useState<MinistryProductOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [isLoading,  setIsLoading]  = useState(!!productId);
  const [loadError,  setLoadError]  = useState<string | null>(null);
  const [isSaving,   setIsSaving]   = useState(false);
  const [saveError,  setSaveError]  = useState<string | null>(null);   // generic
  const [fieldErrors,setFieldErrors]= useState<ApiFieldErrors>({});   // field-level
  const [showToast,  setShowToast]  = useState(false);

  const cancelledRef = useRef(false);

  // ── Fetch ministry products ────────────────────────────────────────────────
  useEffect(() => {
    ministryProductApi.list(1, 100)
      .then((res) => setMinistryProducts(res.results))
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false));
  }, []);

  // ── Fetch product ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
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
        setLoadError(err instanceof ApiError ? err.message : 'Failed to load product. Please retry.');
      })
      .finally(() => { if (!cancelledRef.current) setIsLoading(false); });

    return () => { cancelledRef.current = true; };
  }, [productId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof ProductForm, value: string | number | boolean) => {
      setForm((prev) => prev ? { ...prev, [field]: value } : prev);
      // Clear field error on change
      setFieldErrors((prev) => {
        const apiField =
          field === 'askingPrice'          ? 'unit_price'          :
          field === 'quantityKg'           ? 'stock'               :
          field === 'ministry_product_id'  ? 'ministry_product_id' : field;
        if (!prev[apiField]) return prev;
        const next = { ...prev };
        delete next[apiField];
        return next;
      });
    },
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
    setFieldErrors({});
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
    setFieldErrors({});
    setIsSaving(true);

    try {
      const fd = new FormData();
      if (form.ministry_product_id !== "") {
        fd.append('ministry_product_id', String(form.ministry_product_id));
      }
      fd.append('description', form.description);
      fd.append('unit_price',  String(form.askingPrice));
      fd.append('stock',       String(form.quantityKg));
      fd.append('in_stock',    form.in_stock ? 'true' : 'false');
      fd.append('season',      form.season);

      newImgFiles.forEach((file) => fd.append('images', file));

      await farmerProductApi.update(productId, fd);

      setNewImgFiles([]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        try {
          const body = JSON.parse(err.message);
          if (typeof body === 'object' && body !== null) {
            setFieldErrors(body as ApiFieldErrors);
            return;
          }
        } catch {
          // not JSON
        }
        setSaveError(err.message);
      } else {
        setSaveError('Failed to save changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  // ── Render: loading ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
        <main className="pb-12 px-4 pt-12">
          <div className="max-w-4xl mx-auto"><PageSkeleton /></div>
        </main>
      </div>
    );
  }

  // ── Render: load error ─────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
        <main className="pb-12 px-4 pt-12 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <span className="material-symbols-outlined text-5xl text-red-400">error</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium">{loadError}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl bg-primary text-slate-900 font-bold">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentForm = form ?? {
    ministry_product_id: "", quantityKg: 0, description: "",
    askingPrice: 0, in_stock: true, season: "summer",
  };

  const fieldErrorCount = Object.keys(fieldErrors).length;

  // ── Render: main ───────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="pt-12 pb-12 px-4">
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
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                )}
                Save Changes
              </button>
            </div>
          </div>

          {/* Generic save error */}
          {saveError && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{saveError}</span>
              <button type="button" onClick={() => setSaveError(null)} className="shrink-0" aria-label="Dismiss">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Field-error summary */}
          {fieldErrorCount > 0 && (
            <div role="alert" className="mb-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-700 dark:text-orange-300">
              <div className="flex items-center gap-2 font-semibold mb-2">
                <span className="material-symbols-outlined text-base">warning</span>
                Please fix {fieldErrorCount} field error{fieldErrorCount > 1 ? "s" : ""} below:
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {Object.entries(fieldErrors).map(([field, msgs]) =>
                  msgs.map((msg, i) => (
                    <li key={`${field}-${i}`}>
                      <span className="font-medium capitalize">{field.replace(/_/g, " ")}</span>: {msg}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProductGalleryCard
                images={images}
                onEditPrimary={() => {}}
                onAddImage={handleAddImage}
              />
              <CropSpecificationsCard
                form={currentForm}
                onChange={handleChange}
                ministryProducts={ministryProducts}
                isLoadingProducts={isLoadingProducts}
                fieldErrors={fieldErrors}
              />
            </div>

            <div className="space-y-6">
              <MarketPricingCard
                form={currentForm}
                onPriceChange={(field, value) =>
                  handleChange(field === 'askingPrice' ? 'askingPrice' : 'askingPrice', value)
                }
                fieldErrors={fieldErrors}
              />
              <InventoryStatusCard statuses={INVENTORY_STATUSES} />
              <MarketExpertCard onConnect={() => {}} />
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
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50"
        >
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-bold text-sm">Product updated successfully</span>
        </div>
      )}
    </div>
  );
}