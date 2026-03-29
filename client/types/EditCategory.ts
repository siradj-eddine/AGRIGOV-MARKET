// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryForm {
  name:        string;
  description: string;
}

export interface QualityMetric {
  id:         string;
  name:       string;
  limit:      string;        // display label e.g. "Max Allowed: 14.0%"
  value:      string;        // display value e.g. "14.0%"
  barPercent: number;        // 0–100
  barClass:   string;        // Tailwind colour class for the bar
  valueClass: string;        // Tailwind colour class for the value label
}

export interface Certification {
  id:    string;
  label: string;
}

export interface SubCategory {
  id:           string;
  name:         string;
  imageUrl:     string;
  imageAlt:     string;
  variantCount: number;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
  filled?: boolean;
}

export interface MobileNavItem {
  label:   string;
  icon:    string;
  active?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard',   href: '/admin' },
  { label: 'Fields',    icon: 'potted_plant', href: '/regional', active: true, filled: true },
  { label: 'Crops',     icon: 'agriculture',  href: '/inventory' },
  { label: 'Inventory', icon: 'inventory_2',  href: '/inventory/new' },
  { label: 'Reports',   icon: 'analytics',    href: '/admin/reports' },
];

export const TOP_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '', href: '/admin',     active: true },
  { label: 'Inventory', icon: '', href: '/inventory' },
  { label: 'Reports',   icon: '', href: '/admin/reports' },
];

export const MOBILE_NAV: MobileNavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Crops',     icon: 'agriculture' },
  { label: 'Inventory', icon: 'inventory_2' },
  { label: 'Profile',   icon: 'person' },
];

export const BREADCRUMBS = ['Catalog', 'Categories', 'Edit Grains'] as const;

export const INITIAL_FORM: CategoryForm = {
  name:        'Grains',
  description:
    'Includes all cereal crops grown for the edible components of their grain. This category covers primary sustenance crops requiring strict moisture control and pest management during storage and distribution.',
};

export const INITIAL_METRICS: QualityMetric[] = [
  {
    id:         'moisture',
    name:       'Moisture Content',
    limit:      'Max Allowed: 14.0%',
    value:      '14.0%',
    barPercent: 70,
    barClass:   'bg-primary',
    valueClass: 'text-primary',
  },
  {
    id:         'pesticide',
    name:       'Pesticide Residue',
    limit:      'Limit: 0.01 mg/kg',
    value:      '0.01 mg/kg',
    barPercent: 20,
    barClass:   'bg-red-500',
    valueClass: 'text-red-500',
  },
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  { id: 'fssai',   label: 'FSSAI' },
  { id: 'organic', label: 'Organic' },
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  {
    id:           'maize',
    name:         'Maize',
    imageUrl:     'https://lh3.googleusercontent.com/aida-public/AB6AXuAUew8-3wT5Njt6cO4Oy9Klzz-jwcZqJ4Z1JEqPVzj5jkKD7Z3KTuq54yqOII6Hdv-VTSjsqXb92TWYx6JpRW6rZc1OR5WSdoteAT51ljcqTaqqpHf_DbzpguLyG9zk42ul9IB6E0_ziHdMqE8w6dZgIcRzkHTF-aSLBsdtNfVMBAha-LzAUpGq20E8uRDnagSDjaCPrcn7nXd8Jt-tZ8yuj_s_-74m1yVnbj3aMdx3_c01Jdrs210Kfmgpq6tPUdWcDpYFcMre1VQ',
    imageAlt:     'Golden organic maize kernels on a fresh cob',
    variantCount: 124,
  },
  {
    id:           'wheat',
    name:         'Wheat',
    imageUrl:     'https://lh3.googleusercontent.com/aida-public/AB6AXuDU-Ze7DWWNZA5t6k97mx6WqWxX89wqpmr1_cXtQ9L2cy8A2E0F54_N2w7f7DEl-7O9VZegeSZRYnjuUqsJiEzpeKKsJljfCiyX2Ue45R5rsMszoZxpzuaWePS6a_jeqDojeoMlsCXreuEqrXqOG5RkO-pzLeNzfo-2kwbGgFvyVHefgmTr1PBD3Nm7cMCFuPhHKDf-Se-rwiE2zLLgkqi8lU_0vYEAo2rLAGASZ-wexeYMSM1JW5u2tt164e6nQw27V3xvbVfvJKk',
    imageAlt:     'Wooden scoop filled with raw golden wheat grains',
    variantCount: 89,
  },
  {
    id:           'rice',
    name:         'Rice',
    imageUrl:     'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMPh8md4RuWxbT5sibwW9pMFMCHvXmwZbFGJn_vsECO-5uK3cGAYcMyamMPBmIMeN9vNvswrmHK_NsBCE4GjfQ8YJWt27zfUmEO3RZg7spsTU8Gm8hKcla01T0Rlylg3mh3wcjRg1n1YEWsaL_0odX0GgSKRTC1X8vLkR1ggAqV8O_Jb6VPcdEHdL5HqfgbH1EPHVxld7_MpntAenv0scuc9TeSVFJ4B873Juh3LRofToFFSq2W-Fc9qgb8ZeZCJ7PLsrdsc16l8',
    imageAlt:     'Long-grain white basmati rice on a dark slate surface',
    variantCount: 210,
  },
];

export const ADMIN_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDmNkR_nnVmkiJ8KMxiRRxlMGSZYA2gjHPbNqYNtH5DMHCkIhQtLZ_IIstbsMCMmo5KsCoEz50sP8G8wqRWHbc4dgywpMhEQhmn8Afp2qHNTbjHHo2v1emYAKdl36H9DXy9O6EXMeEUus5PJfQ4JEcLYNNA6JxOgHE5lSHm5IrqitHQPUWW6sj32eH_6d-0n3dnzUST7zyabGq2D-oUxj20jEICL3LwMi9BfPw0QIASEnZHjTOUBi2kCS4hukEHYHp1tXaLM-W6JFk';

export const LAST_MODIFIED = { by: 'Administrator', date: 'October 24, 2023' };