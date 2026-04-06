"use client";

import { useState } from "react";
import type { SpecTab } from "@/types/ProductDetails";
import type { ApiProduct } from "@/types/Product";
import { SEASON_LABELS } from "@/types/Product";

const TABS: SpecTab[] = ["Specifications", "Harvest Details", "Quality Certificates"];

interface Props {
  product: ApiProduct;
}

export default function SpecsTabPanel({ product }: Props) {
  const [activeTab, setActiveTab] = useState<SpecTab>("Specifications");

  /** Build spec rows from the real API fields */
  const specs = [
    { label: "Category",      value: product.category_name                              },
    { label: "Season",        value: SEASON_LABELS[product.season]                      },
    { label: "Unit Price",    value: `${parseFloat(product.unit_price).toLocaleString("fr-DZ")} DZD` },
    { label: "Stock",         value: `${product.stock} units`                           },
    { label: "Farm",          value: product.farm?.name ?? "—"                     },
    { label: "Wilaya",        value: product.farm?.wilaya    ?? "—"                     },
    { label: "Baladiya",      value: product.farm?.baladiya  ?? "—"                     },
    ...(product.average_rating
      ? [{ label: "Rating", value: `${parseFloat(product.average_rating).toFixed(1)} / 5` }]
      : []),
    { label: "Listed On",     value: new Date(product.created_at).toLocaleDateString("en-DZ", { dateStyle: "medium" }) },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Tab bar */}
      <div className="border-b border-neutral-100">
        <nav aria-label="Product detail tabs" className="flex -mb-px px-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors first:pl-1 ${
                activeTab === tab
                  ? "border-primary text-primary-dark"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "Specifications" && (
          <>
            <h3 className="text-base font-bold text-gray-900 mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between py-3 border-b border-dashed border-neutral-100"
                >
                  <span className="text-sm text-gray-500">{spec.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right ml-4">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </>
        )}

        {activeTab === "Harvest Details" && (
          <div className="py-6 text-center text-gray-400 text-sm">
            <span
              className="material-symbols-outlined text-4xl mb-3 block text-neutral-300"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              eco
            </span>
            <p className="font-medium text-neutral-500">Harvest details coming soon.</p>
            <p className="text-xs mt-1">Season records and field reports will appear here.</p>
          </div>
        )}

        {activeTab === "Quality Certificates" && (
          <div className="py-6 text-center text-gray-400 text-sm">
            <span
              className="material-symbols-outlined text-4xl mb-3 block text-neutral-300"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              workspace_premium
            </span>
            <p className="font-medium text-neutral-500">No certificates attached yet.</p>
            <p className="text-xs mt-1">Official lab reports will appear here once uploaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}