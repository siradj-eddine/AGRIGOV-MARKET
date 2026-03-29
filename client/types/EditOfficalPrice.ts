// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartRange = '1Y' | '3Y' | 'ALL';

export interface MarketHealthBar {
  label:   string;
  percent: number;
}

export interface ChartBar {
  month:   string;
  percent: number; // height as % of container (0–100)
  isPeak?: boolean;
}

export interface PriceRevisionForm {
  newPrice:     number | '';
  justification: string;
}

export interface CropSpec {
  grade:    string;
  moisture: string;
  origin:   string;
  imageUrl: string;
  imageAlt: string;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const TOP_NAV: NavItem[] = [
  { label: 'Dashboard',       icon: '', href: '/admin',          active: true },
  { label: 'Market Analysis', icon: '', href: '/admin/market'  },
  { label: 'Policy Tools',    icon: '', href: '/admin/policy'  },
];

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard',   href: '/admin'              },
  { label: 'Crops',     icon: 'agriculture',  href: '/farmer/products', active: true },
  { label: 'Fields',    icon: 'potted_plant', href: '/regional'          },
  { label: 'Inventory', icon: 'inventory_2',  href: '/inventory'         },
  { label: 'Reports',   icon: 'analytics',    href: '/admin/reports'     },
];

export const BREADCRUMBS = ['Crops', 'Price Controls', 'Price Editor'] as const;

export const COMMODITY_NAME = 'Premium Yellow Maize';
export const COMMODITY_ID   = 'MAI-Y-001';

export const CURRENT_PRICE     = 240.00;
export const PRICE_UNIT        = 'Ton';
export const QUARTER_DELTA_PCT = 4.2; // positive = up

export const MARKET_HEALTH_BARS: MarketHealthBar[] = [
  { label: 'Supply Stability', percent: 82 },
  { label: 'National Reserve', percent: 64 },
];

export const CHART_BARS: ChartBar[] = [
  { month: 'Jan', percent: 38  },
  { month: 'Feb', percent: 50  },
  { month: 'Mar', percent: 44  },
  { month: 'Apr', percent: 63  },
  { month: 'May', percent: 75  },
  { month: 'Jun', percent: 88  },
  { month: 'Jul', percent: 81  },
  { month: 'Aug', percent: 100, isPeak: true },
  { month: 'Sep', percent: 94  },
  { month: 'Oct', percent: 81  },
  { month: 'Nov', percent: 69  },
  { month: 'Dec', percent: 75  },
];

export const CHART_RANGES: ChartRange[] = ['1Y', '3Y', 'ALL'];

export const CROP_SPEC: CropSpec = {
  grade:    'Export A1 Premium',
  moisture: '< 12%',
  origin:   'Central Highlands',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUmt3l1MXqrfjvf-uIV6LBt1vMHUyGV9Tq3-sWavxnmEMqszqpQPX_KwexuGIWDvpnlsSGg08VHDCNwx8iFQrPebG0I4JQQqPn1zE7umzLs6Qi6oa0q3Ty0agjYVr7MRl1opR4IbEK92dUIuBlA9uhZrXgkV7mg6UisXlLzxeDG6qnpLkZh6FfYCs1_4MTCxdpmC6ppvJ7bCPYf-PFaoi9g3UkvjeWR_Jo13sW6GVKiEF3jXv8qwHh9iosfNa9pCBAQ-4GiksLac4',
  imageAlt: 'Golden mature yellow maize cob in sunlight',
};

export const INITIAL_FORM: PriceRevisionForm = {
  newPrice:      '',
  justification: '',
};

export const PRICE_ADMIN_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1SL2lw4s5pF4gvwrCjFsMa5DR6dE2aAElddhXCPChj09HpOBhYYx9YmRx0ACeZKoLBd21ogAoOfpwuL5bWhPvXKmDasac9XLvYfa91ijKewPEoMq3AaDyMQz4_D_fNb2fF3lpsVmpwUNTDoPld8bqqb3ZNolwAhKpztEdmaqKHgldSmOCvNw7kWg9vaUf826CoTWF5vlUQge1TCLCjDl3esyBZHiVyDLSLbZBGK86ApGAhSnA3w2Pnk6zVDa3MMa-Sa86mySjm3Y';