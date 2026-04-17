// ─── Ministry Product types ───────────────────────────────────────────────────

export interface MinistryProduct {
  id: number;
  name: string;
  slug: string;
  category: number | null;
  category_name?: string;
  description: string;
  is_active: boolean;
}

export interface MinistryProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MinistryProduct[];
}

export interface MinistryProductPayload {
  name: string;
  slug: string;
  category?: number | null;
  description?: string;
  is_active?: boolean;
}

// Empty form state for create
export const EMPTY_PRODUCT_FORM: MinistryProductPayload = {
  name: "",
  slug: "",
  category: null,
  description: "",
  is_active: true,
};

// Auto-generate slug from name (kebab-case, lowercase)
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export type ProductFormErrors = Partial<Record<keyof MinistryProductPayload, string>>;

export function validateProductForm(form: MinistryProductPayload): ProductFormErrors {
  const e: ProductFormErrors = {};
  if (!form.name.trim()) e.name = "Product name is required.";
  if (!form.slug.trim()) e.slug = "Slug is required.";
  else if (!/^[a-z0-9-]+$/.test(form.slug))
    e.slug = "Slug may only contain lowercase letters, numbers, and hyphens.";
  return e;
}