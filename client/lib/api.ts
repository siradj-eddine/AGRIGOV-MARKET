
import type { ApiProduct, FilterState, SortOption, PaginatedResponse } from "@/types/Product";
import { SORT_TO_ORDERING as SORT_MAP } from "@/types/Product";
import type {
  CartResponse,
  AddItemRequest,
  UpdateQuantityRequest,
  RemoveItemRequest,
} from "@/types/Cart";
import type { CheckoutResponse } from "@/types/Checkout";
import type {
  MeResponse,
  EditableUserFields,
  ChangePasswordFields,
  OrderSummary,
  ReviewSummary,
  MissionSummary,
} from "@/types/Profile";
import { PaginatedProducts } from "@/types/Inventory";
import type { OrdersApiResponse, ApiOrderStatus } from "@/types/Orders";
import type { ApiDashboardResponse, ApiPendingUsersResponse, ApiPendingUser } from "@/types/UserManagement";
import type { ApiUserDetailResponse, ApiValidateResponse, ApiRejectResponse } from "@/types/UserValidation";

import type { 
  TransportRequest, 
  ActiveMission, 
  MissionStatus 
} from "@/types/Transporter";

import type { CategoriesApiResponse, ApiCategory, CategoryPayload } from "@/types/CategoryManagement";
 
const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

// ─── Typed error ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  const isFormData = options.body instanceof FormData;
 
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const json = await res.json().catch((err) => (console.log(err)));
  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? json?.detail ?? "Something went wrong.");
  }
  return json as T;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function buildProductParams(
  filters: FilterState,
  search: string,
  sort: SortOption,
  page: number,
  pageSize = 12,
): string {
  const p = new URLSearchParams();
  if (search.trim())          p.set("search",     search.trim());
  if (filters.category)       p.set("category",   filters.category);
  if (filters.season)         p.set("season",     filters.season);
  if (filters.min_price)      p.set("min_price",  filters.min_price);
  if (filters.max_price)      p.set("max_price",  filters.max_price);
  if (filters.min_rating)     p.set("min_rating", filters.min_rating);
  if (filters.in_stock !== null) p.set("in_stock", filters.in_stock ? "true" : "false");
  p.set("ordering",  SORT_MAP[sort]);
  p.set("page",      String(page));
  p.set("page_size", String(pageSize));
  return p.toString();
}

export const productApi = {
  list:   (qs: string) => apiFetch<PaginatedResponse<ApiProduct>>(`/api/products/?${qs}`),
  detail: (id: string | number) => apiFetch<ApiProduct>(`/api/products/${id}/`),
};


// ─── Farmer product management ────────────────────────────────────────────────
 
export const farmerProductApi = {
  detail: (id: string | number) => apiFetch<ApiProduct>(`/api/products/${id}/`),
  create: (data: FormData) => apiFetch<ApiProduct>("/api/products/create/", { method: "POST", body: data }),
  update: (id: string | number, data: FormData) => apiFetch<ApiProduct>(`/api/products/${id}/update/`, { method: "PATCH", body: data }),
};



// ─── Orders / Checkout ────────────────────────────────────────────────────────
 
export const orderApi = {
  /**
   * POST /api/orders/checkout/
   * Converts the current cart into a confirmed order.
   * Body: { transporter_id, delivery_wilaya, delivery_baladiya, delivery_address, notes? }
   */
  checkout: () =>
    apiFetch<CheckoutResponse>("/api/orders/checkout/", {
      method: "POST",
    }),
 
  /**
   * GET /api/orders/{id}/
   * Fetch a single order by ID (used on the confirmation page).
   */
  detail: (id: number | string) =>
    apiFetch<CheckoutResponse>(`/api/orders/${id}/`),
};




// ─── Farmer order management ──────────────────────────────────────────────────
 
export interface FarmerOrderParams {
  page?: number; page_size?: number; search?: string;
  status?: ApiOrderStatus; ordering?: string;
}
 
