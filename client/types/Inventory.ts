// ─── Listing Status ───────────────────────────────────────────────────────────

export type ListingStatus = 'Active' | 'Out of Stock' | 'Draft';

// ─── Filter Tab ───────────────────────────────────────────────────────────────

export type ListingFilter = 'All Listings' | ListingStatus;

// ─── Product Listing ─────────────────────────────────────────────────────────

export interface ProductListing {
  id: string;
  name: string;
  imageUrl: string;
  imageAlt: string;
  type: string;          // e.g. "Vegetable", "Grain", "Tuber"
  variety: string;       // e.g. "Heirloom Roma"
  quantity: number;
  unit: string;          // e.g. "kg", "units"
  listPrice: number;     // farmer's listed price
  marketPrice: number;   // reference market price
  status: ListingStatus;
}

// ─── Summary Stat ─────────────────────────────────────────────────────────────

export interface SummaryStat {
  label: string;
  value: string;
  icon: string;  // Material Symbol name
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}


// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',          icon: 'dashboard',    href: '/farmer' },
  { label: 'Inventory',          icon: 'inventory_2',  href: '/inventory' },
  { label: 'Product Management', icon: 'list_alt',     href: '/products/manage', active: true },
  { label: 'Orders',             icon: 'receipt_long', href: '/orders' },
  { label: 'Settings',           icon: 'settings',     href: '/settings' },
];

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

export const LISTING_FILTERS: ListingFilter[] = [
  'All Listings',
  'Active',
  'Out of Stock',
  'Draft',
];

// ─── Status Style Lookup ──────────────────────────────────────────────────────

export const STATUS_STYLES: Record<
  ListingStatus,
  { badge: string; imageClass: string; textClass: string; qtyBadge: string }
> = {
  Active: {
    badge:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    imageClass: '',
    textClass:  'text-slate-900 dark:text-slate-100',
    qtyBadge:   'bg-primary/10 text-primary',
  },
  'Out of Stock': {
    badge:      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    imageClass: 'grayscale opacity-60',
    textClass:  'text-slate-400 dark:text-slate-500',
    qtyBadge:   'bg-slate-100 dark:bg-slate-800 text-slate-400',
  },
  Draft: {
    badge:      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    imageClass: 'opacity-80',
    textClass:  'text-slate-900 dark:text-slate-100',
    qtyBadge:   'bg-primary/10 text-primary',
  },
};

// ─── Action Icon Lookup ───────────────────────────────────────────────────────
// Draft rows show delete instead of visibility_off

export const ACTION_ICON: Record<ListingStatus, { icon: string; title: string }> = {
  Active:         { icon: 'visibility_off', title: 'Deactivate' },
  'Out of Stock': { icon: 'visibility_off', title: 'Deactivate' },
  Draft:          { icon: 'delete',         title: 'Delete Draft' },
};

// ─── Seed Listings ────────────────────────────────────────────────────────────

export const INITIAL_LISTINGS: ProductListing[] = [
  {
    id:          'lst-001',
    name:        'Roma Tomatoes',
    imageUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Jq5-F5Xf1EI6kw_F2A0vXgMlu_s7K1r7ERugwRQ7yWf6zkLEX89KZ2wYNbWgldJPkD-Acocrb3XvLIu7w_XQIUQSvJca2tr9GhdjGpcpLbGCRIdw2Xmu8AIcpi_eEDLZ8QIzod-jtvNEp8dN_siK7Rfp4wf96oSOdPeLuQS37TlKGMXb4qBTPTLiQrqQaiSXlhRREQuRDFmJfPr114wmoqRuNyZI8B7ZWLMQcBtGltEI7-p9BBR-9sD8_lmdKsKMv6_S2Byh3BpQ',
    imageAlt:    'Fresh Roma tomatoes',
    type:        'Vegetable',
    variety:     'Heirloom Roma',
    quantity:    500,
    unit:        'kg',
    listPrice:   2.20,
    marketPrice: 2.00,
    status:      'Active',
  },
  {
    id:          'lst-002',
    name:        'Honey Bantam Corn',
    imageUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuA2ckxw6XI9HFj1Rd5gDZdnSGLTUNrOuUUtNI1NI_pkFvSASbk_0OqaOr6yYncWN0FLZbeGGcVMzeWugDjAb_FbtbF6_MCN95n426JXs-4j_bc7BTKqg5yff6bos5h2T1jSs227RW-g7JgmrlmdWPSB-D1iG-zExwxPQrIUtty_zG4nCEr3PYfwvyq25QSx5CcSoINeTtQIfKFZouvbXJfa0XSRjVbTwrqMxkofPRgz3nJmpYiDJeUUCfnneXdfJoHc2v47dONNXKhX',
    imageAlt:    'Sweet corn cobs',
    type:        'Grain',
    variety:     'Extra Sweet',
    quantity:    1200,
    unit:        'units',
    listPrice:   0.45,
    marketPrice: 0.50,
    status:      'Active',
  },
  {
    id:          'lst-003',
    name:        'California Peppers',
    imageUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXbSHvpWkuj0rBe50fzJg3H_vHvaObQO2AEh4bnggt8gBxLQ2GbK3m9QQn9Hl9TH2mffDlJYIKS6wq2SIeeeFn0LtvPZDK3bOWe6pP39QhyGcgcmFJa8QosThwBGAGybjwRvo_8ImTOtHSrojFIslAfJwWKFtsnMAJrsWu9GXhP-FFS8aavgy3hOQyoOoHfWCMCb2p9Maou0lXMSICkfovaJhUYF_dBiQdj9wZ5Ute0N3WSH7tHCSz6VknNAoXVEbyhNY1GvZPtF9k',
    imageAlt:    'Bell peppers California Wonder',
    type:        'Vegetable',
    variety:     'Bell Pepper',
    quantity:    0,
    unit:        'kg',
    listPrice:   3.50,
    marketPrice: 3.50,
    status:      'Out of Stock',
  },
  {
    id:          'lst-004',
    name:        'Yukon Potatoes',
    imageUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3XsaarNpewr7zqb0lRNZyaVsiQQ8_U0qE0DiGURCvbb-sXGLbIwJAP3gA-adWxqclWgzuxSgKc15DN_8G26mp1vsFKsoC-d_J0HBJwGMbxlxdiVlEzDaN4b1t-nZ5sjiCTh4rNEU06op0_TbxbizR62M7Ajo-9qHDEeYcaQrbRQ7K8gwcJU8mhdm7JRqWx2Ez4UPjk9KcGfeaenjQrFVCeVi4xitTHmj41j7inVfsr1oUyeQf1T-ClkeiQ28wLeR8I2NAIEeXTs4Q',
    imageAlt:    'Yukon Gold Potatoes',
    type:        'Tuber',
    variety:     'Gold Premium',
    quantity:    2000,
    unit:        'kg',
    listPrice:   1.15,
    marketPrice: 1.10,
    status:      'Draft',
  },
];

// ─── Summary Stats (derived at runtime in the page shell) ─────────────────────
// Static stat cards for icon/label definitions — values computed from listings

export const SUMMARY_STAT_DEFS: Omit<SummaryStat, 'value'>[] = [
  { label: 'Active Listings',   icon: 'local_mall'  },
  { label: 'Total Value',       icon: 'trending_up' },
  { label: 'Total Impressions', icon: 'visibility'  },
];

// Static impressions value (would come from API in production)
export const TOTAL_IMPRESSIONS = '1,248';