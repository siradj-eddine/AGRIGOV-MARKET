
import type { ApiProduct, FilterState, SortOption, PaginatedResponse } from "@/types/Product";
import { SORT_TO_ORDERING as SORT_MAP } from "@/types/Product";
import type {
  CartResponse,
  AddItemRequest,
  UpdateQuantityRequest,
  RemoveItemRequest,
} from "@/types/Cart";

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

  const json = await res.json().catch(() => ({}));
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
  update: (id: string | number, data: FormData) => apiFetch<ApiProduct>(`/api/products/${id}/`, { method: "PATCH", body: data }),
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
    apiFetch<CartResponse>("/api/cart/update_quantity/", {
      method: "PATCH",
      body:   JSON.stringify(body),
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
 
  /**
   * PATCH /api/users/me with FormData — used when updating profile fields
   * that include file uploads (farmer card, national ID, etc.).
   */
  updateProfile: (formData: FormData) =>
    apiFetch<MeResponse>("/api/users/me/", {
      method: "PATCH",
      body:   formData,
    }),
 
  /**
   * POST /api/users/change-password/
   */
  changePassword: (body: ChangePasswordFields) =>
    apiFetch<{ message: string }>("/api/users/change-password/", {
      method: "POST",
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