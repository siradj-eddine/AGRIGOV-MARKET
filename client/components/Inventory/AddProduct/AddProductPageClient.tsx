"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FarmerSidebar from "./FarmSidebar";
import ListingStepper from "./ListingStepper";
import ProductDetailsForm from "./ProductDetailsForm";
import type { ListingStep, ProductListingForm ,ApiCategory} from "@/types/AddProduct";
import { SAMPLE_UPLOADED_IMAGE } from "@/types/AddProduct";
import { farmerProductApi, apiFetch, ApiError } from "@/lib/api";

// ─── API types ────────────────────────────────────────────────────────────────


interface ApiFarm     { id: number; name: string; wilaya: string; baladiya: string; }
interface Paginated<T> { results: T[]; }

// ─── initial form ─────────────────────────────────────────────────────────────

const INITIAL_FORM: ProductListingForm = {
  title:        "",
  category:     "",
  description:  "",
  quantityKg:   "",
  pricePerUnit: "",
  images:       [SAMPLE_UPLOADED_IMAGE],
  season:       "summer",
  farm_id:      "", 
};

// ─── component ────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();

  const [step, setStep]           = useState<ListingStep>(2);
  const [form, setForm]           = useState<ProductListingForm>(INITIAL_FORM);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── remote data ─────────────────────────────────────────────────────────────
  const [categories,   setCategories]   = useState<ApiCategory[]>([]);
  const [farms,        setFarms]        = useState<ApiFarm[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, farmRes] = await Promise.all([
          apiFetch<Paginated<ApiCategory>>("/api/categories/"),
          apiFetch<Paginated<ApiFarm>>("/api/farms/me/"),
        ]);

        setCategories(catRes.results);
        setFarms(farmRes.results);

        // Pre-select first option so FormData is never empty
        setForm((prev) => ({
          ...prev,
          category: catRes.results[0]  ? String(catRes.results[0].name)  : "",
          farm_id:  farmRes.results[0] ? String(farmRes.results[0].id) : "",
        }));
      } catch (err) {
        setError("Failed to load farms / categories. Please refresh.");
      } finally {
        setIsLoadingMeta(false);
      }
    }
    loadMeta();
  }, []);

  const setField = useCallback(<K extends keyof ProductListingForm>(
    key: K,
    value: ProductListingForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: value })), []);

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as ListingStep);
  };

  // ── publish ──────────────────────────────────────────────────────────────────
  const handleContinue = async () => {
    setError(null);

    if (step < 4) {
      setStep((s) => (s + 1) as ListingStep);
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a product title before publishing.");
      return;
    }
    if (!form.farm_id) {
      setError("Please select a farm before publishing.");
      return;
    }

    setIsPublishing(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title.trim());
      fd.append("description", form.description);
      fd.append("unit_price",  form.pricePerUnit);
      console.log(form.pricePerUnit);
      
      fd.append("stock",       form.quantityKg);
      fd.append("category",    form.category);   // category id
      fd.append("season",      form.season);
      fd.append("farm_id",     form.farm_id);    // farm id

      form.images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });

      await farmerProductApi.create(fd);
      router.push("/farmer/dashboard/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = useCallback(() => {
    console.log("Saved draft:", form);
  }, [form]);

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <FarmerSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
            <Link href="#" className="hover:text-primary transition-colors">Inventory</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100">New Harvest Listing</span>
          </nav>

          <ListingStepper currentStep={step} />

          {error && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setError(null)} className="shrink-0 text-red-400 hover:text-red-600" aria-label="Dismiss error">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-background-dark/40 border border-primary/10 rounded-xl shadow-sm p-6 md:p-8">
            {/* Pass fetched data + loading flag down */}
            <ProductDetailsForm
              form={form}
              onChange={setField}
              categories={categories}
              farms={farms}
              isLoadingMeta={isLoadingMeta}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-primary/10">
              <button type="button" onClick={handleBack} disabled={step === 1}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Back
              </button>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button type="button" onClick={handleSaveDraft} disabled={isPublishing}
                  className="px-6 py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-colors disabled:opacity-50">
                  Save as Draft
                </button>

                <button type="button" onClick={handleContinue} disabled={isPublishing || isLoadingMeta}
                  className="px-10 py-2.5 rounded-lg bg-primary text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isPublishing ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">{step < 4 ? "arrow_forward" : "send"}</span>
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