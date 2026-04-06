import type { ApiOrder } from "@/types/Orders";
import { parseBuyerEmail, formatOrderDate } from "@/types/Orders";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orders:       ApiOrder[];
  selectedId:   number | null;
  page:         number;
  totalCount:   number;
  pageSize:     number;
  isLoading:    boolean;
  onSelect:     (order: ApiOrder) => void;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW = 3;

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          {i === 2 && <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mt-2" />}
        </td>
      ))}
    </tr>
  );
}

export default function OrdersTable({
  orders, selectedId, page, totalCount, pageSize, isLoading, onSelect, onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalCount);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {["Order ID", "Date & Buyer", "Product", "Amount", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                      i === 5 ? "relative" : "text-left"
                    }`}
                  >
                    {h || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    <span className="material-icons text-3xl block mb-2 opacity-40">
                      inbox
                    </span>
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isSelected  = selectedId === order.id;
                  const buyerEmail  = parseBuyerEmail(order.buyer);
                  // Show the first item's product title; if multiple items show count
                  const productTitle = order.items[0]?.product.title ?? "—";
                  const extraItems   = order.items.length - 1;
                  const totalDZD = parseFloat(order.total_price).toLocaleString("fr-DZ", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelect(order)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Order ID */}
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold ${
                          isSelected
                            ? "text-primary"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        #{order.id}
                      </td>

                      {/* Date & Buyer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatOrderDate(order.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-40">
                          {buyerEmail}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {productTitle}
                        </div>
                        <div className="text-xs text-gray-500">
                          {extraItems > 0
                            ? `+${extraItems} more item${extraItems > 1 ? "s" : ""}`
                            : `×${order.items[0]?.quantity ?? 0} units`}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-medium">
                        {totalDZD} <span className="text-xs text-gray-400">DZD</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      {/* Chevron */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span
                          className={`material-icons transition-colors ${
                            isSelected ? "text-primary" : "text-gray-400 hover:text-primary"
                          }`}
                        >
                          chevron_right
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalCount}</span> results
          </p>

          <nav
            aria-label="Pagination"
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <span className="material-icons text-sm">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(totalPages, PAGE_WINDOW) }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onPageChange(n)}
                  disabled={isLoading}
                  aria-current={n === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                    n === page
                      ? "z-10 bg-primary/20 border-primary text-primary"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {n}
                </button>
              ),
            )}

            {totalPages > PAGE_WINDOW && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                …
              </span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Next</span>
              <span className="material-icons text-sm">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}