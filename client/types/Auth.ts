

export type UserRole = "FARMER" | "BUYER" | "TRANSPORTER" | "ADMIN";

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  FARMER:      "/profile",
  BUYER:       "/marketplace",
  TRANSPORTER: "/Transporter/dashboard/missions",
  ADMIN:    "/Ministry/dashboard",
};

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface LoginPayload {
  access: string;
  refresh: string;
  user: AuthUser;
}


export interface StatBadge {
  value: string;
  label: string;
  icon: string;
}


export const fallbackStats: StatBadge[] = [
  { value: "2.4M+", label: "Registered Farmers",  icon: "grass"          },
  { value: "100%",  label: "Verified Buyers",      icon: "storefront"     },
  { value: "12K+",  label: "Active Transporters",  icon: "local_shipping" },
  { value: "48",    label: "Wilayas Covered",      icon: "map"            },
];