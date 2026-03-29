// ─── Types ────────────────────────────────────────────────────────────────────

export type VerificationStepStatus = 'complete' | 'pending';

export interface VerificationStep {
  id:     string;
  label:  string;
  status: VerificationStepStatus;
}

export interface IdentityDetail {
  label: string;
  value: string;
}

export interface FarmDocument {
  id:         string;
  title:      string;
  subtitle:   string;
  icon:       string;   // Material Symbol name
  iconBgClass: string;  // Tailwind bg + text classes for the icon wrapper
}

export interface ActivityEvent {
  id:        string;
  title:     string;
  timestamp: string;
  body:      string;
  isActive:  boolean; // true = primary dot, false = muted dot
}

export interface FarmerSubmission {
  id:          string;
  name:        string;
  legalName:   string;
  idNumber:    string;
  dobExpiry:   string;
  role:        string;
  submittedAt: string;
  avatarUrl:   string;
  idCardUrl:   string;
  mapImageUrl: string;
  farmName:    string;
  farmCoords:  string;
  farmHectares: number;
}

export interface NavItem {
  label:   string;
  icon:    string;
  href:    string;
  active?: boolean;
  filled?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const TOP_NAV: NavItem[] = [
  { label: 'Dashboard',    icon: '', href: '/admin'                      },
  { label: 'Verification', icon: '', href: '/admin/registrations', active: true },
  { label: 'Reports',      icon: '', href: '/admin/reports'              },
];

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard',    icon: 'dashboard',   href: '/admin'                   },
  { label: 'Verification', icon: 'agriculture', href: '/admin/registrations', active: true, filled: true },
  { label: 'Fields',       icon: 'potted_plant', href: '/regional'               },
  { label: 'Inventory',    icon: 'inventory_2',  href: '/inventory'              },
  { label: 'Reports',      icon: 'analytics',    href: '/admin/reports'          },
];

export const BREADCRUMBS = ['Admin', 'Registrations', 'Pending Review'] as const;

export const FARMER_SUBMISSION: FarmerSubmission = {
  id:           'FRM-9021',
  name:         'Amara Okafor',
  legalName:    'Amara Chidimma Okafor',
  idNumber:     'NG-LGS-4920-X',
  dobExpiry:    '12 May 1988 / 2028',
  role:         'New Farmer',
  submittedAt:  'Oct 24, 2023',
  avatarUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJe3H_pL3_Yolr3zAbXLrBURnQ6mmfjvf4s2zX-ud-EfQdpmN6_4xC6qwk7QegCQXA3rZ1gyubWN5835Nfi_je2D_CRWeG4yX8hVahikTBLQYfoK--jhVnDkFDZe6K9z0dQxvKhP2r-_fndgX806aZ4LNKJlZu22Ytgmpdj7ugmGu8KKPuhJ0s6s8Uuhp8tOGbZo1AOMaLH4Fi-1YGaKphoesVdZJMGS2v7xIDBd_Ysx3wCUdvSXxp40nbBbhXqpbeDKbuAq8Pucc',
  idCardUrl:    'https://lh3.googleusercontent.com/aida-public/AB6AXuDi2tGMVD-UCGPx6BD2ViE0rC-PAG4mAHkDyaM1TRiYY9LvBr3EXtuRaQHoWgSKcpI0Lz73GgkBC_LRb0XYtrwKCzfStOrGosr1xdYuFUU2UU378y_sGpERsau7sYKxlozWKCmDrcD6MDyQxsG6eeIOnFP0WJHpaRxJU8cfvWASqE0ksHF8-gHf7r_uz_YzXeLsDLCBaok-3AxV2K1-qpeHw-FrY-LZ81wHVzKaufnEBukeddy8cASTsp7fa1eI_Icfb4vam-ezcf0',
  mapImageUrl:  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0dhR9sB9P9WNWRn6X0u29OajVblFa7vt4rwa13OFVS9S8WeUtbew-NV4BC2kjCsGv5PPbkIumkK0ufb4sEARRXhXduuZTrEylWIyfRD9lWAzsAbAIMF1e2X7FaIogp8nIR-hpFVaisHTWPENiJecuHCD4KcFoOnNTNqIPdod74oABzv3tK8EOmiLyuIMmX0QB5PmJYH4wOs2EGRK8HwAtPsxjDjSTn8am6s7lTAL4XEeY6inhiCE8OrDuNWfD4Ys175XJPEDenQY',
  farmName:     'Green Valley Fields',
  farmCoords:   '7.3775° N, 3.9470° E',
  farmHectares: 4.2,
};

export const IDENTITY_DETAILS: IdentityDetail[] = [
  { label: 'Full Name (Legal)', value: FARMER_SUBMISSION.legalName  },
  { label: 'ID Number',         value: FARMER_SUBMISSION.idNumber   },
  { label: 'DOB / Expiry',      value: FARMER_SUBMISSION.dobExpiry  },
];

export const FARM_DOCUMENTS: FarmDocument[] = [
  {
    id:          'land-deed',
    title:       'Certificate of Occupancy (Land Deed)',
    subtitle:    'Document ID: DEED-442-OKF • Verified Registry',
    icon:        'landscape',
    iconBgClass: 'bg-primary/10 text-primary',
  },
  {
    id:          'organic-cert',
    title:       'National Organic Farmer Certification',
    subtitle:    'Exp: Dec 2024 • Tier 1 Sustainability',
    icon:        'eco',
    iconBgClass: 'bg-neutral-dark/10 text-neutral-dark dark:text-slate-300',
  },
  {
    id:          'equipment',
    title:       'Machinery Inventory & Insurance',
    subtitle:    '3 Units Verified • Comprehensive Coverage',
    icon:        'precision_manufacturing',
    iconBgClass: 'bg-slate-200/50 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  },
];

export const ACTIVITY_HISTORY: ActivityEvent[] = [
  {
    id:        'submitted',
    title:     'Application Submitted',
    timestamp: 'Oct 24, 11:32 AM',
    body:      'Amara uploaded 3 documents and completed the face-match biometric check successfully.',
    isActive:  true,
  },
  {
    id:        'risk-scan',
    title:     'Automated Risk Scan',
    timestamp: 'Oct 24, 11:34 AM',
    body:      'AI Background check: Low Risk. No matches in global sanction lists or debt registries.',
    isActive:  false,
  },
];

export const VERIFICATION_STEPS: VerificationStep[] = [
  { id: 'phone-email', label: 'Phone & Email Verified',    status: 'complete' },
  { id: 'biometric',   label: 'Biometric Identity Check',   status: 'complete' },
  { id: 'ai-registry', label: 'Registry Doc Check (AI)',    status: 'complete' },
  { id: 'human-audit', label: 'Human Document Audit',       status: 'pending'  },
];

export const ADMIN_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9eSB4RV_Ahjjq8_rSrfRX0lpajaiPuYzxN7v6Zrt8wRbuo_5qCKu-UWyefWNwhyeB-_qZyi_kQvLpOUw0Ss5ypzNf91IUkLhx11W7N4ZjYeVAXqBoSTeWN-FpYKGnIjnUoWbb6odINc313xo8ag6z3SR7qdW5FyRcm1wfwAMSArWE7WrBo8tgfbY_Qb4UFuJrAL70qQgX9PE6pcICVJuEih7WHEXcw5orLVwVQmfipdpJWEv2Dvk4LvgCHzgV7ZzhZ_fUcOm7Zyw';