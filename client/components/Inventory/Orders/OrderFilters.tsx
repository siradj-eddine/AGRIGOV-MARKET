"use client";

import type { StatusFilter } from "@/types/Orders";
import { STATUS_FILTER_OPTIONS } from "@/types/Orders";

interface Props {
  search:         string;
  date:           string;
  status:         StatusFilter;
  onSearchChange: (v: string) => void;
  onDateChange:   (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
}

export default function OrdersFilters({
  search, date, status,
  onSearchChange, onDateChange, onStatusChange,
}: Props) {
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass =
    "focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-md py-2 px-3 outline-none transition-colors";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-5">
          <label htmlFor="orders-search" className={labelClass}>
            Search Orders
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-[20px]">search</span>
            </div>
            <input
              id="orders-search"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Order ID, buyer email, or product"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-3">
          <label htmlFor="orders-date" className={labelClass}>
            Date From
          </label>
          <input
            id="orders-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Status */}
        <div className="md:col-span-3">
          <label htmlFor="orders-status" className={labelClass}>
            Status
          </label>
          <select
            id="orders-status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className={inputClass}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            aria-label="Advanced filters"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 w-full flex items-center justify-center transition-colors"
          >
            <span className="material-icons text-[20px]">filter_list</span>
          </button>
        </div>
      </div>
    </div>
  );
}