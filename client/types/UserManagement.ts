// ─── Display / UI types ───────────────────────────────────────────────────────

export type ApiUserRole   = 'FARMER' | 'BUYER' | 'TRANSPORTER' | 'ADMIN';
export type UserRole      = 'Farmer' | 'Buyer' | 'Transporter';
export type RoleFilter    = 'All' | UserRole;

/** Map screaming-case API role to display label */
export function apiRoleToDisplay(role: ApiUserRole): UserRole | null {
  const map: Partial<Record<ApiUserRole, UserRole>> = {
    FARMER:      'Farmer',
    BUYER:       'Buyer',
    TRANSPORTER: 'Transporter',
  };
  return map[role] ?? null;
}

/** Map display label to API screaming-case */
export function displayRoleToApi(role: RoleFilter): ApiUserRole | null {
  const map: Partial<Record<RoleFilter, ApiUserRole>> = {
    Farmer:      'FARMER',
    Buyer:       'BUYER',
    Transporter: 'TRANSPORTER',
  };
  return map[role] ?? null;
}

// ─── Dashboard API ────────────────────────────────────────────────────────────

export interface ApiDashboardOverview {
  total_users: number;
  new_users_last_30_days: number;
  total_products: number;
  total_orders: number;
  monthly_revenue: number;
}

export interface ApiDashboardResponse {
  role: string;
  data: {
    overview: ApiDashboardOverview;
    recent_activity: {
      recent_users: ApiRecentUser[];
    };
  };
}

export interface ApiRevenueTrendPoint {
  month: string;
  total: number;
}

export interface ApiRegionPerformance {
  farm__wilaya: string;
  total: number;
}

export interface ApiUserDistribution {
  role: ApiUserRole;
  count: number;
}

export interface ApiDashboardCharts {
  revenue_trend: ApiRevenueTrendPoint[];
  region_performance: ApiRegionPerformance[];
  user_distribution: ApiUserDistribution[];
}

export interface ApiTopProduct {
  id: number;
  ministry_product__name: string;
  total_sold: number | null; // 🔥 FIX
}

export interface ApiDashboardInsights {
  top_products: ApiTopProduct[];
  low_stock_products: number;
}


export interface ApiDashboardResponse {
  overview: ApiDashboardOverview;
}

// ─── Users API ────────────────────────────────────────────────────────────────

export interface ApiPendingUser {
  id:          number;
  email:       string;
  username:    string;
  phone:       string;
  role:        ApiUserRole;
  is_verified: boolean;
  is_active:   boolean;
  created_at:  string;
}

export interface ApiUsersResponse {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  ApiPendingUser[];
}

export interface ApiPendingUsersResponse {
  count:    number;
  next:     string | null;
  previous: string | null;
  results: {
    status: string;
    code:   number;
    data:   ApiPendingUser[];
  };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',       icon: 'dashboard',   href: '/admin'          },
  { label: 'User Management', icon: 'group',        href: '/admin/users', active: true },
  { label: 'Market Prices',   icon: 'storefront',   href: '/prices'         },
  { label: 'Crop Reports',    icon: 'potted_plant', href: '/regional'       },
  { label: 'Settings',        icon: 'settings',     href: '/admin/settings' },
];

// ─── Display lookups ──────────────────────────────────────────────────────────

export const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  Farmer:      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Buyer:       'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Transporter: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
};

export const ROLE_FILTERS: RoleFilter[] = ['All', 'Farmer', 'Buyer', 'Transporter'];

export const PAGE_SIZE = 10;