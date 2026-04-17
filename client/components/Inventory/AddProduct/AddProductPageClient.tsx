"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListingStepper from "./ListingStepper";
import ProductDetailsForm from "./ProductDetailsForm";
import type { ProductListingForm, ApiFieldErrors, MinistryProductOption } from "@/types/AddProduct";
import { SAMPLE_UPLOADED_IMAGE } from "@/types/AddProduct";
import { farmerProductApi, apiFetch, ApiError, ministryProductApi, officialPriceApi } from "@/lib/api";

interface ApiFarm { id: number; name: string; wilaya: string; baladiya: string; }
interface Paginated<T> { results: T[]; }

const INITIAL_FORM: ProductListingForm = {
  ministry_product_id: "",
  description:         "",
  quantityKg:          "",
  pricePerUnit:        "",
  images:              [SAMPLE_UPLOADED_IMAGE],
  season:              "summer",
  farm_id:             "",
};


export default function AddProductPage() {
  const router = useRouter();

  const [step,          setStep]          = useState<1 | 2 | 3 | 4>(2);
  const [form,          setForm]          = useState<ProductListingForm>(INITIAL_FORM);
  const [isPublishing,  setIsPublishing]  = useState(false);

  // Top-level error (non-field)
  const [error,         setError]         = useState<string | null>(null);
  // Field-level errors from backend
  const [fieldErrors,   setFieldErrors]   = useState<ApiFieldErrors>({});

  // Remote data
  const [ministryProducts, setMinistryProducts] = useState<MinistryProductOption[]>([]);
  const [farms,            setFarms]            = useState<ApiFarm[]>([]);
  const [isLoadingMeta,    setIsLoadingMeta]    = useState(true);
  const [priceRange, setPriceRange] = useState<{
  min: number;
  max: number;
} | null>(null);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [mpRes, farmRes] = await Promise.allSettled([
          ministryProductApi.list(1, 100),
          apiFetch<Paginated<ApiFarm>>("/api/farms/me/"),
        ]);

        const mp    = mpRes.status    === "fulfilled" ? mpRes.value.results    : [];
        const farms = farmRes.status === "fulfilled" ? farmRes.value.results : [];

        setMinistryProducts(mp);
        setFarms(farms);

        setForm((prev) => ({
          ...prev,
          ministry_product_id: mp[0]    ? String(mp[0].id)    : "",
          farm_id:             farms[0] ? String(farms[0].id) : "",
        }));
      } catch {
        setError("Failed to load data. Please refresh.");
      } finally {
        setIsLoadingMeta(false);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
  if (!form.ministry_product_id) return;

  let cancelled = false;

  async function fetchPrice() {
    
    try {
      const res = await officialPriceApi.current(
        Number(form.ministry_product_id)
      );      
      
      
      if (!cancelled) {
        setPriceRange({
          min: Number(res.min_price),
          max: Number(res.max_price),
        });
      }
    } catch (err) {      
      console.error("Failed to fetch official price", err);
      setPriceRange(null);
    }
  }

  fetchPrice();

  return () => {
    cancelled = true;
  };
}, [form.ministry_product_id]);

  const setField = useCallback(<K extends keyof ProductListingForm>(
    key: K,
    value: ProductListingForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear that field's server error when the user edits it
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  const handleContinue = async () => {
    setError(null);
    setFieldErrors({});

    if (step < 4) {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
      return;
    }

    if (!form.ministry_product_id) {
      setFieldErrors({ ministry_product_id: ["Please select a product."] });
      return;
    }
    if (!form.farm_id) {
      setFieldErrors({ farm_id: ["Please select a farm."] });
      return;
    }

    setIsPublishing(true);
    try {
      const fd = new FormData();
      fd.append("ministry_product_id", form.ministry_product_id);
      fd.append("description",         form.description);
      fd.append("unit_price",          form.pricePerUnit);
      fd.append("stock",               form.quantityKg);
      fd.append("season",              form.season);
      fd.append("farm_id",             form.farm_id);

      form.images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });
      
if (priceRange) {
  const price = Number(form.pricePerUnit);

  if (price < priceRange.min || price > priceRange.max) {
    setFieldErrors({
      unit_price: [
        `Price must be between ${priceRange.min} and ${priceRange.max} DZD.`,
      ],
    });

    setIsPublishing(false);
    return;
  }
}
      await farmerProductApi.create(fd);
      router.push("/farmer/dashboard/products");
    } catch (err) {
      if (err instanceof ApiError) {
        if(err.status === 400) {
          setError(err.message);
        }
        try {
          const body = JSON.parse(err.message);
          if (typeof body === "object" && body !== null) {
            setFieldErrors(body as ApiFieldErrors);            
            return;
          }
        } catch {
          // message wasn't JSON — fall through to generic error
        }
        setError(err.message);
      } else {
        setError("Failed to publish. Please try again.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Count how many field errors exist (to show a summary)
  const fieldErrorCount = Object.keys(fieldErrors).length;

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
            <Link href="/farmer/dashboard/products" className="hover:text-primary transition-colors">
              Inventory
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100">New Harvest Listing</span>
          </nav>

          <ListingStepper currentStep={step} />

          {/* Generic top-level error */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Field-error summary (when there are backend validation errors) */}
          {fieldErrorCount > 0 && (
            <div
              role="alert"
              className="mb-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-700 dark:text-orange-300"
            >
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

          <div className="bg-white dark:bg-background-dark/40 border border-primary/10 rounded-xl shadow-sm p-6 md:p-8">
            <ProductDetailsForm
              form={form}
              onChange={setField}
              ministryProducts={ministryProducts}
              farms={farms}
              isLoadingMeta={isLoadingMeta}
              fieldErrors={fieldErrors}
              priceRange={priceRange}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-primary/10">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isPublishing || isLoadingMeta}
                  className="px-10 py-2.5 rounded-lg bg-primary text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isPublishing ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">
                        {step < 4 ? "arrow_forward" : "send"}
                      </span>
                      {step < 4 ? "Continue" : "Publish Harvest"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}