// ─── Types ────────────────────────────────────────────────────────────────────

export interface MinistryProductOption { id: number; name: string; }

export interface ProductForm {
  ministry_product_id: number | "";  // → API ministry_product_id
  quantityKg:          number;       // → stock
  description:         string;       // → description
  askingPrice:         number;       // → unit_price
  in_stock:            boolean;      // → in_stock (PATCH toggle)
  season:              string;       // → season
}

export interface ProductImage {
  id:        string;
  src:       string;
  alt:       string;
  isPrimary: boolean;
  file?:     File;
}

// Field-level errors from backend e.g. { "unit_price": ["Price must be between…"] }
export type ApiFieldErrors = Record<string, string[]>;

export interface MarketReference {
  indexLabel:  string;
  indexBadge:  string;
  pricePerKg:  number;
}

export interface InventoryStatus {
  id:          string;
  label:       string;
  detail:      string;
  icon:        string;
  iconClass:   string;
  borderClass: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const BREADCRUMBS = ["Inventory", "Edit Product"] as const;

export const PRODUCT_IMAGES: ProductImage[] = [
  {
    id:        "img-primary",
    src:       "https://lh3.googleusercontent.com/aida-public/AB6AXuCcgBZbBDfJ2m_4Kxq1UEB6j7bVEsPITEnIbXeivEh3IuIgs1VnoEv984p25tURF44dmkF0RrqAyI35eHmh9S5Chj6J4JUoY_8WaG7nlYwSW68CED_VXRyKi3LHNFm2JehGn59X9dbH4BbGp6aIgwAqXzRWtlDC60II3joqW008KK8mNYPo5cRAyJ2M-mxNnSQpuAKrYcvw6jND9Bdydt9m_ltJ8sQuGabjRQvRjg_joRxYAr8-9Jb33ilSOECqQGOxOg_N3vlBnvs",
    alt:       "Product primary image",
    isPrimary: true,
  },
];
export const INVENTORY_STATUSES: InventoryStatus[] = [
  {
    id:          "grade",
    label:       "Grade A Certified",
    detail:      "Inspection: Oct 12, 2024",
    icon:        "verified",
    iconClass:   "text-emerald-600 bg-emerald-50",
    borderClass: "border-l-4 border-emerald-500",
  },
  {
    id:          "storage",
    label:       "Silo B-14 Storage",
    detail:      "Capacity utilization: 84%",
    icon:        "inventory",
    iconClass:   "text-amber-600 bg-amber-50",
    borderClass: "border-l-4 border-amber-500",
  },
];