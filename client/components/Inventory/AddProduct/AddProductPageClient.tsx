"use client";

import { useState } from "react";
import Link from "next/link";
import FarmerSidebar from "./FarmSidebar";
import AddProductHeader from "./AddProductHeader";
import ListingStepper from "./ListingStepper";
import ProductDetailsForm from "./ProductDetailsForm";
import type { ListingStep, ProductListingForm } from "@/types/AddProduct";
import { SAMPLE_UPLOADED_IMAGE } from "@/types/AddProduct";

const INITIAL_FORM: ProductListingForm = {
  category: "Grains & Pulses",
  variety: "",
  quantityKg: "",
  pricePerUnit: "",
  harvestDate: "",
  storageCondition: "Cold Storage",
  images: [SAMPLE_UPLOADED_IMAGE],
};

export default function AddProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState<ListingStep>(2);
  const [form, setForm] = useState<ProductListingForm>(INITIAL_FORM);
  const [isPublishing, setIsPublishing] = useState(false);

  const setField = <K extends keyof ProductListingForm>(
    key: K,
    value: ProductListingForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as ListingStep);
  };

  const handleContinue = async () => {
    if (step < 4) {
      setStep((s) => (s + 1) as ListingStep);
      return;
    }
    // Final step → publish
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPublishing(false);
    alert("Harvest published successfully!");
  };

  const handleSaveDraft = () => {
    console.log("Saved draft:", form);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <FarmerSidebar />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
            <Link href="#" className="hover:text-primary transition-colors">
              Inventory
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100">New Harvest Listing</span>
          </nav>

          {/* Stepper */}
          <ListingStepper currentStep={step} />

          {/* Form card */}
          <div className="bg-white dark:bg-background-dark/40 border border-primary/10 rounded-xl shadow-sm p-6 md:p-8">
            <ProductDetailsForm form={form} onChange={setField} />

            {/* Action buttons */}
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
                  onClick={handleSaveDraft}
                  className="px-6 py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isPublishing}
                  className="px-10 py-2.5 rounded-lg bg-primary text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isPublishing ? (
                    <>Publishing…</>
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