"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { ApiProduct } from "@/types/Product";
import { DEFAULT_LOGISTICS } from "@/types/ProductDetails";

import ProductGallery       from "@/components/Products/Details/ProductGallerie";
import SpecsTabPanel        from "@/components/Products/Details/SpecsPanel";
import PurchaseCard         from "@/components/Products/Details/PurchaseCard";
import FarmerProfileWidget  from "@/components/Products/Details/FarmerProfileWidget";
import OriginLogisticsPanel from "@/components/Products/Details/LogisticsPanel";

interface Props {
  productId: string;
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 w-48 bg-neutral-200 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video w-full bg-neutral-200 rounded-xl" />
          <div className="h-48 bg-neutral-100 rounded-xl" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-80 bg-neutral-100 rounded-xl" />
          <div className="h-40 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ productId }: Props) {
  const [product,   setProduct]   = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await productApi.detail(productId);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof ApiError ? err.message : "Failed to load this product.",
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [productId]);

  const crumbs = [
    { label: "Marketplace", href: "/marketplace" },
    ...(product
      ? [{ label: product.category.name, href: `/marketplace?category=${product.category.slug}` }]
      : []),
    { label: product?.title ?? "Loading…" },
  ];

  if (!isLoading && error) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-sm">
          <span className="material-symbols-outlined text-5xl text-neutral-300 block"
            style={{ fontVariationSettings: "'FILL' 0" }}>
            error
          </span>
          <p className="text-lg font-semibold text-gray-900">Something went wrong</p>
          <p className="text-sm text-gray-500">{error}</p>
          <Link href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black text-sm font-bold">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-gray-800 min-h-screen flex flex-col">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-200">/</span>}
                {"href" in crumb ? (
                  <Link href={(crumb as any).href} className="text-gray-400 hover:text-primary-dark transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-gray-900 truncate max-w-xs">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {isLoading ? (
        <DetailSkeleton />
      ) : product ? (
        <main className="grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <ProductGallery
                  images={product.images}
                  title={product.title}
                  inStock={product.in_stock}
                  rating={product.average_rating}
                />
                <SpecsTabPanel product={product} />
              </div>
              <div className="lg:col-span-4 space-y-5">
                {/* PurchaseCard now manages its own cart interaction internally */}
                <PurchaseCard product={product} />
                <FarmerProfileWidget farm={product.farm} />
              </div>
            </div>
            <div className="mt-8">
              <OriginLogisticsPanel
                mapImageUrl={null}
                warehouseLabel={`${product.farm?.wilaya ?? "Algeria"} Warehouse`}
                logistics={DEFAULT_LOGISTICS}
              />
            </div>
          </div>
        </main>
      ) : null}

      <footer className="bg-white border-t border-neutral-100 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                agriculture
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Ministry of Agriculture</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} National Agricultural Platform — A Government Initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}