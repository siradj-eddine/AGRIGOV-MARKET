'use client';

import { useState, useMemo } from 'react';
import ProductManagementSidebar from './ProductsSidebar';
import ProductsTable from './ProductsTable';
import SummaryStats from './SummaryStats';
import {
  INITIAL_LISTINGS,
  SUMMARY_STAT_DEFS,
  TOTAL_IMPRESSIONS,
} from '@/types/Inventory';
import type {
  ProductListing,
  ListingFilter,
  SummaryStat,
} from '@/types/Inventory';

export default function ProductManagementPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [listings, setListings]         = useState<ProductListing[]>(INITIAL_LISTINGS);
  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<ListingFilter>('All Listings');

  // ── Derived: filtered table rows ──────────────────────────────────────────
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesFilter =
        activeFilter === 'All Listings' || l.status === activeFilter;
      const matchesSearch =
        search.trim() === '' ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.variety.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [listings, activeFilter, search]);

  // ── Derived: summary stat values ──────────────────────────────────────────
  const summaryStats: SummaryStat[] = useMemo(() => {
    const activeCount = listings.filter((l) => l.status === 'Active').length;

    // Total value = sum of listPrice × quantity for all non-out-of-stock
    const totalValue = listings
      .filter((l) => l.status !== 'Out of Stock')
      .reduce((acc, l) => acc + l.listPrice * l.quantity, 0);

    return [
      {
        ...SUMMARY_STAT_DEFS[0],
        value: String(activeCount),
      },
      {
        ...SUMMARY_STAT_DEFS[1],
        value: `$${totalValue.toLocaleString('en-US', {
          minimumFractionDigits:  2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        ...SUMMARY_STAT_DEFS[2],
        value: TOTAL_IMPRESSIONS,
      },
    ];
  }, [listings]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleEdit(id: string) {
    // TODO: open edit drawer / navigate to edit form
    console.log('Edit listing:', id);
  }

  function handleSecondAction(id: string) {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    if (listing.status === 'Draft') {
      // Delete draft
      setListings((prev) => prev.filter((l) => l.id !== id));
    } else {
      // Deactivate → set Out of Stock
      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: 'Out of Stock' as const } : l,
        ),
      );
    }
  }

  function handleFilterChange(filter: ListingFilter) {
    setActiveFilter(filter);
  }

  function handleAddNew() {
    // TODO: navigate to /inventory/new or open modal
    console.log('Add new listing');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <div className="flex h-full flex-col">
        {/* Top Nav — receives controlled search state */}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <ProductManagementSidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col p-4 md:p-8 bg-background-light dark:bg-background-dark max-w-7xl mx-auto w-full overflow-y-auto">
            <ProductsTable
              listings={filteredListings}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              onEdit={handleEdit}
              onSecondAction={handleSecondAction}
              onAddNew={handleAddNew}
            />

            <SummaryStats stats={summaryStats} />
          </main>
        </div>
      </div>
    </div>
  );
}