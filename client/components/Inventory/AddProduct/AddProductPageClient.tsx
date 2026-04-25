"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductDetailsForm from "./ProductDetailsForm";

import type {
  ProductListingForm,
  ApiFieldErrors,
  MinistryProductOption,
} from "@/types/AddProduct";

import { SAMPLE_UPLOADED_IMAGE } from "@/types/AddProduct";

import {
  farmerProductApi,
  apiFetch,
  ApiError,
  ministryProductApi,
  officialPriceApi,
} from "@/lib/api";

interface ApiFarm {
  id: number;
  name: string;
  wilaya: string;
  baladiya: string;
}

interface Paginated<T> {
  results: T[];
}

const INITIAL_FORM: ProductListingForm = {
  ministry_product_id: "",
  description: "",
  quantityKg: "",
  pricePerUnit: "",
  images: [SAMPLE_UPLOADED_IMAGE],
  season: "summer",
  farm_id: "",
};

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductListingForm>(INITIAL_FORM);
  const [isPublishing, setIsPublishing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  const [ministryProducts, setMinistryProducts] = useState<MinistryProductOption[]>([]);
  const [farms, setFarms] = useState<ApiFarm[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // ── Load metadata ─────────────────────────────────────
  useEffect(() => {
    async function loadMeta() {
      try {
        const [mpRes, farmRes] = await Promise.allSettled([
          ministryProductApi.list(1, 100),
          apiFetch<Paginated<ApiFarm>>("/api/farms/me/"),
        ]);

        const mp = mpRes.status === "fulfilled" ? mpRes.value.results : [];
        const farms = farmRes.status === "fulfilled" ? farmRes.value.results : [];

        setMinistryProducts(mp);
        setFarms(farms);

        setForm((prev) => ({
          ...prev,
          ministry_product_id: mp[0] ? String(mp[0].id) : "",
          farm_id: farms[0] ? String(farms[0].id) : "",
        }));
      } catch {
        setError("Failed to load data. Please refresh.");
      } finally {
        setIsLoadingMeta(false);
      }
    }

    loadMeta();
  }, []);

  // ── Fetch official price range ────────────────────────
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
      } catch {
        setPriceRange(null);
      }
    }

    fetchPrice();

    return () => {
      cancelled = true;
    };
  }, [form.ministry_product_id]);

  // ── Form field handler ────────────────────────────────
  const setField = useCallback(
    <K extends keyof ProductListingForm>(key: K, value: ProductListingForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));

      // clear backend error for this field
      setFieldErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  // ── Submit (Publish) ──────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

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
      fd.append("description", form.description);
      fd.append("unit_price", form.pricePerUnit);
      fd.append("stock", form.quantityKg);
      fd.append("season", form.season);
      fd.append("farm_id", form.farm_id);

      form.images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });

      // price validation
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
  try {
    const body = JSON.parse(err.message);

    if (typeof body === "object" && body !== null) {
      const errors = body as ApiFieldErrors;

      setFieldErrors(errors);

      // 🔥 important: show main business error
      if (errors.ministry_product_id?.length) {
        setError(errors.ministry_product_id[0]);
      }

      return;
    }
  } catch {}

  setError(err.message);
} else {
        setError("Failed to publish. Please try again.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const fieldErrorCount = Object.keys(fieldErrors).length;

  return (
    <div className="min-h-screen bg-background-light">
      <main className="max-w-4xl mx-auto p-4 md:p-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/farmer/dashboard/products">Inventory</Link>
          <span>›</span>
          <span>New Harvest Listing</span>
        </nav>

        {/* Errors */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {fieldErrorCount > 0 && (
          <div className="mb-4 text-orange-500">
            Fix {fieldErrorCount} field error(s)
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-xl">
          <ProductDetailsForm
            form={form}
            onChange={setField}
            ministryProducts={ministryProducts}
            farms={farms}
            isLoadingMeta={isLoadingMeta}
            fieldErrors={fieldErrors}
            priceRange={priceRange}
          />

          {/* Actions */}
          <div className="pt-6 mt-6 border-t flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isPublishing || isLoadingMeta}
              className="px-8 py-2 bg-primary rounded-lg font-bold"
            >
              {isPublishing ? "Publishing..." : "Publish Harvest"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}