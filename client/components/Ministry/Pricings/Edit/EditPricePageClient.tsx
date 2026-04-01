'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import PriceSummaryCard from './PricesSummary';
import PriceTrendChart from './PriceTrandsChart';
import PriceRevisionCard from './PriceRevisionCard';
import {
  TOP_NAV,
  SIDEBAR_NAV,
  BREADCRUMBS,
  COMMODITY_NAME,
  COMMODITY_ID,
  CURRENT_PRICE,
  PRICE_UNIT,
  QUARTER_DELTA_PCT,
  MARKET_HEALTH_BARS,
  CHART_BARS,
  CHART_RANGES,
  CROP_SPEC,
  INITIAL_FORM,
  PRICE_ADMIN_AVATAR,
} from '@/types/EditOfficalPrice';
import type { ChartRange, PriceRevisionForm } from '@/types/EditOfficalPrice';

export default function PriceManagementPage() {
  const [activeRange, setActiveRange] = useState<ChartRange>('1Y');
  const [form, setForm]               = useState<PriceRevisionForm>(INITIAL_FORM);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast]       = useState(false);

  function handleFormChange(field: keyof PriceRevisionForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 py-4 space-y-2 pt-20">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">Modern Homestead</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Agri-Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2" aria-label="Sidebar navigation">
          {SIDEBAR_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'flex items-center gap-3 bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 text-sm font-semibold tracking-wide uppercase'
                  : 'flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 text-sm font-medium tracking-wide uppercase'
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 mt-auto">
          <button className="w-full bg-primary text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add_circle</span>
            New Record
          </button>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
          {[{ label: 'Help', icon: 'help', href: '#' }, { label: 'Logout', icon: 'logout', href: '#' }].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium tracking-wide uppercase">
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Breadcrumbs + title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              {BREADCRUMBS.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i < BREADCRUMBS.length - 1 ? (
                    <>
                      <span className="hover:text-primary cursor-pointer transition-colors">{crumb}</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </>
                  ) : (
                    <span className="text-primary font-bold">{crumb}</span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{COMMODITY_NAME}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase">
              Live Market Data
            </span>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold uppercase">
              ID: {COMMODITY_ID}
            </span>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-6">
            <PriceSummaryCard
              currentPrice={CURRENT_PRICE}
              priceUnit={PRICE_UNIT}
              quarterDeltaPct={QUARTER_DELTA_PCT}
              healthBars={MARKET_HEALTH_BARS}
            />
          </div>

          <PriceTrendChart
            bars={CHART_BARS}
            ranges={CHART_RANGES}
            activeRange={activeRange}
            onRangeChange={setActiveRange}
          />

          <PriceRevisionCard
            form={form}
            cropSpec={CROP_SPEC}
            currentPrice={CURRENT_PRICE}
            onChange={handleFormChange}
            onPublish={handlePublish}
            isPublishing={isPublishing}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase text-slate-500">Live Server Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-sm">security</span>
              <span className="text-[10px] font-black uppercase text-slate-500">AES-256 Compliant</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Ministry of Digital Agriculture • Protocol v4.2.1
          </div>
        </footer>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={handlePublish}
        aria-label="Edit price"
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">edit</span>
      </button>

      {/* Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 right-8 bg-white dark:bg-slate-900 border border-primary/20 shadow-sm rounded-2xl p-6 flex items-center gap-4 z-50 max-w-sm"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Price Published</h4>
            <p className="text-xs text-slate-500">New price submitted to National Portal successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}