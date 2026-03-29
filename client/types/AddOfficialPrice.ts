// ─── Types ────────────────────────────────────────────────────────────────────

export type MeasurementUnit = 'Metric Ton' | 'Kilogram' | 'Bushel';
export type CommodityCategory =
  | 'Grains & Cereals'
  | 'Legumes'
  | 'Fruits & Vegetables'
  | 'Tubers'
  | 'Livestock Feed';

export interface CommodityForm {
  name:            string;
  category:        CommodityCategory;
  baselinePrice:   number | '';
  effectiveDate:   string;
  unit:            MeasurementUnit;
}

export interface RegionVariation {
  id:             string;
  regionName:     string;
  priceAdjust:    string;  // e.g. "+4.2%" — stored as string for free-form input
  yieldPercent:   number;  // 0–100 for the gauge bar
}

export interface QualityStandard {
  label: string;
  value: string;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const TOP_NAV: NavItem[] = [
  { label: 'Dashboard',   icon: '', href: '/admin' },
  { label: 'Index Entry', icon: '', href: '/admin/commodities/new', active: true },
];

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Crops',     icon: 'agriculture',  href: '/farmer/products', active: true },
  { label: 'Inventory', icon: 'inventory_2',  href: '/inventory' },
  { label: 'Reports',   icon: 'analytics',    href: '/admin/reports' },
];

export const CATEGORY_OPTIONS: CommodityCategory[] = [
  'Grains & Cereals',
  'Legumes',
  'Fruits & Vegetables',
  'Tubers',
  'Livestock Feed',
];

export const UNIT_OPTIONS: MeasurementUnit[] = ['Metric Ton', 'Kilogram', 'Bushel'];

export const INITIAL_FORM: CommodityForm = {
  name:          '',
  category:      'Grains & Cereals',
  baselinePrice: '',
  effectiveDate: '',
  unit:          'Metric Ton',
};

export const INITIAL_REGIONS: RegionVariation[] = [
  { id: 'northern', regionName: 'Northern Highlands', priceAdjust: '+4.2%', yieldPercent: 75 },
  { id: 'central',  regionName: 'Central River Basin', priceAdjust: '-1.5%', yieldPercent: 45 },
];

export const QUALITY_STANDARDS: QualityStandard[] = [
  { label: 'Moisture Content Max', value: '13.5%' },
  { label: 'Protein Minimum',      value: '11.0%' },
  { label: 'Foreign Matter Max',   value: '0.5%'  },
];

export const CERTIFYING_OFFICIAL = { name: 'Hon. Marcus Arredondo', key: 'HINTEL-PR-2024-X892-001' };

export const COMMODITY_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuArWclP96woaAqZoFMdFCioNyq9EUl2mpZuqanY1Hkz0dB-_jaxhybgc6TFPIzyRHIkqDeJx_6etXK4f-V9aMGNhfMIImasF1piHJ3DVe2z9dMFT7UPm8JuFNmHij4LnCUBqiAQTQF3UU-vOh9KCwWk6Uyq16PgAObQbJEovstvX8qA0k0GwYkJ7uPzo25WI6mcQ-BqKyI-mD_LbqFLArrA34tmt-4CVUI1gcQU3ZW60Ltk_qpxVN_j4kJC5o4k98Y0_-2yRvbt488';

export const ADMIN_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDWAJesZSM5OG2xlFD391iKrHhdSZYfZm1zbsP2TnhPU_xyeHoMHKOWzT7dwtg8zxP7gzlz7MlLPvPkVIUffxA0x7zqVJf6jHw7vxVLbS9nbqsRjE5xskg7O5R_WhH9W_Mz2TDnO96GJr0_QeoLn0YkYhytH7BwkrNXc79gzxcJjHH-br6NF3hgom9NDu0_ZtGjYbeqGQ3K69PyaznL-phTmGqi6MrHLYvx8TIbJb2rnSnFiO9Y6r7wFcrWiWfJySftKmpZPTTOnM8';