// ─── Role ─────────────────────────────────────────────────────────────────────

export type RegisterRole = "FARMER" | "BUYER" | "TRANSPORTER";

export const ROLE_LABELS: Record<RegisterRole, string> = {
  FARMER:      "Farmer",
  BUYER:       "Buyer",
  TRANSPORTER: "Transporter",
};

export const ROLE_ICONS: Record<RegisterRole, string> = {
  FARMER:      "grass",
  BUYER:       "storefront",
  TRANSPORTER: "local_shipping",
};

export const ROLE_DESCRIPTIONS: Record<RegisterRole, string> = {
  FARMER:      "Register your farm and sell produce directly to buyers.",
  BUYER:       "Purchase agricultural products at competitive prices.",
  TRANSPORTER: "Provide transport services for agricultural goods.",
};

// ─── Steps ────────────────────────────────────────────────────────────────────

export type RegistrationStep = 1 | 2 | 3;

export const STEPS: { step: RegistrationStep; label: string }[] = [
  { step: 1, label: "Your Role"    },
  { step: 2, label: "Account Info" },
  { step: 3, label: "Profile"      },
];

export const STEP_PROGRESS: Record<RegistrationStep, number> = {
  1: 33,
  2: 66,
  3: 100,
};

// ─── Form state ───────────────────────────────────────────────────────────────

/** Step 2 — same for every role */
export interface AccountFormState {
  email:           string;
  username:        string;
  phone:           string;
  password:        string;
  confirmPassword: string;
}

/** Step 3 — farmer */
export interface FarmerProfileState {
  age:                 string;
  wilaya:              string;
  baladiya:            string;
  farm_name:           string;
  farm_size:           string;
  Address:             string;
  profile_image:       File | null;   // avatar — required by backend
  farmer_card_image:   File | null;
  national_card_image: File | null;
}

/** Step 3 — buyer */
export interface BuyerProfileState {
  age:                    string;
  profile_image:          File | null;   // avatar — required by backend
  business_license_image: File | null;
}

/** Step 3 — transporter */
export interface TransporterProfileState {
  age:                  string;
  profile_image:        File | null;   // avatar — required by backend
  vehicule_type:        string;
  vehicule_model:       string;
  vehicule_year:        string;
  vehicule_capacity:    string;
  driver_license_image: File | null;
  grey_card_image:      File | null;
}

export type ProfileFormState =
  | FarmerProfileState
  | BuyerProfileState
  | TransporterProfileState;

// ─── Algeria — 58 wilayas ─────────────────────────────────────────────────────

export const WILAYAS: string[] = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa",
  "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa",
  "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel",
  "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
  "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
  "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

export const VEHICLE_TYPES = [
  "Truck", "Van", "Pickup", "Refrigerated Truck", "Flatbed Truck",
  "Tanker", "Mini Truck",
];

// ─── Sidebar data ─────────────────────────────────────────────────────────────

export const BENEFITS = [
  {
    icon: "trending_up",
    title: "Better Market Prices",
    description: "Connect directly with buyers and get fair market prices.",
  },
  {
    icon: "verified",
    title: "Verified Network",
    description: "Every participant is verified by Ministry agents.",
  },
  {
    icon: "support_agent",
    title: "24/7 Support",
    description: "Dedicated support team ready to help you at any time.",
  },
  {
    icon: "payments",
    title: "Secure Payments",
    description: "Guaranteed payments through the official platform.",
  },
];

export const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuALKq-7S-AtxucEfOS_VyQZ5G3ZDFOA0m0StgPJyw0iAuhqldc2Co0mUwqBW0GEN1ZPCrX6hCERXPZ6GxP-5xbXVfR7nKyJ5RcGgt1U2o4oTb3SLJgpwXthdPiDKDqoFupZykQN2Qvomp2XJ_IcliNF8X6jIMVwMT8A0vGYOxql9k26pK6RAvyXaIZeww_MfZbsLsQjFVAfEiqIMegUP7G-jsGXpfMrnypBRFMCjMWmK3koA09uysEJdOpXDPBfF3Lg33RgWJwrqNJj";

export const COAT_OF_ARMS_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Emblem_of_Algeria.svg/240px-Emblem_of_Algeria.svg.png";