export const farmerOrderApi = {
  list: (params: FarmerOrderParams = {}) => {
    const p = new URLSearchParams();
    if (params.page)           p.set("page",      String(params.page));
    if (params.page_size)      p.set("page_size", String(params.page_size));
    if (params.search?.trim()) p.set("search",    params.search.trim());
    if (params.status)         p.set("status",    params.status);
    if (params.ordering)       p.set("ordering",  params.ordering);
    const qs = p.toString();
    return apiFetch<OrdersApiResponse>(`/api/orders/${qs ? `?${qs}` : ""}`);
  },
  updateStatus: (id: number, status: ApiOrderStatus) =>
    apiFetch<{ id: number; status: ApiOrderStatus }>(`/api/orders/${id}/`, {
      method: "PATCH", body: JSON.stringify({ status }),
    }),
};


// ─── Farmer analytics dashboard ───────────────────────────────────────────────
 
import type { FarmerDashboardResponse } from "@/types/FarmerAnalytics";
 
export const farmerDashboardApi = {
  get: () => apiFetch<FarmerDashboardResponse>("/api/dashboard/"),
};


// ─── Farmer mission management ────────────────────────────────────────────────
 
import type { MissionsApiResponse, MissionCreatePayload, MissionFilterParams, ApiMission } from "@/types/Missions";
 
export const farmerMissionApi = {
  /**
   * GET /api/missions/my-farm/
   * Farmer's own missions with filter/sort/search params.
   */
  list: (params: MissionFilterParams = {}) => {
    const p = new URLSearchParams();
    if (params.page)            p.set("page",           String(params.page));
    if (params.page_size)       p.set("page_size",      String(params.page_size));
    if (params.status)          p.set("status",         params.status);
    if (params.wilaya)          p.set("wilaya",         params.wilaya);
    if (params.baladiya)        p.set("baladiya",       params.baladiya);
    if (params.order_id)        p.set("order_id",       String(params.order_id));
    if (params.transporter_id)  p.set("transporter_id", String(params.transporter_id));
    if (params.created_after)   p.set("created_after",  params.created_after);
    if (params.created_before)  p.set("created_before", params.created_before);
    if (params.search?.trim())  p.set("search",         params.search.trim());
    if (params.ordering)        p.set("ordering",       params.ordering);
    const qs = p.toString();
    return apiFetch<MissionsApiResponse>(`/api/missions/my-farm/${qs ? `?${qs}` : ""}`);
  },
 
  /**
   * POST /api/missions/
   * Farmer creates a new mission for a confirmed order.
   */
  create: (payload: MissionCreatePayload) =>
    apiFetch<ApiMission>("/api/missions/", {
      method: "POST",
      body:   JSON.stringify(payload),
    }),
 
  /**
   * PATCH /api/missions/:id/cancel/
   * Farmer cancels a pending or accepted mission.
   */
  cancel: (id: number) =>
    apiFetch<ApiMission>(`/api/missions/${id}/cancel/`, { method: "PATCH" }),
};


// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  /** GET /api/cart/ */
  get: () =>
    apiFetch<CartResponse>("/api/cart/"),

  /** POST /api/cart/add_item/ — { product_id, quantity } */
  addItem: (body: AddItemRequest) =>
    apiFetch<CartResponse>("/api/cart/add_item/", {
      method: "POST",
      body:   JSON.stringify(body),
    }),

  /** PATCH /api/cart/update_quantity/ — { item_id, quantity } */
  updateQuantity: (body: UpdateQuantityRequest) =>
  apiFetch<CartResponse>("/api/cart/update_quantity/", {  // ← Expects CartResponse
    method: "PATCH",
    body: JSON.stringify(body),
  }),

  /** DELETE /api/cart/remove_item/ — { item_id } */
  removeItem: (body: RemoveItemRequest) =>
    apiFetch<CartResponse>("/api/cart/remove_item/", {
      method: "DELETE",
      body:   JSON.stringify(body),
    }),

  /** POST /api/cart/clear_cart/ */
  clearCart: () =>
    apiFetch<CartResponse>("/api/cart/clear_cart/", { method: "DELETE" }),
};


export const profileApi = {
  /**
   * GET /api/users/me
   * Returns the full user + role-specific profile + extras in one call.
   */
  me: () => apiFetch<MeResponse>("/api/users/me/"),
 
  /**
   * PATCH /api/users/me
   * Update editable account fields (email, username, phone).
   */
  updateUser: (body: Partial<EditableUserFields>) =>
    apiFetch<MeResponse>("/api/users/me/", {
      method: "PATCH",
      body:   JSON.stringify(body),
    }),
  // ── Activity (buyer) ──────────────────────────────────────────────────────
 
  myOrders: () =>
    apiFetch<{ results: OrderSummary[] }>("/api/orders/?buyer=me&ordering=-created_at"),
 
  myReviews: () =>
    apiFetch<{ results: ReviewSummary[] }>("/api/reviews/my-reviews/"),
 
  // ── Activity (transporter) ────────────────────────────────────────────────
 
  myMissions: () =>
    apiFetch<{ results: MissionSummary[] }>("/api/missions/my-missions/?transporter=me&ordering=-scheduled_at"),
};


