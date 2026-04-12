// ─── Types ────────────────────────────────────────────────────────────────────

export interface MissionStop {
  role:     string;   // e.g. "Pickup" | "Destination"
  name:     string;
  address:  string;
  time:     string;   // e.g. "08:00 AM"
  icon:     string;   // Material Symbol name
  /** Tailwind classes for the dot ring and icon colour */
  dotClass:  string;
  iconClass: string;
}

export interface CargoInfo {
  name: string;
  variety: string;
  icon: string;
  weightTons: number;
  lotNumber: string;
  totalPrice?: string | null;   // ← add
}
export interface MapStat {
  icon:  string;
  value: string;
  label: string;
}

export interface MissionDetailData {
  orderId:        string;   // e.g. "TR-8821"
  payout:         number;
  progressPercent: number;  // 0–100
  status:         string;   // e.g. "In Transit"
  syncedAgo:      string;   // e.g. "2m ago"
  mapImageUrl:    string;
  mapImageAlt:    string;
  mapStats:       MapStat[];
  stops:          MissionStop[];
  cargo:          CargoInfo;
}

export interface MobileNavItem {
  label:   string;
  icon:    string;
  active?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const MISSION_DETAIL: MissionDetailData = {
  orderId:         'TR-8821',
  payout:          450.00,
  progressPercent: 65,
  status:          'In Transit',
  syncedAgo:       '2m ago',
  mapImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJUHn_bW4c2Xn7eXO4u_kuts-q3Ca0HCFXd_ZjrZwyuIKLD4WdwXJz3bSWoYLP8i4GQJMBMd1jSX1v0RzCCJxRRe24atWg9_lTdPQvgDa47zNyzxuD0C-7HIwQTbFqnwzqESu0mNUKCinv7XP6rZxsX29rpTnFSEekExg1jPFWcnaSpd-S17R18Vo0mlDak7AFMWJi2hRIaKKtCVdH0WH0dzTvSgicBV02NyjckgAcs1F2U-6Dn0rKka3w05uDYbKraAGPzkpSu_o',
  mapImageAlt:
    'Satellite view of agricultural fields and rural roads between a farm and grain elevator facility',
  mapStats: [
    { icon: 'distance', value: '12.4 mi', label: 'Distance' },
    { icon: 'schedule', value: '24 min',  label: 'ETA' },
  ],
  stops: [
    {
      role:      'Pickup',
      name:      'Green Valley Farm',
      address:   '1202 Seed Lane, Oakhaven, KS',
      time:      '08:00 AM',
      icon:      'location_on',
      dotClass:  'bg-primary/20',
      iconClass: 'text-primary',
    },
    {
      role:      'Destination',
      name:      'Central Mill & Elevator',
      address:   '400 Industrial Way, Wichita, KS',
      time:      '09:30 AM (Est.)',
      icon:      'warehouse',
      dotClass:  'bg-slate-200 dark:bg-slate-700',
      iconClass: 'text-slate-600 dark:text-slate-400',
    },
  ],
  cargo: {
    name:       'Wheat',
    variety:    'Premium Hard Red Winter',
    icon:       'agriculture',
    weightTons: 5.0,
    lotNumber:  'HV-2024-81',
  },
};

export const DRIVER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJyZvMxdR27AXAn_Q-5PW-gsr3pLQex4DY3DN95zAXPN1B48hNtk2HGJSPPf18pIVsU45h6qdScvZ-9kGfWSFGpoqPqrOJhwjEQpwU6XFiqp0Qq-tEHdspNOKoneA87sIYBQZb2dAsLdeHP3CM6nxoOt_cmg9dR5hd429IJF6EJ0HciRGUv4FJLA1axL9GIVTA_xvnmHQecesFh6Kqeb1fhhiO13uh7BqkNX1p4RE0LjG-7kgHM6Cju6WnVUL4v8EQwHL_q4DTD08';

export const MOBILE_NAV: MobileNavItem[] = [
  { label: 'Dash',     icon: 'dashboard'      },
  { label: 'Missions', icon: 'local_shipping', active: true },
  { label: 'Cargo',    icon: 'inventory_2'    },
  { label: 'Profile',  icon: 'account_circle' },
];