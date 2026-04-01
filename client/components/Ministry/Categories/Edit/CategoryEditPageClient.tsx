'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import CategoryEditSidebar from './Sidebar';
import CoreDefinitionCard from './CoreDefinitionCard';
import QualityMetricsCard from './QualityMetricsCard';
import CertificationsCard from './CertificationsCard';
import SubCategoriesCard from './SubcategoryCard';
import CategoryEditMobileNav from './Mobilenav';
import {
  INITIAL_FORM,
  INITIAL_METRICS,
  INITIAL_CERTIFICATIONS,
  INITIAL_SUBCATEGORIES,
  BREADCRUMBS,
  TOP_NAV,
  ADMIN_AVATAR_URL,
  LAST_MODIFIED,
} from '@/types/EditCategory';
import type { CategoryForm, Certification } from '@/types/EditCategory';

export default function CategoryEditPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [form, setForm]                   = useState<CategoryForm>(INITIAL_FORM);
  const [metrics, setMetrics]             = useState(INITIAL_METRICS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [subCategories, setSubCategories] = useState(INITIAL_SUBCATEGORIES);
  const [isSaving, setIsSaving]           = useState(false);
  const [isVisible, setIsVisible]         = useState(true);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFormChange = useCallback(
    (field: keyof CategoryForm, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  function handleDiscard() {
    setForm(INITIAL_FORM);
    setMetrics(INITIAL_METRICS);
    setCertifications(INITIAL_CERTIFICATIONS);
    setSubCategories(INITIAL_SUBCATEGORIES);
  }

  async function handleSave() {
    setIsSaving(true);
    // TODO: call API to persist category
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
  }

  function handleRemoveCert(id: string) {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddCert() {
    // TODO: open cert picker modal
    console.log('Add certification');
  }

  function handleAddMetric() {
    // TODO: open metric form modal
    console.log('Add quality metric');
  }

  function handleEditSubCategory(id: string) {
    // TODO: navigate or open sub-category editor
    console.log('Edit sub-category:', id);
  }

  function handleAddSubCategory() {
    // TODO: open sub-category creation form
    console.log('Add sub-category');
  }

  function handleDelete() {
    // TODO: confirm delete dialog
    console.log('Delete category');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Sidebar */}
      <CategoryEditSidebar />

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">

          {/* Breadcrumbs + page header */}
          <div className="mb-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              {BREADCRUMBS.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i < BREADCRUMBS.length - 1 ? (
                    <>
                      <span className="hover:text-primary cursor-pointer transition-colors">{crumb}</span>
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </>
                  ) : (
                    <span className="text-slate-900 dark:text-slate-100 font-medium">{crumb}</span>
                  )}
                </span>
              ))}
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                  Edit Category:{' '}
                  <span className="text-primary italic">{form.name}</span>
                </h1>
                <p className="text-slate-500 max-w-xl">
                  Configure regulatory standards, quality benchmarks, and taxonomic structures for
                  all cereal and grain products within the national harvest registry.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDiscard}
                  className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-xl bg-primary text-slate-900 font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                  )}
                  Save Category
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="md:col-span-7 space-y-6">
              <CoreDefinitionCard form={form} onChange={handleFormChange} />
              <QualityMetricsCard metrics={metrics} onAddMetric={handleAddMetric} />
            </div>

            {/* Right column */}
            <div className="md:col-span-5 space-y-6">
              <CertificationsCard
                certifications={certifications}
                onRemove={handleRemoveCert}
                onAdd={handleAddCert}
              />
              <SubCategoriesCard
                subCategories={subCategories}
                onEdit={handleEditSubCategory}
                onAdd={handleAddSubCategory}
              />
              {/* Advanced Metadata card */}
              <section className="relative overflow-hidden rounded-xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-primary/10 shadow-sm">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-primary">Advanced Metadata</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Configure harvest seasonality and shelf-life triggers.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 pb-20">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-400">history</span>
              <p className="text-sm text-slate-500 italic">
                Last modified by{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {LAST_MODIFIED.by}
                </span>{' '}
                on {LAST_MODIFIED.date}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Visibility status */}
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                  Visibility Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVisible ? 'bg-primary animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {isVisible ? 'Publicly Visible' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => setIsVisible((v) => !v)}
                    aria-label="Toggle category visibility"
                    className="text-xs text-primary font-bold hover:underline ml-1"
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={handleDelete}
                aria-label="Delete category"
                className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <CategoryEditMobileNav />
    </div>
  );
}