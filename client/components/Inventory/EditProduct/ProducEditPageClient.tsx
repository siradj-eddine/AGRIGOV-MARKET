'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import ProductEditSidebar from './ProducteditSidebar';
import ProductGalleryCard from './ProductGallery';
import CropSpecificationsCard from './CropsSpecifications';
import MarketPricingCard from './Pricing';
import { InventoryStatusCard, MarketExpertCard } from './InventoryStatusCard';
import {
  INITIAL_FORM,
  PRODUCT_IMAGES,
  MARKET_REFERENCE,
  INVENTORY_STATUSES,
  BREADCRUMBS,
  TOP_NAV,
  FARMER_AVATAR_URL,
} from '@/types/ProductEdit';
import type { ProductForm } from '@/types/ProductEdit';

export default function ProductEditPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [form, setForm]           = useState<ProductForm>(INITIAL_FORM);
  const [isSaving, setIsSaving]   = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof ProductForm, value: string | number) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handlePriceChange = useCallback(
    (field: 'askingPrice' | 'minPrice', value: number) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  function handleDiscard() {
    setForm(INITIAL_FORM);
  }

  async function handleSave() {
    setIsSaving(true);
    // TODO: call API to persist product
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm border-b border-primary/10">
        <span className="text-xl font-extrabold text-primary italic">Harvest Intel</span>

        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 font-bold text-lg tracking-tight">
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={
                  item.active
                    ? 'text-primary font-semibold px-3 py-1 rounded-xl'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-3 py-1 rounded-xl'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Icon buttons + avatar */}
          <div className="flex items-center gap-3">
            <button
              aria-label="View notifications"
              className="p-2 text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              aria-label="Open settings"
              className="p-2 text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 relative">
              <Image
                src={FARMER_AVATAR_URL}
                alt="Farmer profile avatar"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <ProductEditSidebar />

      {/* Main Content */}
      <main className="md:ml-64 pt-24 pb-12 px-4 md:px-12">
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
                  {form.name}
                </span>{' '}
                batch #4402
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleDiscard}
                className="px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — media + specs */}
            <div className="lg:col-span-2 space-y-6">
              <ProductGalleryCard
                images={PRODUCT_IMAGES}
                onEditPrimary={() => console.log('Edit primary image')}
                onAddImage={() => console.log('Add image')}
              />
              <CropSpecificationsCard form={form} onChange={handleChange} />
            </div>

            {/* Right column — pricing + status */}
            <div className="space-y-6">
              <MarketPricingCard
                form={form}
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