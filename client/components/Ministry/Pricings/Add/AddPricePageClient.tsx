"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CoreIdentificationCard from "./CoreIdentification";
import RegionalVariationsCard from "./RegionalVariationsCard";
import QualityStandardsCard from "./QualityStandards";
import RegistryCertificationCard from "./RegistryCertifications";
import {
  EMPTY_FORM,
  INITIAL_REGIONS,
  QUALITY_STANDARDS,
  CERTIFYING_OFFICIAL,
  COMMODITY_IMAGE_URL,
} from "@/types/AddOfficialPrice";
import type { OfficialPriceForm, RegionVariation } from "@/types/AddOfficialPrice";
import { officialPriceApi, ministryProductApi, ApiError } from "@/lib/api";
import type { OfficialPricePayload } from "@/types/Prices";
import type { MinistryProduct } from "@/types/MinistryProduct";

type FieldErrors = Partial<Record<keyof OfficialPriceForm, string>>;

function validate(form: OfficialPriceForm): FieldErrors {
  const e: FieldErrors = {};
  if (!form.product)
    e.product = "Please select a product.";
  if (!form.min_price || parseFloat(form.min_price) <= 0)
    e.min_price = "Min price must be greater than 0.";
  if (!form.max_price || parseFloat(form.max_price) <= 0)
    e.max_price = "Max price must be greater than 0.";
  if (form.min_price && form.max_price &&
      parseFloat(form.min_price) > parseFloat(form.max_price))
    e.max_price = "Max price must be ≥ min price.";
  if (!form.valid_from)
    e.valid_from = "Valid from date is required.";
  return e;
}

export default function AddPricePage() {
  const router = useRouter();

  const [form,         setForm]         = useState<OfficialPriceForm>(EMPTY_FORM);
  const [regions,      setRegions]      = useState<RegionVariation[]>(INITIAL_REGIONS);
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [submitError,  setSubmitError]  = useState<string | null>(null);
  const [showToast,    setShowToast]    = useState(false);

  // Ministry products for dropdown
  const [products,       setProducts]       = useState<MinistryProduct[]>([]);
  const [loadingProducts,setLoadingProducts] = useState(true);
  const [productsError,  setProductsError]  = useState<string | null>(null);

  // Fetch ministry products on mount
  useEffect(() => {
    ministryProductApi.list(1, 100)
      .then((res) => {
        setProducts(res.results.filter((p) => p.is_active));
        // Pre-select first active product
        if (res.results.length > 0) {
          setForm((prev) => ({ ...prev, product: String(res.results[0].id) }));
        }
      })
      .catch(() => setProductsError("Failed to load products. Please refresh."))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleFormChange = useCallback(
    (field: keyof OfficialPriceForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleRegionChange = useCallback(
    (id: string, field: keyof RegionVariation, value: string | number) =>
      setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))),
    []
  );

  function handleAddRegion() {
    setRegions((prev) => [
      ...prev,
      { id: `region-${Date.now()}`, regionName: "New Region", priceAdjust: "+0.0%", yieldPercent: 50 },
    ]);
  }

  function handleRemoveRegion(id: string) {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  }

  async function handlePublish() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSubmitError(null);
    setIsPublishing(true);

    const toISO = (v: string) => v ? new Date(v).toISOString() : undefined;

    const payload: OfficialPricePayload = {
      product:     Number(form.product),
      wilaya:      form.wilaya.trim() || undefined,
      min_price:   parseFloat(form.min_price),
      max_price:   parseFloat(form.max_price),
      unit:        form.unit,
      valid_from:  toISO(form.valid_from)!,
      valid_until: form.valid_until ? toISO(form.valid_until) : null,
    };

    try {
      await officialPriceApi.create(payload);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/Ministry/dashboard/PricesManagement");
      }, 2000);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Failed to publish. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="pb-12 px-6 md:px-12 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Link href="/Ministry/dashboard/PricesManagement" className="hover:text-primary transition-colors">
                Price Control
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-800 dark:text-slate-200">New Entry</span>
            </nav>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
              Admin Portal
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">Commodity Pricing Index</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm">
              Official administrative entry for the national agricultural price registry.
              Ensure all data reflects verified Ministry metrics.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => { setForm(EMPTY_FORM); setFieldErrors({}); setSubmitError(null); }}
              className="px-6 py-3 rounded-full border border-neutral-light dark:border-border-dark font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              Discard Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || loadingProducts}
              className="px-8 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-sm active:scale-95 transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2 text-sm"
            >
              {isPublishing && (
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              )}
              {isPublishing ? "Publishing…" : "Publish Entry"}
            </button>
          </div>
        </div>

        {/* Products load error */}
        {productsError && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            <span className="material-symbols-outlined mt-0.5 shrink-0">warning</span>
            <span className="flex-1">{productsError}</span>
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
            <span className="flex-1">{submitError}</span>
            <button onClick={() => setSubmitError(null)} aria-label="Dismiss">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <CoreIdentificationCard
              form={form}
              onChange={handleFormChange}
              errors={fieldErrors}
              products={products}
              isLoadingProducts={loadingProducts}
            />
            <RegionalVariationsCard
              regions={regions}
              onAdd={handleAddRegion}
              onRemove={handleRemoveRegion}
              onChange={handleRegionChange}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <QualityStandardsCard imageUrl={COMMODITY_IMAGE_URL} standards={QUALITY_STANDARDS} />
            <RegistryCertificationCard
              officialName={CERTIFYING_OFFICIAL.name}
              signatureKey={CERTIFYING_OFFICIAL.key}
              liveMarketActive
            />
          </div>
        </div>
      </main>

      {/* Success toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 right-8 bg-white dark:bg-slate-900 border border-primary/20 shadow-sm rounded-2xl p-6 flex items-center gap-4 z-50 max-w-sm"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Entry Published</h4>
            <p className="text-xs text-slate-500">Price entry added to the national registry. Redirecting…</p>
          </div>
        </div>
      )}
    </div>
  );
}