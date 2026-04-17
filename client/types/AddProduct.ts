export interface ApiCategory { id: number; name: string; slug: string; }
export interface MinistryProductOption { id: number; name: string; }

export type Season = "winter" | "summer" | "fall" | "spring";
export const SEASONS: Season[] = ["winter", "summer", "fall", "spring"];

export interface UploadedImage {
  id: string;
  src: string;   // data-URL preview or existing Cloudinary URL
  alt: string;
  file?: File;   // present only for newly-selected local files
}

export interface ProductListingForm {
  ministry_product_id: string;   // numeric string → passed as FormData field
  description:         string;
  quantityKg:          string;   // → stock
  pricePerUnit:        string;   // → unit_price
  images:              UploadedImage[];
  season:              Season;
  farm_id:             string;
}

// Field-level errors returned by the backend, e.g.:
// { "unit_price": ["Price must be between 85.50 and 110.00 kg."] }
export type ApiFieldErrors = Record<string, string[]>;

export interface StepMeta {
  step: 1 | 2 | 3 | 4;
  label: string;
}
export type ListingStep = 1 | 2 | 3 | 4;

export const LISTING_STEPS: StepMeta[] = [
  { step: 1, label: "Farm Info" },
  { step: 2, label: "Product Details" },
  { step: 3, label: "Pricing & Availability" },
  { step: 4, label: "Review & Publish" },
];

export const OFFICIAL_PRICE_PER_KG = 1.45;
export const PRICE_TOLERANCE_PCT   = 10;

export const SAMPLE_UPLOADED_IMAGE: UploadedImage = {
  id:  "wheat-preview",
  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFE0wuE_5641M_RLc3IYVW6xrMk-SSyIXDk_ER8XeVlfPVVT1jxWPJM_6orTyjSdoTdRB_RMHamTa_IB23kfycyCtCHQyV2vPZx0waP7H0KnJ2q9h15X7y4-YVe1olXK3ZM_-wijxA0ZBB34W51rUP_fcBjFb0YueQt7eIBPAEipZENqzI8eum_9ubuAej-bk8wotef-1pS230VCO-ekzP4hGk7C8Tr1j0KaqsqgT6BRr8NJxnlII1T0OwCn3uMMsDJYCBWOG89h1",
  alt: "Close up of golden wheat harvest preview",
};