// ─── Status ──────────────────────────────────────────────────────────────────

export type CategoryStatus = 'Active' | 'Inactive';

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string; // Material Symbol name
  subCategoryCount: number;
  status: CategoryStatus;
  qualityScore: number; // 0–100
}

// ─── Quality Standard ────────────────────────────────────────────────────────

export type StandardStatus = 'met' | 'pending';

export interface QualityStandard {
  id: string;
  name: string;
  description: string;
  status: StandardStatus;
}

// ─── Certification ───────────────────────────────────────────────────────────

export interface Certification {
  id: string;
  name: string;
  description: string;
  icon: string; // Material Symbol name
  appliesTo: string[]; // category labels or ['All']
}

// ─── Nav Item ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}






export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',         icon: 'dashboard',   href: '/admin' },
  { label: 'User Management',   icon: 'group',        href: '/admin/users' },
  { label: 'Price Regulation',  icon: 'payments',     href: '/prices' },
  { label: 'Product Categories',icon: 'category',     href: '/categories', active: true },
];

// ─── Categories ──────────────────────────────────────────────────────────────

export const INITIAL_CATEGORIES: Category[] = [
  {
    id:               'grains',
    name:             'Grains',
    icon:             'grass',
    subCategoryCount: 12,
    status:           'Active',
    qualityScore:     85,
  },
  {
    id:               'vegetables',
    name:             'Vegetables',
    icon:             'eco',
    subCategoryCount: 24,
    status:           'Active',
    qualityScore:     92,
  },
  {
    id:               'fruits',
    name:             'Fruits',
    icon:             'nutrition',
    subCategoryCount: 18,
    status:           'Active',
    qualityScore:     78,
  },
  {
    id:               'tubers',
    name:             'Tubers',
    icon:             'potted_plant',
    subCategoryCount: 8,
    status:           'Inactive',
    qualityScore:     45,
  },
];

// ─── Status badge lookup ──────────────────────────────────────────────────────

export const STATUS_BADGE_STYLES: Record<
  Category['status'],
  { badge: string; icon: string; bar: string }
> = {
  Active: {
    badge: 'bg-primary/20 text-primary border border-primary/30',
    icon:  'text-primary',
    bar:   'bg-primary',
  },
  Inactive: {
    badge: 'bg-slate-200 text-slate-500 dark:bg-slate-800 border border-slate-300 dark:border-slate-700',
    icon:  'text-slate-400',
    bar:   'bg-slate-300 dark:bg-slate-600',
  },
};

// ─── Quality Standards ────────────────────────────────────────────────────────

export const INITIAL_QUALITY_STANDARDS: QualityStandard[] = [
  {
    id:          'moisture',
    name:        'Moisture Content',
    description: 'Max threshold: 12.5% for Grains',
    status:      'met',
  },
  {
    id:          'pesticide',
    name:        'Pesticide Residue',
    description: 'Global Standards - Level 0 Compliance',
    status:      'met',
  },
  {
    id:          'uniformity',
    name:        'Size Uniformity',
    description: 'Required for Grade A Export Fruits',
    status:      'pending',
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────

export const CERTIFICATIONS: Certification[] = [
  {
    id:          'fssai',
    name:        'FSSAI Registration',
    description: 'Mandatory for all processed vegetable products.',
    icon:        'gavel',
    appliesTo:   ['Grains', 'Fruits'],
  },
  {
    id:          'organic',
    name:        'Organic Certification',
    description: "Optional, enables 'Organic' marketplace tag.",
    icon:        'public',
    appliesTo:   ['All'],
  },
];