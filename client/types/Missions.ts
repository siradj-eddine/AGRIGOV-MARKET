// ─── Mission Status ───────────────────────────────────────────────────────────

export type MissionStatus = 'In Progress' | 'Upcoming' | 'Completed';

// ─── Mission Phase (for in-progress cards) ───────────────────────────────────

export type MissionPhase = 'Active Delivery' | 'In Transit';

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface MissionTab {
  label:  MissionStatus;
  count:  number;
}

// ─── Location ─────────────────────────────────────────────────────────────────

export interface MissionLocation {
  label:    string;  // e.g. "Pickup - Farmer" | "Drop-off - Buyer"
  name:     string;
  address:  string;
  icon:     string;  // Material Symbol name
  iconClass?: string; // optional colour override class
}

// ─── Active Mission ───────────────────────────────────────────────────────────

export interface ActiveMission {
  id:          string;
  orderId:     string;          // e.g. "#TR-8821"
  phase:       MissionPhase;
  mapImageUrl: string;
  mapImageAlt: string;
  chipLabel:   string;          // e.g. "Current Trip" | "En Route"
  chipClass:   string;          // Tailwind classes for the chip
  payout:      number;
  pickup:      MissionLocation;
  dropoff:     MissionLocation;
  cargo:       string;          // e.g. "Wheat"
  weightTons:  number;
  actionLabel: string;          // CTA button text
  actionIcon:  string;          // Material Symbol name
  actionClass: string;          // Tailwind classes for the CTA button
}

// ─── Upcoming Mission ─────────────────────────────────────────────────────────

export interface UpcomingMission {
  id:         string;
  orderId:    string;
  month:      string;  // e.g. "Oct"
  day:        number;
  farm:       string;
  cargo:      string;  // e.g. "Soybeans (12.5 T)"
  payout:     number;
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
  filled?: boolean; // true → FILL=1 on the icon
  dividerBefore?: boolean;
}


// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard',              href: '/transporter' },
  { label: 'Missions',  icon: 'task',                   href: '/transporter/missions', active: true, filled: true },
  { label: 'Fleet',     icon: 'group',                  href: '/transporter/fleet' },
  { label: 'Earnings',  icon: 'account_balance_wallet', href: '/transporter/earnings' },
  { label: 'Settings',  icon: 'settings',               href: '/transporter/settings', dividerBefore: true },
];

// ─── Status Tabs ──────────────────────────────────────────────────────────────

export const MISSION_TABS: MissionTab[] = [
  { label: 'Upcoming',    count: 4  },
  { label: 'In Progress', count: 2  },
  { label: 'Completed',   count: 12 },
];

export const DEFAULT_TAB: MissionStatus = 'In Progress';

// ─── Active Missions ──────────────────────────────────────────────────────────

export const ACTIVE_MISSIONS: ActiveMission[] = [
  {
    id:          'mission-8821',
    orderId:     '#TR-8821',
    phase:       'Active Delivery',
    mapImageUrl: 'https://placeholder.pics/svg/300',
    mapImageAlt: 'Satellite map view showing delivery route from farm to mill',
    chipLabel:   'Current Trip',
    chipClass:   'bg-primary text-background-dark',
    payout:      450.00,
    pickup: {
      label:    'Pickup - Farmer',
      name:     'Green Valley Farm',
      address:  '122 Agriculture Rd, Springfield',
      icon:     'location_on',
      iconClass: 'text-primary',
    },
    dropoff: {
      label:    'Drop-off - Buyer',
      name:     'Central Mill & Elevator',
      address:  'Industrial Zone 4, Port Area',
      icon:     'flag',
      iconClass: 'text-slate-400',
    },
    cargo:       'Wheat',
    weightTons:  5.0,
    actionLabel: 'Confirm Pickup',
    actionIcon:  'check_circle',
    actionClass: 'bg-primary hover:bg-primary/90 text-background-dark shadow-lg shadow-primary/20',
  },
  {
    id:          'mission-9045',
    orderId:     '#TR-9045',
    phase:       'In Transit',
    mapImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmI3HWAxo91q5AxXaT8hRh5wbmdBaPvmLYU9fackxDlUoEkgo_9nev5XUaBwugI5VwsFtsWyXCOQ5PnGtyH4DA7RNm9nP_zIORYCvlbhlEul9ZTntGRcy7jSgAMhadYR_khVcu-X8Zs_aIETy1m1G2ulmm3Qcdf1W3ZZrRAKGIPDvU7XB9x-eKcqg1tN0Fq6mfPOXjBfRFBc2JgE0fkQge2DEqVqUmqURL-Iaosru-ZRoaKd-7VtqXEXtklr_b113UwfWNf5-1SWZ5',
    mapImageAlt: 'Satellite map view showing long distance route',
    chipLabel:   'En Route',
    chipClass:   'bg-slate-900 text-white',
    payout:      280.00,
    pickup: {
      label:    'Pickup - Completed',
      name:     'Sunny Acres',
      address:  'Rural Route 9, West Fields',
      icon:     'check_circle',
      iconClass: 'text-slate-400',
    },
    dropoff: {
      label:    'Drop-off - Heading To',
      name:     'Regional Grain Elevator',
      address:  'Hub 12, Terminal South',
      icon:     'local_shipping',
      iconClass: 'text-primary',
    },
    cargo:       'Corn',
    weightTons:  3.2,
    actionLabel: 'Start Offloading',
    actionIcon:  'unarchive',
    actionClass: 'bg-primary/20 hover:bg-primary/30 text-slate-900 dark:text-slate-100',
  },
];

// ─── Upcoming Missions ────────────────────────────────────────────────────────

export const UPCOMING_MISSIONS: UpcomingMission[] = [
  {
    id:      'upcoming-1102',
    orderId: '#TR-1102',
    month:   'Oct',
    day:     24,
    farm:    'Blueberry Ridge',
    cargo:   'Soybeans (12.5 T)',
    payout:  890.00,
  },
];

// ─── Phase label styles ───────────────────────────────────────────────────────

export const PHASE_LABEL_STYLES: Record<ActiveMission['phase'], string> = {
  'Active Delivery': 'text-primary',
  'In Transit':      'text-slate-500',
};