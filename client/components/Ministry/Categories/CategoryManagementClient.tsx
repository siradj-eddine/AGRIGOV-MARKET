'use client';

import { useState, useMemo } from 'react';
import CategorySidebar from './CategorySidebar';
import CategoryTable from './CategoryTable';
import QualityStandardsPanel from './QualityStandards';
import CertificationsPanel from './Certifications';
import {
  INITIAL_CATEGORIES,
  INITIAL_QUALITY_STANDARDS,
  CERTIFICATIONS,
} from '@/types/CategoryManagement';
import type { Category, QualityStandard } from '@/types/CategoryManagement';

export default function CategoryManagementPage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [standards, setStandards]   = useState<QualityStandard[]>(INITIAL_QUALITY_STANDARDS);
  const [isCreating, setIsCreating] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────
  const filteredCategories = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categories, search],
  );

  function handleEdit(id: string) {
    // TODO: open edit modal/drawer — stub for now
    console.log('Edit category:', id);
  }

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddStandard() {
    // TODO: open add-standard modal — stub
    console.log('Add new quality standard');
  }

  function handleConfigureStandard(id: string) {
    // TODO: open configure modal — stub
    console.log('Configure standard:', id);
  }

  function handleEditCertification(id: string) {
    // TODO: open certification edit modal — stub
    console.log('Edit certification:', id);
  }

  async function handleCreateCategory() {
    setIsCreating(true);
    // TODO: open create modal / navigate to form
    await new Promise((r) => setTimeout(r, 600));
    setIsCreating(false);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <CategorySidebar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background-dark">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Category Management</h2>
              <p className="text-sm text-slate-500">
                Manage agricultural classifications and quality metrics
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden lg:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm outline-none"
                  aria-label="Search categories"
                />
              </div>

              {/* Create */}
              <button
                onClick={handleCreateCategory}
                disabled={isCreating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isCreating ? (
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-xl">add</span>
                )}
                Create New Category
              </button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Category Table */}
          <CategoryTable
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QualityStandardsPanel
              standards={standards}
              onAddStandard={handleAddStandard}
              onConfigureStandard={handleConfigureStandard}
            />
            <CertificationsPanel
              certifications={CERTIFICATIONS}
              onEdit={handleEditCertification}
            />
          </div>
        </div>
      </main>
    </div>
  );
}