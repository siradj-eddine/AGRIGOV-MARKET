'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import CoreIdentificationCard from './CoreIdentification';
import RegionalVariationsCard from './RegionalVariationsCard';
import QualityStandardsCard from './QualityStandards';
import RegistryCertificationCard from './RegistryCertifications';
import {
  INITIAL_FORM,
  INITIAL_REGIONS,
  QUALITY_STANDARDS,
  CERTIFYING_OFFICIAL,
  COMMODITY_IMAGE_URL,
  ADMIN_AVATAR_URL,
  TOP_NAV,
  SIDEBAR_NAV,
} from '@/types/AddOfficialPrice';
import type { CommodityForm, RegionVariation } from '@/types/AddOfficialPrice';

export default function CommodityEntryPage() {
  const [form, setForm]       = useState<CommodityForm>(INITIAL_FORM);
  const [regions, setRegions] = useState<RegionVariation[]>(INITIAL_REGIONS);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast]       = useState(false);

  const handleFormChange = useCallback(
    (field: keyof CommodityForm, value: string | number) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handleRegionChange = useCallback(
    (id: string, field: keyof RegionVariation, value: string | number) =>
      setRegions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
      ),
    [],
  );

  function handleAddRegion() {
    const id = `region-${Date.now()}`;
    setRegions((prev) => [
      ...prev,
      { id, regionName: 'New Region', priceAdjust: '+0.0%', yieldPercent: 50 },
    ]);
  }

  function handleRemoveRegion(id: string) {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  }

  function handleDiscard() {
    setForm(INITIAL_FORM);
    setRegions(INITIAL_REGIONS);
  }

  async function handlePublish() {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPublishing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm border-b border-primary/10">
        <span className="text-xl font-extrabold text-primary italic">Harvest Intel</span>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-4" aria-label="Top navigation">
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={
                  item.active
                    ? 'text-primary font-semibold text-lg tracking-tight px-3 py-1'
                    : 'text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-3 py-1 rounded-xl'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button aria-label="View notifications" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary">notifications</span>
            </button>
            <button aria-label="Open settings" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 relative ml-2">
              <Image src={ADMIN_AVATAR_URL} alt="Admin profile avatar" fill sizes="32px" className="object-cover" priority />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 py-4 space-y-2 pt-20">
        <div className="px-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl">Modern Homestead</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Agri-Management System</p>
        </div>
        {SIDEBAR_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 flex items-center gap-3 text-sm font-semibold tracking-wide uppercase'
                : 'text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-primary/10 hover:text-primary rounded-xl flex items-center gap-3 transition-all duration-200 text-sm font-medium tracking-wide uppercase'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-6 border-t border-primary/10 px-2">
          <Link href="#" className="text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-primary/10 hover:text-primary rounded-xl flex items-center gap-3 text-sm font-medium tracking-wide uppercase">
            <span className="material-symbols-outlined">help</span>
            Help
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="md:ml-64 pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
              Admin Portal
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">Commodity Pricing Index</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              Official administrative entry for the national agricultural price registry. Ensure all data reflects verified Ministry metrics.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDiscard}
              className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Discard Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-sm active:scale-95 transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
            >
              {isPublishing && (
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              )}
              Publish Entry
            </button>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <CoreIdentificationCard form={form} onChange={handleFormChange} />
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

      {/* Toast */}
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
            <p className="text-xs text-slate-500">Commodity has been added to the public index successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}