export const inventoryApi = {
  /** GET /api/products/my/ — authenticated farmer's own products */
  list: (qs: string) =>
    apiFetch<PaginatedProducts>(`/api/products/my/?${qs}`),
 
  /** DELETE /api/products/{id}/ */
  delete: (id: number) =>
    apiFetch<void>(`/api/products/${id}/`, { method: "DELETE" }),
 
  /** PATCH /api/products/{id}/ — e.g. toggle in_stock */
  patch: (id: number, body: Record<string, unknown>) =>
    apiFetch(`/api/products/${id}/`, {
      method: "PATCH",
      body:   JSON.stringify(body),
    }),
};


// ─── Ministry / Admin ─────────────────────────────────────────────────────────

export interface ApiUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiPendingUser[];
}

// ─── Ministry / Admin ─────────────────────────────────────────────────────────

export const ministryApi = {
  /**
   * GET /api/dashboard/
   * Returns overview stats and recent activity for the admin.
   */
  dashboard: () => apiFetch<ApiDashboardResponse>("/api/dashboard/"),

  /**
   * GET /api/users/ — paginated list of ALL users
   */
  list: (page = 1, pageSize = 10) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    return apiFetch<ApiUsersResponse>(`/api/users/?${p.toString()}`);
  },

  /**
   * GET /api/users/pending/?limit=:limit&offset=:offset
   * Returns paginated list of users awaiting validation.
   */
  pendingUsers: (limit = 10, offset = 0) => {
    const p = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return apiFetch<ApiPendingUsersResponse>(`/api/users/pending/?${p.toString()}`);
  },

  /**
   * GET /api/users/:id/
   * Returns full user detail including role-specific profile and documents.
   */
  userDetail: (id: number) =>
    apiFetch<ApiUserDetailResponse>(`/api/users/${id}/`),

  /**
   * PATCH /api/users/:id/validate/
   * Ministry approves a user — no body required.
   */
  validateUser: (id: number) =>
    apiFetch<ApiValidateResponse>(`/api/users/${id}/validate/`, { method: "PATCH" }),

  /**
   * PATCH /api/users/:id/reject/
   * Ministry rejects a user with a mandatory reason string.
   */
  rejectUser: (id: number, reason: string) =>
    apiFetch<ApiRejectResponse>(`/api/users/${id}/reject/`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
    /**
   * DELETE /api/users/:id/delete/
   * Delete a user.
   */
    deleteUser: (id: number) =>
  apiFetch<{ message: string }>(`/api/users/${id}/delete/`, { method: "DELETE" }),
};




