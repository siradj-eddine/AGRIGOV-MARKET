// ─── Unified GET /api/users/me response ──────────────────────────────────────
// One endpoint returns user + role-specific profile + extras.
// No separate role endpoints needed for reading.

export type UserRole = "FARMER" | "BUYER" | "TRANSPORTER" | "MINISTRY";

// ── Shared user object (same across all roles) ──────────────────────────────

export interface ApiUser {
  id:          number;
  email:       string;
  username:    string;
  phone:       string;
  role:        UserRole;
  is_verified: boolean;
  is_active:   boolean;
  created_at:  string;
}

// ── Role-specific profile shapes ─────────────────────────────────────────────

export interface FarmerProfile {
  age:                 number | null;
  wilaya:              string;
  baladiya:            string;
  farm_size:           number | null;
  address:             string;           // lowercase in new API
  farmer_card_image:   string | null;    
  national_id_image:   string | null;    // renamed from national_card_image
  profile_image:       string | null;    
}

export interface BuyerProfile {
  age: number | null;
  bussiness_license_image: string | null;
  profile_image: string | null;   
}

export interface TransporterProfile {
  age:                  number | null;
  driver_license_image: string | null;   
  grey_card_image:      string | null;   
  profile_image:        string | null;   
  // vehicle fields are separate (extras.vehicles_count)
}

// ── Extras (role-specific counts / summaries) ────────────────────────────────

export interface FarmerExtras    { farms_count:   number }
export interface BuyerExtras     { orders_count:  number }
export interface TransporterExtras { vehicles_count: number }

// ── Discriminated union response ─────────────────────────────────────────────

export interface FarmerMeResponse {
  status: "success";
  code:   200;
  data: {
    user:    ApiUser;
    profile: FarmerProfile;
    extras:  FarmerExtras;
  };
}

export interface BuyerMeResponse {
  status: "success";
  code:   200;
  data: {
    user:    ApiUser;
    profile: BuyerProfile;
    extras:  BuyerExtras;
  };
}

export interface TransporterMeResponse {
  status: "success";
  code:   200;
  data: {
    user:    ApiUser;
    profile: TransporterProfile;
    extras:  TransporterExtras;
  };
}

// Generic — used when the role is not yet known
export type MeResponse =
  | FarmerMeResponse
  | BuyerMeResponse
  | TransporterMeResponse;

// ─── Form state for editable fields ──────────────────────────────────────────

export interface EditableUserFields {
  email:    string;
  username: string;
  phone:    string;
}

export interface ChangePasswordFields {
  current_password:  string;
  new_password:      string;
  confirm_password:  string;
}

// ─── Security toggles (UI-only, no API equivalent yet) ───────────────────────

export interface SecuritySetting {
  id:          string;
  label:       string;
  description: string;
  type:        "toggle" | "link";
  enabled?:    boolean;
  linkLabel?:  string;
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySetting[] = [
  {
    id:          "two_factor",
    label:       "Two-Factor Authentication",
    description: "Require a code from your phone on each login.",
    type:        "toggle",
    enabled:     false,
  },
  {
    id:          "login_alerts",
    label:       "Login Alerts",
    description: "Get notified by email on new sign-ins.",
    type:        "toggle",
    enabled:     true,
  },
  {
    id:          "linked_id",
    label:       "National ID Verification",
    description: "Link your national identity card to your account.",
    type:        "link",
    linkLabel:   "Verify",
  },
];

// ─── Activity shapes ──────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";

export interface OrderSummary {
  id:           number;
  order_number: string;
  status:       OrderStatus;
  total:        number;
  total_items:  number;
  created_at:   string;
}

export interface ReviewSummary {
  id:           number;
  product_name: string;
  rating:       number;
  comment:      string;
  created_at:   string;
}

export type MissionStatus = "assigned" | "in_progress" | "completed" | "cancelled";

export interface MissionSummary {
  id:           number;
  order_number: string;
  status:       MissionStatus;
  pickup:       string;
  delivery:     string;
  scheduled_at: string;
  earnings : number
}

// ─── Status badge styles ──────────────────────────────────────────────────────

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  in_transit: "bg-orange-100 text-orange-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export const MISSION_STATUS_STYLES: Record<MissionStatus, string> = {
  assigned:    "bg-blue-100 text-blue-700",
  in_progress: "bg-orange-100 text-orange-700",
  completed:   "bg-green-100 text-green-700",
  cancelled:   "bg-red-100 text-red-700",
};