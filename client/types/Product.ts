// ─── Raw API shapes (what Django returns) ────────────────────────────────────

export interface ApiImage {
  id: number;
  image: string; // absolute URL
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiFarm {
  id: number;
  name: string;
  wilaya: string;
  baladiya: string;
  address: string;
}

/** One item from GET /api/products/ or GET /api/products/{id}/ */
export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  unit_price: string;    // DRF DecimalField → string
  stock: number;
  in_stock: boolean;
  average_rating: string | null;
  season: ProductSeason;
  created_at: string;    // ISO-8601
  category_name: string;
  farm: ApiFarm;
  images: ApiImage[];
}

/** Standard paginated DRF list response */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Season ───────────────────────────────────────────────────────────────────

export type ProductSeason =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "";

export const SEASON_LABELS: Record<ProductSeason, string> = {
  spring:   "Spring",
  summer:   "Summer",
  autumn:   "Autumn",
  winter:   "Winter",
  "": "all year",
};

export const SEASON_ICONS: Record<ProductSeason, string> = {
  spring:   "local_florist",
  summer:   "wb_sunny",
  autumn:   "eco",
  winter:   "ac_unit",
  "": "calendar_month",
};

// ─── Filter state (mirrors Django FilterSet params) ───────────────────────────

export interface FilterState {
  /** Category slug  */
  category:   string;
  /** ProductSeason value or "" */
  season:     string;
  min_price:  string;
  max_price:  string;
  in_stock:   boolean | null;
  min_rating: string;
}

export const EMPTY_FILTERS: FilterState = {
  category:   "",
  season:     "",
  min_price:  "",
  max_price:  "",
  in_stock:   null,
  min_rating: "",
};

export type SortOption =
  | "created_at_desc"
  | "unit_price_asc"
  | "unit_price_desc"
  | "average_rating_desc";

export const SORT_LABELS: Record<SortOption, string> = {
  created_at_desc:      "Newest First",
  unit_price_asc:       "Price: Low to High",
  unit_price_desc:      "Price: High to Low",
  average_rating_desc:  "Top Rated",
};

/** Map UI sort value → Django `ordering` query param */
export const SORT_TO_ORDERING: Record<SortOption, string> = {
  created_at_desc:     "-created_at",
  unit_price_asc:      "unit_price",
  unit_price_desc:     "-unit_price",
  average_rating_desc: "-average_rating",
};

export const CATEGORY_OPTIONS: { slug: string; label: string; icon: string }[] = [
  { slug: "vegetables", label: "Vegetables",      icon: "nutrition"      },
  { slug: "grains",     label: "Grains & Cereals", icon: "grain"          },
  { slug: "fruits",     label: "Fruits",           icon: "eco"          },
  { slug: "tubers",     label: "Tubers",           icon: "potted_plant"   },
  { slug: "legumes",    label: "Legumes",          icon: "grass"          },
];