// ─── Role ─────────────────────────────────────────────────────────────────────

export type UserRole = 'Farmer' | 'Buyer' | 'Transporter';

// ─── Status ───────────────────────────────────────────────────────────────────

export type UserStatus = 'Pending' | 'Verified' | 'Rejected';

// ─── User Request ─────────────────────────────────────────────────────────────

export interface UserRequest {
  id: string;         // e.g. "FRM-9021"
  name: string;
  avatarUrl: string;
  role: UserRole;
  registeredAt: string; // ISO date string
  status: UserStatus;
  /** Only present for non-Pending rows — replaces the action buttons */
  resolution?: string;  // e.g. "Approved by Admin_02" | "Invalid Documents"
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string;
  trend: string;       // e.g. "+5.2%"
  barPercent: number;  // 0–100
  highlight?: boolean; // true = primary green card
}

// ─── Tab Filter ───────────────────────────────────────────────────────────────

export type RoleFilter = 'All' | UserRole;

// ─── Nav Item ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',       icon: 'dashboard',    href: '/admin' },
  { label: 'User Management', icon: 'group',         href: '/admin/users', active: true },
  { label: 'Market Prices',   icon: 'storefront',    href: '/prices' },
  { label: 'Crop Reports',    icon: 'potted_plant',  href: '/regional' },
  { label: 'Settings',        icon: 'settings',      href: '/admin/settings' },
];

// ─── Stat Cards ───────────────────────────────────────────────────────────────

export const STAT_CARDS: StatCard[] = [
  { label: 'Total Farmers',      value: '12,450', trend: '+5.2%', barPercent: 65 },
  { label: 'Total Buyers',       value: '3,200',  trend: '+2.1%', barPercent: 40 },
  { label: 'Transporters',       value: '850',    trend: '+0.8%', barPercent: 25 },
  { label: 'Pending Requests',   value: '142',    trend: 'URGENT', barPercent: 0, highlight: true },
];

// ─── Role Badge Lookup ────────────────────────────────────────────────────────

export const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  Farmer:      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Buyer:       'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Transporter: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
};

// ─── Status Lookup ────────────────────────────────────────────────────────────

export const STATUS_STYLES: Record<
  UserStatus,
  { dot: string; text: string }
> = {
  Pending:  { dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-500' },
  Verified: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-500' },
  Rejected: { dot: 'bg-rose-500',   text: 'text-rose-600 dark:text-rose-500' },
};

// ─── Role Filter Tabs ─────────────────────────────────────────────────────────

export const ROLE_FILTERS: RoleFilter[] = ['All', 'Farmer', 'Buyer', 'Transporter'];

// ─── User Requests (seed) ─────────────────────────────────────────────────────

export const INITIAL_USER_REQUESTS: UserRequest[] = [
  {
    id:             'FRM-9021',
    name:           'Amara Okafor',
    avatarUrl:      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaz5nCmpW4X39XbtMapWXQxuvYBTj2FfiRLzHOHIXMUI30pmvEzPCtVLLdi4rXvvru4f03HPOL-nRSjXNWLWzKNu-cMkDKeqCbO4oAFOtUwLME9BNIMzVy6I5w7oPg4GDCHkvMC4ND8LIMLbkoVV5eVSOnBw4ZYrShg71r1YyMYYf7GVbDKtKdOW96z19KxEqYhWxYdyG1cxoargZ_ymSfYIfhaelW4353p-8SEhGUX0a0V0zkzDwUWjpKsD4vxuIqDm3NPlhaqGEi',
    role:           'Farmer',
    registeredAt:   '2023-10-24',
    status:         'Pending',
  },
  {
    id:             'BYR-4412',
    name:           'Kojo Mensah',
    avatarUrl:      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEOdVQmRKEaUpWRepMBfSvpI47Ss1Vqea9oO9kDfu4QdC2eyfpDfJFROIwy2Mu9Y7n9sVhOxmGnSnshjJ9zzm5phLH9y6qNLAw8KKWEwI1XcLrY76myXnujwNcUn2XkcDCsOlWmI-ekHGbcSNy42Fv4uTNUzv3N-0AxC2UON1oNwenq_mq_ijB6YKoZpOw7uyPudSHDdB0AQr6wa2PLzGyxruOBAHkqrrOfK-FnK8DeJOFx6xfRlTt52o5VwPZTnMrPWGHqXzKoVbZ',
    role:           'Buyer',
    registeredAt:   '2023-10-23',
    status:         'Verified',
    resolution:     'Approved by Admin_02',
  },
  {
    id:             'TRN-1103',
    name:           'Zainab Al-Farsi',
    avatarUrl:      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_WxFO0kRa3kUMlfIDMsCJFgysKk2cHsPARyvCuIGao4ctZ9k1yUmUyMyWWZB9ClmHHJl0TuXqmnNZ1RVOn63WfcPnc0onI_V9e70jcNFGrs72IN_P-JSeDauLnCPIr-yLQH7EFOf6uKL1_lfqJUGgB4CD66CLhou3CyDGvmyWGnhsr0oUQPQpwYV5milTiTh1pU9WI-93KYvBoQ1vBRIysaBE9vhugyHlQ0oLseu4g5y-Day_MrB-k1DkF7QM7HZwTiDMM7z0kRZV',
    role:           'Transporter',
    registeredAt:   '2023-10-22',
    status:         'Pending',
  },
  {
    id:             'FRM-8822',
    name:           'David Smith',
    avatarUrl:      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGf07ZXsJ9A2buZZs1C506vs4fmic9LPfxqC5ZHvVdKdMUA_mMZntHNygs844X3Ailiq8H-aaWEq8RGlrGVoYM0XmIJStPnPA9RTGDomhsAkstzXKP_03dhg0uFweTlhBBRddyGpHA-p75ME6AMH_cmkhNpodj-Gw8ndzv2U7m45ozRneatuY_1UpMm8HReckX9TI27ohTVUlXoM1fcBqRe6E1LS27yzRGfGRYOldGKqukTDgAN41-na7i6PGBl_KZP3-XrKYlhieg',
    role:           'Farmer',
    registeredAt:   '2023-10-20',
    status:         'Rejected',
    resolution:     'Invalid Documents',
  },
  {
    id:             'TRN-2190',
    name:           'Hassan Bakri',
    avatarUrl:      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-NKH6AnLbELVRKKBb0jFnuWcgzNFFn981BT6kbqV9ir8QEdBzkmzQ5Y1j3AET9wfNwO8krw1KyRwB2t9veNDiUqVSYV38rw-b6Llfv8UhKWnlI-Cf5ho2rO1PxyOfcTUCPu3FY16zXl5MsN-YIKMjJyqk0wK-YcWFXOoKY5Cfeigtk-o8swoaOGYVVArsyWRNFKkn9QBNc9MtNuX_04jwM6AEFTSdgNeJ38HqfxcFOWmFRkopZXfZ7tJtwHdeyn7PNv0D0EcgcI0u',
    role:           'Transporter',
    registeredAt:   '2023-10-19',
    status:         'Pending',
  },
];

// ─── Pagination constants ─────────────────────────────────────────────────────

export const PAGE_SIZE = 5;
export const TOTAL_REQUESTS = 142;