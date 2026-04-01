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