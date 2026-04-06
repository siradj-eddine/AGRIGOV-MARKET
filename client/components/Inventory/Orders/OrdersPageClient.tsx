"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import OrdersFilters from "@/components/Inventory/Orders/OrderFilters";
import OrdersTable from "@/components/Inventory/Orders/OrdersTable";
import InvoicePanel from "@/components/Inventory/Orders/InvoicePanel";
import Breadcrumb from "@/components/Cart/BreadCrumb";
import type { ApiOrder, ApiOrderStatus, StatusFilter } from "@/types/Orders";
import { farmerOrderApi, ApiError } from "@/lib/api";

const PAGE_SIZE = 5;

const crumbs = [
  { label: "Home",      href: "#" },
  { label: "Dashboard", href: "#" },
  { label: "Order History" },
];

export default function OrderHistoryPage() {
  // ── filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [date,   setDate]   = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page,   setPage]   = useState(1);

  // ── data ──────────────────────────────────────────────────────────────────
  const [orders,      setOrders]      = useState<ApiOrder[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [loadError,   setLoadError]   = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  // ── status update ─────────────────────────────────────────────────────────
  const [isUpdating,  setIsUpdating]  = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch orders ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    farmerOrderApi.list({
      page,
      page_size: PAGE_SIZE,
      search:    search.trim() || undefined,
      status:    status !== "all" ? (status as ApiOrderStatus) : undefined,
      ordering:  "-created_at",
    })
      .then((data) => {
        if (cancelledRef.current) return;
        setOrders(data.results);
        setTotalCount(data.count);
        // Keep selection in sync: update if selected order is still in page,
        // or auto-select first result on first load
        setSelectedOrder((prev) => {
          if (!prev) return data.results[0] ?? null;
          const fresh = data.results.find((o) => o.id === prev.id);
          return fresh ?? data.results[0] ?? null;
        });
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Failed to load orders. Please try again.",
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, [page, search, status]);

  useEffect(fetchOrders, [fetchOrders]);

  // ── filter/search handlers (reset page) ───────────────────────────────────
  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  }, []);

  // ── status advance ────────────────────────────────────────────────────────
  const handleStatusAdvance = useCallback(
    async (orderId: number, nextStatus: ApiOrderStatus) => {
      setUpdateError(null);
      setIsUpdating(true);

      // Optimistic update
      const updateList = (list: ApiOrder[]) =>
        list.map((o) =>
          o.id === orderId
            ? { ...o, status: nextStatus, allowed_statuses: [] }
            : o,
        );

      setOrders((prev) => updateList(prev));
      setSelectedOrder((prev) =>
        prev?.id === orderId
          ? { ...prev, status: nextStatus, allowed_statuses: [] }
          : prev,
      );

      try {
        await farmerOrderApi.updateStatus(orderId, nextStatus);
        setToast(`Order #${orderId} marked as ${nextStatus}.`);
        setTimeout(() => setToast(null), 3000);
        // Soft-refresh to get latest state from server
        fetchOrders();
      } catch (err) {
        // Rollback on error — re-fetch
        setUpdateError(
          err instanceof ApiError ? err.message : "Failed to update order status.",
        );
        fetchOrders();
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchOrders],
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-100 min-h-screen flex flex-col">
      <main className="flex-1 py-8 ">
        <div className="max-w-7xl mx-auto w-full px-4 ">
          {/* Breadcrumb + header */}
          <div className="mb-8">
            <Breadcrumb crumbs={crumbs} />

            <div className="sm:flex sm:items-center sm:justify-between mt-3">
              <div>
                <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                  Order History &amp; Invoices
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track incoming buyer orders, confirm shipments, and download official invoices.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <span className="material-icons text-base">refresh</span>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Load error banner */}
          {loadError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-icons mt-0.5 shrink-0">error</span>
              <span className="flex-1">{loadError}</span>
              <button
                type="button"
                onClick={() => { setLoadError(null); fetchOrders(); }}
                className="shrink-0 text-red-400 hover:text-red-600 font-semibold text-xs underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Update error banner */}
          {updateError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-700 dark:text-orange-300"
            >
              <span className="material-icons mt-0.5 shrink-0">warning</span>
              <span className="flex-1">{updateError}</span>
              <button
                type="button"
                onClick={() => setUpdateError(null)}
                aria-label="Dismiss"
                className="shrink-0"
              >
                <span className="material-icons text-base">close</span>
              </button>
            </div>
          )}

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
              orders={orders}
              selectedId={selectedOrder?.id ?? null}
              page={page}
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
              isLoading={isLoading}
              onSelect={setSelectedOrder}
              onPageChange={setPage}
            />

            {selectedOrder ? (
              <InvoicePanel
                order={selectedOrder}
                isUpdating={isUpdating}
                onStatusAdvance={handleStatusAdvance}
              />
            ) : (
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center text-gray-400 text-sm flex flex-col items-center justify-center min-h-75">
                <span className="material-icons text-4xl mb-3 opacity-40">receipt_long</span>
                <p>Select an order to preview its details.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Success toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in"
        >
          <span className="material-icons text-primary text-base">check_circle</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}