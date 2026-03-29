// ─── Types ────────────────────────────────────────────────────────────────────

export interface FarmerProfile {
  name:        string;
  role:        string;
  memberSince: string;
  avatarUrl:   string;
  email:       string;
  phone:       string;
  bio:         string;
}

export interface FarmLocation {
  mapImageUrl: string;
  estate:      string;
  region:      string;
}

export interface PaymentMethod {
  id:        string;
  label:     string;  // e.g. "AgriBank Savings •••• 8829"
  isPrimary: boolean;
}

export interface SecuritySetting {
  id:          string;
  label:       string;
  description: string;
  type:        'toggle' | 'link';
  enabled?:    boolean;
  linkLabel?:  string;
}

export interface ProfileBadge {
  id:       string;
  label:    string;
  verified: boolean;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
}

export interface MobileNavItem {
  label:   string;
  icon:    string;
  active?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard',   href: '/farmer' },
  { label: 'Fields',    icon: 'potted_plant', href: '/regional' },
  { label: 'Crops',     icon: 'agriculture',  href: '/inventory' },
  { label: 'Inventory', icon: 'inventory_2',  href: '/inventory/new' },
  { label: 'Reports',   icon: 'analytics',    href: '/admin' },
];

export const TOP_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '', href: '/farmer' },
  { label: 'Fields',    icon: '', href: '/regional' },
  { label: 'Profile',   icon: '', href: '/farmer/profile', active: true },
];

export const MOBILE_NAV: MobileNavItem[] = [
  { label: 'Home',     icon: 'dashboard'  },
  { label: 'Crops',    icon: 'agriculture' },
  { label: 'Profile',  icon: 'person',     active: true },
  { label: 'Settings', icon: 'settings'   },
];

export const INITIAL_PROFILE: FarmerProfile = {
  name:        'Arthur Miller',
  role:        'Farmer',
  memberSince: 'Oct 2021',
  avatarUrl:   'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Y4LIZwg5CvoCqvSyA2RSJj6fo7sr0SUHRm0eBNP29xcRykEivEJPNdSAeSymQhwi-0toNNmaZKI0LGtqAyruczkYjFp6X5uPQSkN49wfw7ZCtftMvdB-8L4R5BgHQoODyOIBO48-TQk1j8WkQxb6WxrPvH4JlYyAHzEY480pq_D65vLshdzIgZyu6GxJJst8Tihj9kMTqKlR1_aguo4Y4-g4YuMsfTqF_5bTrwi1a-73rgVnQ1UFpR6DBcU2p3Y21FQ_lZhIPH4',
  email:       'a.miller@greenfield-estates.com',
  phone:       '+1 (555) 012-3456',
  bio:         'Third-generation organic crop farmer focusing on soil health and water conservation in the Northern Midlands region.',
};

export const FARM_LOCATION: FarmLocation = {
  mapImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0VllohwBPUVQc0ilk0btc4Kbpota7qjOpK8nlN1Yo2iPt-ndweuGyQ5by2Gfk52kvZbZyti7odgM9pkaT197ca3GCWmOI8j-Ky7qgQ5ZVS2jkWCE5PFMwr480TYI_pHnwiN7d0cMIvjq1bYNfXbku0CIRpzyjnQlfrEgUGo70PZh6kzN88GQ3y8KML-k4Ikvc3hlwlLJ_VwoUrB1b3Gj4ebEa7JwUILufM2V8BRWe3HwWpHiF_ITrCMDXwjbyyWOVhwJ0f3XXAgg',
  estate:      'Greenfield Estates, Plot 42B',
  region:      'Northern Midlands Agricultural Zone',
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id:        'pm-agribank',
    label:     'AgriBank Savings •••• 8829',
    isPrimary: true,
  },
];

export const SECURITY_SETTINGS: SecuritySetting[] = [
  {
    id:          'two-factor',
    label:       'Two-Factor Authentication',
    description: 'Secure your account with mobile verification',
    type:        'toggle',
    enabled:     true,
  },
  {
    id:          'login-activity',
    label:       'Login Activity',
    description: 'Last seen: 2 hours ago from Chrome (Desktop)',
    type:        'link',
    linkLabel:   'Review',
  },
];

export const PROFILE_BADGES: ProfileBadge[] = [
  { id: 'photo', label: 'Photo Verified',       verified: true  },
  { id: 'email', label: 'Email Verified',        verified: true  },
  { id: 'id',    label: 'Pending ID Verification', verified: false },
];

/** Profile completion as a percentage (0–100) */
export const PROFILE_COMPLETION = 75;

export const TOPBAR_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ_CH8GO_RYSdWk-5gTQ10dUGSmS1i1ZnFK2MywFe8VS30yK1uvuS8k3Qc1IpwBpUOSdll7ZmGf3SMWt2dsxJ7fgxYt7cbKIrVfXD6IN3BXi2ErWvH4GlRmAWTIRuWDFh2H_vItA6i1VYGxrN3Fjg-9FGmnNd-QEKrQaN5y2OQAJ9GjfF1GKCBh1EqVzRZhyy8rfDYC4JQIMC_eyyI2iD-MDEtflCTN7BuaMEs0e80i25kegKY8iuePXjqddDx6crJEPvMq2k-OyA';