export const transporterApi = {
  /**
   * GET /api/missions/available/
   * Get available missions for transporter (based on their wilaya)
   */
  getAvailableMissions: (params?: { search?: string; ordering?: string }) => {
    const p = new URLSearchParams();
    if (params?.search) p.set("search", params.search);
    if (params?.ordering) p.set("ordering", params.ordering);
    const qs = p.toString();
    return apiFetch<MissionsApiResponse>(`/api/missions/available/${qs ? `?${qs}` : ""}`);
  },

  /**
   * GET /api/missions/my/
   * Get missions accepted by this transporter
   */
  getMyMissions: (params?: { search?: string; status?: string; ordering?: string }) => {
    const p = new URLSearchParams();
    if (params?.search) p.set("search", params.search);
    if (params?.status) p.set("status", params.status);
    if (params?.ordering) p.set("ordering", params.ordering);
    const qs = p.toString();
    return apiFetch<MissionsApiResponse>(`/api/missions/my/${qs ? `?${qs}` : ""}`);
  },

  /**
   * POST /api/missions/{id}/accept/
   * Accept a mission
   */
  acceptMission: (missionId: number, vehicleId?: number) =>
    apiFetch<ApiMission>(`/api/missions/${missionId}/accept/`, {
      method: "POST",
      body: vehicleId ? JSON.stringify({ vehicle_id: vehicleId }) : "{}",
    }),

  /**
   * POST /api/missions/{id}/decline/
   * Decline a mission
   */
  declineMission: (missionId: number) =>
    apiFetch<{ detail: string }>(`/api/missions/${missionId}/decline/`, {
      method: "POST",
      body: "{}",
    }),

  /**
   * PATCH /api/missions/{id}/status/
   * Update mission status (picked_up, in_transit, delivered)
   */
  updateMissionStatus: (missionId: number, status: "picked_up" | "in_transit" | "delivered") =>
    apiFetch<ApiMission>(`/api/missions/${missionId}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  /**
   * GET /api/vehicules/me/
   * Get transporter's vehicles
   */
  getMyVehicles: () =>
    apiFetch<{ count: number; results: { id: number; type: string; model: string; year: number; capacity: number }[] }>(
      "/api/vehicules/me/"
    ),
    // In transporterApi object
  getMissionDetail: (missionId: number) =>
  apiFetch<ApiMission>(`/api/missions/${missionId}/`),
};

// ─── Category management (Ministry) ──────────────────────────────────────────
 
export const categoryApi = {
  /**
   * GET /api/categories/
   * Returns paginated list of all categories.
   */
  list: (page = 1, pageSize = 20) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    return apiFetch<CategoriesApiResponse>(`/api/categories/?${p.toString()}`);
  },
 
  /**
   * GET /api/categories/:id/
   * Returns a single category detail (id, name, slug, description).
   */
  detail: (id: number) =>
    apiFetch<ApiCategory & { description?: string }>(`/api/categories/${id}/`),
 
  /**
   * POST /api/categories/create/
   * Create a new category.  Body: { name, slug, description }
   */
  create: (payload: CategoryPayload) =>
    apiFetch<ApiCategory>("/api/categories/create/", {
      method: "POST",
      body:   JSON.stringify(payload),
    }),
 
  /**
   * PUT /api/categories/:id/update/
   * Full update of an existing category.
   */
  update: (id: number, payload: CategoryPayload) =>
    apiFetch<ApiCategory>(`/api/categories/${id}/update/`, {
      method: "PUT",
      body:   JSON.stringify(payload),
    }),
 
  /**
   * DELETE /api/categories/:id/delete/
   */
  delete: (id: number) =>
    apiFetch<void>(`/api/categories/${id}/delete/`, { method: "DELETE" }),
};



// ─── Official Price management (Ministry) ────────────────────────────────────
 
import type { OfficialPricesResponse, ApiOfficialPrice, OfficialPricePayload } from "@/types/Prices";
 
export const officialPriceApi = {
  /**
   * GET /api/official-prices/
   * Paginated list of all official prices.
   */
  list: (page = 1, pageSize = 20) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    return apiFetch<OfficialPricesResponse>(`/api/official-prices/?${p.toString()}`);
  },
 
  /**
   * GET /api/official-prices/current/?product_id=:id
   * Returns the current active price for a given ministry product.
   */
  current: (productId: number) =>
    apiFetch<ApiOfficialPrice>(`/api/official-prices/current/?product_id=${productId}`),
 
  /**
   * POST /api/official-prices/create/
   * Create a new official price entry.
   */
  create: (payload: OfficialPricePayload) =>
    apiFetch<ApiOfficialPrice>("/api/official-prices/create/", {
      method: "POST",
      body:   JSON.stringify(payload),
    }),
 
  /**
   * PATCH /api/official-prices/:id/
   * Partial update (RetrieveUpdateDestroyAPIView).
   */
  update: (id: number, payload: Partial<OfficialPricePayload> & { is_active?: boolean }) =>
    apiFetch<ApiOfficialPrice>(`/api/official-prices/${id}/`, {
      method: "PATCH",
      body:   JSON.stringify(payload),
    }),
 
  /**
   * DELETE /api/official-prices/:id/
   */
  delete: (id: number) =>
    apiFetch<void>(`/api/official-prices/${id}/`, { method: "DELETE" }),
};



// ─── Regional data (Ministry) ─────────────────────────────────────────────────
 
import type {
  AllRegionsStatsResponse,
  RegionComparisonResponse,
  RegionStatResponse,
} from "@/types/Regional";
 
export const regionalApi = {
  /**
   * GET /api/regions/stats/
   * Returns stats for all four regions in one call.
   */
  allStats: () =>
    apiFetch<AllRegionsStatsResponse>("/api/regions/stats/"),
 
  /**
   * GET /api/regions/comparision/
   * Returns revenue, order count, and active price count per region.
   */
  comparison: () =>
    apiFetch<RegionComparisonResponse>("/api/regions/comparision/"),
 
  /**
   * GET /api/regions/:region_name/stats/
   * Detailed stats for a single region (e.g. "north", "east").
   */
  regionStats: (regionName: string) =>
    apiFetch<RegionStatResponse>(`/api/regions/${regionName}/stats/`),
};

// ─── Buyer dashboard & orders ─────────────────────────────────────────────────
 
import type {
  BuyerDashboardResponse,
  OrdersResponse,
  ApiOrder,
  ReviewsResponse,
} from "@/types/BuyerDashboard";
 
export const buyerApi = {
  /** GET /api/dashboard/ — buyer-scoped stats, charts, recent activity */
  dashboard: () => apiFetch<BuyerDashboardResponse>("/api/dashboard/"),
 
  /** GET /api/orders/?page=:p&page_size=:n&ordering=-created_at */
  orders: (page = 1, pageSize = 10, status?: string) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize), ordering: "-created_at" });
    if (status) p.set("status", status);
    return apiFetch<OrdersResponse>(`/api/orders/?${p.toString()}`);
  },
 
  /** GET /api/orders/:id/ */
  orderDetail: (id: number) => apiFetch<ApiOrder>(`/api/orders/${id}/`),
 
  /**
   * GET /api/orders/:id/invoice/
   * Returns a PDF blob — fetch manually in the component to handle Blob.
   */
  invoiceUrl: (id: number) => `/api/orders/${id}/invoice/`,
 
  /** PATCH /api/orders/:id/ — cancel an order: { status: "cancelled" } */
  cancelOrder: (id: number) =>
    apiFetch<ApiOrder>(`/api/orders/${id}/`, {
      method: "PATCH",
      body:   JSON.stringify({ status: "cancelled" }),
    }),
 
  /** GET /api/reviews/my-reviews/ */
  reviews: (page = 1, pageSize = 10) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    return apiFetch<ReviewsResponse>(`/api/reviews/my-reviews/?${p.toString()}`);
  },
};


// ─── Notifications ─────────────────────────────────────────────────
// Add to api.ts

import type { Notification, NotificationApiResponse } from '@/types/Notifications';

export const notificationApi = {
  getNotifications: (page = 1) =>
    apiFetch<NotificationApiResponse>(`/api/notifications/?page=${page}`),

  getUnreadCount: () =>
    apiFetch<{ unread_count: number }>('/api/notifications/unread-count/'),

  markAsRead: (id: number) =>
    apiFetch<{ status: string }>(`/api/notifications/${id}/read/`, { method: 'PATCH' }),

  markAllAsRead: () =>
    apiFetch<{ status: string }>('/api/notifications/read-all/', { method: 'PATCH' }),
import type { MinistryProductsResponse, MinistryProduct, MinistryProductPayload } from "@/types/MinistryProduct";
export const ministryProductApi = {
  /**
   * GET /api/products/ministry/
   * Paginated list of all ministry-managed products.
   */
  list: (page = 1, pageSize = 10, search?: string) => {
    const p = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (search?.trim()) p.set("search", search.trim());
    return apiFetch<MinistryProductsResponse>(`/api/products/ministry/?${p.toString()}`);
  },
 
  /**
   * GET /api/products/ministry/:id/
   */
  detail: (id: number) =>
    apiFetch<MinistryProduct>(`/api/products/ministry/${id}/`),
 
  /**
   * POST /api/products/ministry/create/
   */
  create: (payload: MinistryProductPayload) =>
    apiFetch<MinistryProduct>("/api/products/ministry/create/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
 
  /**
   * PUT /api/products/ministry/:id/update/
   */
  update: (id: number, payload: MinistryProductPayload) =>
    apiFetch<MinistryProduct>(`/api/products/ministry/${id}/update/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
 
  /**
   * DELETE /api/products/ministry/:id/delete/
   */
  delete: (id: number) =>
    apiFetch<void>(`/api/products/ministry/${id}/delete/`, { method: "DELETE" }),
};