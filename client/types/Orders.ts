
export type ApiOrderStatus =
  | "pending"
  | "confirmed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface ApiOrderProduct {
  id:            number;
  title:         string;
  description:   string;
  season:        string;
  unit_price:    string;
  category_name: string;
}

export interface ApiOrderItem {
  id:          number;
  product:     ApiOrderProduct;
  quantity:    number;
  total_price: number;
}

export interface ApiOrder {
  id:               number;
  buyer:            string;   // "BuyerProfile - buyer@email.com"
  farm:             string;   // "farm-name - farmer@email.com"
  total_price:      string;   // decimal string "1050.00"
  status:           ApiOrderStatus;
  created_at:       string;   // ISO 8601
  items:            ApiOrderItem[];
  allowed_statuses: ApiOrderStatus[];  // actions this farmer can take
}

export interface OrdersApiResponse {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  ApiOrder[];
}

export function parseBuyerEmail(raw: string): string {
  const parts = raw.split(" - ");
  return parts.length > 1 ? parts.slice(1).join(" - ") : raw;
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-DZ", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

/** Human-readable status labels */
export const STATUS_LABELS: Record<ApiOrderStatus, string> = {
  pending:    "Pending",
  confirmed:  "Confirmed",
  in_transit: "In Transit",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

/** Tailwind badge classes per status */
export const STATUS_BADGE: Record<ApiOrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed:  "bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-300",
  in_transit: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  delivered:  "bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-300",
  cancelled:  "bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-300",
};

/** Label for the action button when advancing a status */
export const STATUS_ACTION_LABEL: Partial<Record<ApiOrderStatus, string>> = {
  confirmed: "Confirm Order",
  cancelled: "Cancel Order",
};

/** Material icon per status */
export const STATUS_ICON: Record<ApiOrderStatus, string> = {
  pending:    "schedule",
  confirmed:  "check_circle",
  in_transit: "local_shipping",
  delivered:  "inventory",
  cancelled:  "cancel",
};

// ─── Filter type used in the page ────────────────────────────────────────────

export type StatusFilter = "all" | ApiOrderStatus;

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all",        label: "All Statuses" },
  { value: "pending",    label: "Pending" },
  { value: "confirmed",  label: "Confirmed" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered",  label: "Delivered" },
  { value: "cancelled",  label: "Cancelled" },
];