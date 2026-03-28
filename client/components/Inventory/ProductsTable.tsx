import Image from 'next/image';
import type { ProductListing, ListingFilter } from '@/types/Inventory';
import {
  LISTING_FILTERS,
  STATUS_STYLES,
  ACTION_ICON,
} from '@/types/Inventory';

interface ProductsTableProps {
  listings:       ProductListing[];
  activeFilter:   ListingFilter;
  onFilterChange: (filter: ListingFilter) => void;
  onEdit:         (id: string) => void;
  onSecondAction: (id: string) => void; // deactivate or delete depending on status
  onAddNew:       () => void;
}

export default function ProductsTable({
  listings,
  activeFilter,
  onFilterChange,
  onEdit,
  onSecondAction,
  onAddNew,
}: ProductsTableProps) {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Product Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
            Review and manage your marketplace listings
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-slate-900 text-sm font-bold hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter listings by status"
        className="flex gap-3 mb-6 overflow-x-auto pb-2"
      >
        {LISTING_FILTERS.map((filter) => (
          <button
            key={filter}
            role="tab"
            aria-pressed={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
            className={
              activeFilter === filter
                ? 'flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-slate-900 px-6 text-sm font-bold shadow-sm shadow-primary/20 transition-all'
                : 'flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-primary/20 px-6 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-all'
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                {[
                  { label: 'Product',                  align: '' },
                  { label: 'Type & Variety',            align: '' },
                  { label: 'Current Quantity',          align: 'text-center' },
                  { label: 'Price (List / Market)',     align: '' },
                  { label: 'Status',                   align: 'text-center' },
                  { label: 'Actions',                  align: 'text-right' },
                ].map(({ label, align }) => (
                  <th
                    key={label}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${align}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {listings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                  >
                    No listings match the current filter.
                  </td>
                </tr>
              ) : (
                listings.map((listing) => {
                  const styles    = STATUS_STYLES[listing.status];
                  const action2   = ACTION_ICON[listing.status];
                  const formattedQty =
                    listing.quantity.toLocaleString() + ' ' + listing.unit;

                  return (
                    <tr
                      key={listing.id}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      {/* Product image + name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`size-12 rounded-lg overflow-hidden border border-primary/20 relative shrink-0 ${styles.imageClass}`}
                          >
                            <Image
                              src={listing.imageUrl}
                              alt={listing.imageAlt}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <span className={`font-bold ${styles.textClass}`}>
                            {listing.name}
                          </span>
                        </div>
                      </td>

                      {/* Type & Variety */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${styles.textClass}`}>
                            {listing.type}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Variety: {listing.variety}
                          </span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${styles.qtyBadge}`}
                        >
                          {formattedQty}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${styles.textClass}`}>
                            ${listing.listPrice.toFixed(2)} / {listing.unit}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ${listing.marketPrice.toFixed(2)} Market
                          </span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles.badge}`}
                        >
                          {listing.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            aria-label={`Edit ${listing.name}`}
                            title="Edit Listing"
                            onClick={() => onEdit(listing.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            aria-label={`${action2.title}: ${listing.name}`}
                            title={action2.title}
                            onClick={() => onSecondAction(listing.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <span className="material-symbols-outlined">{action2.icon}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}