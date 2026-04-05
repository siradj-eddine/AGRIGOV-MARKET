// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductForm {
  name:            string;   // → API title
  varietyCode:     string;   // included in description on save
  quantityTons:    number;   // → API stock  (tons; convert to kg if API expects kg)
  moisturePercent: number;   // enrichment field — included in description
  description:     string;   // → API description
  askingPrice:     number;   // → API unit_price
  minPrice:        number;   // stored locally / not in current API spec
  in_stock:        boolean;  // → API in_stock (PATCH toggle)
}

export interface ProductImage {
  id:        string;
  src:       string;
  alt:       string;
  isPrimary: boolean;
  file?:     File;   // present only for newly uploaded local images
}

export interface MarketReference {
  indexLabel:  string;
  indexBadge:  string;
  pricePerTon: number;
}

export interface InventoryStatus {
  id:          string;
  label:       string;
  detail:      string;
  icon:        string;
  iconClass:   string;
  borderClass: string;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
  filled?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Overview', icon: 'dashboard',    href: '/farmer/dashboard' },
  { label: 'products',    icon: 'storefront', href: '/farmer/dashboard/products' },
  { label: 'orders',     icon: 'order_approve',  href: '/farmer/dashboard/orders', active: true, filled: true },
  { label: 'Logistics', icon: 'local_shipping',  href: '/farmer/dashboard/logistics' },
  { label: 'Analytics',   icon: 'analytics',    href: '/farmer/dashboard/analytics' },
];

export const TOP_NAV: NavItem[] = [
  { label: 'Overview', icon: '', href: '/farmer/dashboard' },
  { label: 'products',     icon: '', href: '/farmer/dashboard/products', active: true },
  { label: 'Inventory', icon: '', href: '/farmer/dashboard/inventory' },
];

export const BREADCRUMBS = ['Inventory', 'Crops'] as const;

export const INITIAL_FORM: ProductForm = {
  name:            'Premium Yellow Maize',
  varietyCode:     'Y-MZ-2024-V2',
  quantityTons:    125.5,
  moisturePercent: 13.2,
  description:
    'High-grade yellow maize harvested from the North Valley sectors. Tested for aflatoxins and certified organic. Optimal for feed production or industrial processing. Batch processed through modern silos.',
  askingPrice: 425.00,
  minPrice:    405.00,
  in_stock:    true,
};

export const PRODUCT_IMAGES: ProductImage[] = [
  {
    id:        'img-primary',
    src:       'https://lh3.googleusercontent.com/aida-public/AB6AXuCcgBZbBDfJ2m_4Kxq1UEB6j7bVEsPITEnIbXeivEh3IuIgs1VnoEv984p25tURF44dmkF0RrqAyI35eHmh9S5Chj6J4JUoY_8WaG7nlYwSW68CED_VXRyKi3LHNFm2JehGn59X9dbH4BbGp6aIgwAqXzRWtlDC60II3joqW008KK8mNYPo5cRAyJ2M-mxNnSQpuAKrYcvw6jND9Bdydt9m_ltJ8sQuGabjRQvRjg_joRxYAr8-9Jb33ilSOECqQGOxOg_N3vlBnvs',
    alt:       'High quality sun-dried yellow corn kernels in a wooden scoop',
    isPrimary: true,
  },
  {
    id:        'img-thumb',
    src:       'https://lh3.googleusercontent.com/aida-public/AB6AXuC8bPWbHZoNLvWTI0QFLH_wLD4F5xw6MgLrFWMLEWR5ipHFelXWkWxDMcA4_-SDT0uQ6OwvAYHB1q58JFu3IXtRpwFgQpLvmbo5tjpv1Cum9OaLCv1phCUeHDDnb0W2lGHh96qcxYCGwOncMglxJhQj8fN1dUW2RQShGbDfUdg8sUwJ6UfpFeL6ToxMvfYeh7LlCxFahZRQyclkJimNhEVeHBSxWQQe5P3uRAVsdv_F3JXn0A63amr8UypYb9Diq6lc7B0rpiL0cRo',
    alt:       'Macro photo of organic yellow maize cob showing perfect rows of kernels',
    isPrimary: false,
  },
];

export const MARKET_REFERENCE: MarketReference = {
  indexLabel:  'CME Group Daily Average (Y-MAZ-GLB)',
  indexBadge:  'Live Market',
  pricePerTon: 412.00,
};

export const MOISTURE_OPTIMAL_RANGE = { min: 12, max: 14 };

export const INVENTORY_STATUSES: InventoryStatus[] = [
  {
    id:          'grade',
    label:       'Grade A Certified',
    detail:      'Inspection: Oct 12, 2024',
    icon:        'verified',
    iconClass:   'text-emerald-600 bg-emerald-50',
    borderClass: 'border-l-4 border-emerald-500',
  },
  {
    id:          'storage',
    label:       'Silo B-14 Storage',
    detail:      'Capacity utilization: 84%',
    icon:        'inventory',
    iconClass:   'text-amber-600 bg-amber-50',
    borderClass: 'border-l-4 border-amber-500',
  },
];

export const FARMER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA_dfNYzeQIhy_di5NQX4BaIhJWSZLdDUwRzOPqLqJnMVNY8RrQMU7qF_sx4dIdSpF7N9XSrHrhJ7aPabdLL6piE6Wy9WG73j9J2FAqbAYmudvLxHSrs5blJaeuu3fC-k2YgWP_IWBlR7DDtaaNCkrdsep7gwVX0ZElhUxl9AMUR85syvHrDzWIanTIjthEEWQzpTLve8M0JT9fnI3ls9VsihZrbFtqxhAnhckBFqU00SJXZHE_n-wRorHqezRJnB2SzC41fa3U-Po';