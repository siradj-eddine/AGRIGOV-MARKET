"use client";

import { useState, useMemo } from "react";
import OrdersNavbar from "@/components/Inventory/Orders/OrderNavbar";
import OrdersFilters from "@/components/Inventory/Orders/OrderFilters";
import OrdersTable from "@/components/Inventory/Orders/OrdersTable";
import InvoicePanel from "@/components/Inventory/Orders/InvoicePanel";
import Breadcrumb  from "@/components/Cart/BreadCrumb";
import type { Order, OrderStatus } from "@/types/Orders";
import { orders, invoiceDetails } from "@/types/Orders";

type StatusFilter = "All Statuses" | OrderStatus;
const PAGE_SIZE = 5;

export default function OrderHistoryPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All Statuses");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q);
      const matchStatus = status === "All Statuses" || o.status === status;
      return matchSearch && matchStatus;
    });
  }, [search, status]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusChange = (v: StatusFilter) => { setStatus(v); setPage(1); };

  const invoice = selectedOrder ? invoiceDetails[selectedOrder.id] ?? null : null;

  const crumbs = [
    { label: "Home", href: "#" },
    { label: "Dashboard", href: "#" },
    { label: "Order History" },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-100 min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb + header */}
          <div className="mb-8">
            <Breadcrumb crumbs={crumbs} />

            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                  Order History &amp; Invoices
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your past purchases, track shipments, and download official tax invoices.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <span className="material-icons mr-2 text-lg">add</span>
                  Create New Request
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <OrdersFilters
            search={search}
            date={date}
            status={status}
            onSearchChange={handleSearchChange}
            onDateChange={setDate}
            onStatusChange={handleStatusChange}
          />

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <OrdersTable
              orders={paginated}
              selectedId={selectedOrder?.id ?? null}
              page={page}
              totalCount={filtered.length}
              pageSize={PAGE_SIZE}
              onSelect={setSelectedOrder}
              onPageChange={setPage}
            />

            {invoice ? (
              <InvoicePanel invoice={invoice} />
            ) : (
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center text-gray-400 text-sm flex flex-col items-center justify-center">
                <span className="material-icons text-4xl mb-3">receipt_long</span>
                <p>Select an order to preview its invoice.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}