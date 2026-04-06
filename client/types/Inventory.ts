// ─── Raw API shapes ───────────────────────────────────────────────────────────

export interface MyProductImage {
  id:    number;
  image: string; // absolute Cloudinary URL
}

export interface MyProductFarm {
  id:         number;
  name:       string;
  wilaya:     string;
  baladiya:   string;
  farm_size:  number;
  address:    string;
  created_at: string;
  farmer:     number;
}

export interface MyProduct {
  id:             number;
  title:          string;
  farm:           MyProductFarm;
  farmer_name:    string;
  description:    string;
  season:         string;
  unit_price:     string;   // decimal string
  stock:          number;
  in_stock:       boolean;
  category:       string;   // slug string, e.g. "vegetables"
  images:         MyProductImage[];
  average_rating: number;
  review_count:   number;
  created_at:     string;
}

export interface PaginatedProducts {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  MyProduct[];
}

// ─── Filter params (mirrors ProductFilter on the backend) ─────────────────────

export interface ProductFilterParams {
  search:         string;
  category:       string;   // slug
  season:         string;
  min_price:      string;
  max_price:      string;
  in_stock:       boolean | null;
  min_stock:      string;
  min_rating:     string;
  ordering:       SortOption;
}

export type SortOption =
  | "-created_at"
  | "created_at"
  | "unit_price"
  | "-unit_price"
  | "-average_rating"
  | "-stock"
  | "stock";

export const SORT_LABELS: Record<SortOption, string> = {
  "-created_at":     "Newest First",
  "created_at":      "Oldest First",
  "unit_price":      "Price: Low to High",
  "-unit_price":     "Price: High to Low",
  "-average_rating": "Top Rated",
  "-stock":          "Most Stock",
  "stock":           "Low Stock",
};

export const EMPTY_FILTERS: ProductFilterParams = {
  search:     "",
  category:   "",
  season:     "",
  min_price:  "",
  max_price:  "",
  in_stock:   null,
  min_stock:  "",
  min_rating: "",
  ordering:   "-created_at",
};

// ─── Category options ─────────────────────────────────────────────────────────

export const CATEGORY_SLUGS = [
  { slug: "vegetables", label: "Vegetables"       },
  { slug: "fruits",     label: "Fruits"           },
  { slug: "grains",     label: "Grains & Cereals" },
  { slug: "tubers",     label: "Tubers"           },
  { slug: "legumes",    label: "Legumes"          },
];

export const SEASON_OPTIONS = [
  { value: "spring",   label: "Spring"   },
  { value: "summer",   label: "Summer"   },
  { value: "autumn",   label: "Autumn"   },
  { value: "winter",   label: "Winter"   },
  { value: "all_year", label: "All Year" },
];

// ─── Dashboard sidebar nav ────────────────────────────────────────────────────

export interface NavItem {
  href:   string;
  label:  string;
  icon:   string;
}

export const FARMER_NAV: NavItem[] = [
  { href: "/farmer/dashboard",           label: "Overview",   icon: "space_dashboard" },
  { href: "/farmer/dashboard/products",  label: "Products",   icon: "storefront"      },
  { href: "/farmer/dashboard/orders",    label: "Orders",     icon: "receipt_long"    },
  { href: "/farmer/dashboard/logistics", label: "Logistics",  icon: "local_shipping"  },
  { href: "/farmer/dashboard/analytics", label: "Analytics",  icon: "bar_chart"       },
  { href: "/farmer/dashboard/missions", label: "Missions",   icon: "delivery_truck_bolt"  },
];