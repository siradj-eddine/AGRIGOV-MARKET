export interface ApiCategory { id: number; name: string; slug: string; }
export type StorageCondition = "Cold Storage" | "Ambient/Dry" | "Airtight Silos";
export type ListingStep = 1 | 2 | 3 | 4;
export type Season = "winter" | "summer" | "fall" | "spring";
export const SEASONS: Season[] = ["winter", "summer", "fall", "spring"];
export interface NavLink {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export interface UploadedImage {
  id: string;
  src: string;   // data-URL preview (or existing Cloudinary URL)
  alt: string;
  file?: File;   // present only for newly-selected local files
}

export interface ProductListingForm {
  // ── API fields ──────────────────────────────────────────────────────────
  title: string;               
  description: string;         
  category: ApiCategory["name"] | "";   
  quantityKg: string;          
  pricePerUnit: string;        
  images: UploadedImage[];
  season: Season;
  farm_id: string;
}

export interface StepMeta {
  step: ListingStep;
  label: string;
}

export const sidebarLinks: NavLink[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "#" },
  { id: "inventory", label: "Inventory", icon: "inventory_2", href: "#", active: true },
  { id: "orders",    label: "Orders",    icon: "shopping_basket", href: "#" },
  { id: "marketplace", label: "Marketplace", icon: "storefront", href: "#" },
  { id: "settings", label: "Settings",  icon: "settings", href: "#" },
];

export const LISTING_STEPS: StepMeta[] = [
  { step: 1, label: "Farm Info" },
  { step: 2, label: "Product Details" },
  { step: 3, label: "Pricing & Availability" },
  { step: 4, label: "Review & Publish" },
];

export const STORAGE_CONDITIONS: StorageCondition[] = [
  "Cold Storage",
  "Ambient/Dry",
  "Airtight Silos",
];

export const OFFICIAL_PRICE_PER_KG = 1.45;
export const PRICE_TOLERANCE_PCT   = 10;

export const FARM_LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ot39th7tKAmXQEOLhwn88no6ELh4XCon5MU8dUYfqwQ4soE3gONTjcOyjPZDhcVhirEvCkgr2rpd_sx-hsuynaDH4OJTo8b9ffAzqMx5mfoyuuMY9qC8NBObZ2SAICOtSmSeh5OSuAE2UeKqGfxtjSr5lF_JVzAiPqZff-RckHrgY-JQy9-ERQ6kvZAodLds2qZjxAWpDY74lbtXalk96kIhcC-447j05xrU1NuRyGM3kab6GNzSwyipYXGL8lDmh-u1qgHmlmTF";

export const USER_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaRJ--U7kT2Av7i-9iC8RJoluL1HP2M5YsoDM9W0q0yCHML5GxyACYMKFa9Xj3shCULAW17W4qd1wrY1mHrba_jZOr-pUFFz62CJMdZm4EAZc834YSEmL_nE2xptm3A2QyTA0pjF0UFpzGkQDFfbNlXu6yjcvaoLvEgH7gQ2HO23d5jVC2BHaex-dLDCTWt0s1e8-99SDtUZfTtLRZp5baw9wEhbudYpJg3hsCLaY2OXs-MpRy96m-FIuYNOdSVlJ-GjQ4dp879QSr";

export const SAMPLE_UPLOADED_IMAGE: UploadedImage = {
  id:  "wheat-preview",
  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFE0wuE_5641M_RLc3IYVW6xrMk-SSyIXDk_ER8XeVlfPVVT1jxWPJM_6orTyjSdoTdRB_RMHamTa_IB23kfycyCtCHQyV2vPZx0waP7H0KnJ2q9h15X7y4-YVe1olXK3ZM_-wijxA0ZBB34W51rUP_fcBjFb0YueQt7eIBPAEipZENqzI8eum_9ubuAej-bk8wotef-1pS230VCO-ekzP4hGk7C8Tr1j0KaqsqgT6BRr8NJxnlII1T0OwCn3uMMsDJYCBWOG89h1",
  alt: "Close up of golden wheat harvest preview",
  // no `file` — this is a remote preview, not uploaded locally
};