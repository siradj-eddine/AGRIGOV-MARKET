// types/Missions.ts

export type MissionStatus = "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "cancelled";

export interface ApiMission {
  id: number;
  order: number;
  order_status: string;
  order_total_weight: number | null;
  order_total_price?: number | null;
  transporter: number | null;
  transporter_email: string | null;
  vehicle: number | null;
  vehicle_info: string | null;
  status: MissionStatus;
  wilaya: string;
  baladiya: string;
  pickup_address: string;
  delivery_address: string;
  notes: string;
  decline_count: number;
  // ✅ Add coordinates
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  delivery_latitude?: number | null;
  delivery_longitude?: number | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface MissionsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiMission[];
}

export interface MissionCreatePayload {
  order: number;
  pickup_address: string;
  delivery_address: string;
  notes?: string;
}

export interface MissionFilterParams {
  page?: number;
  page_size?: number;
  status?: MissionStatus | "";
  wilaya?: string;
  baladiya?: string;
  order_id?: number;
  transporter_id?: number;
  created_after?: string;
  created_before?: string;
  search?: string;
  ordering?: string;
}
// types/Missions.ts

export interface UpcomingMission {
  id: string;
  orderId: string;
  month: string;
  day: string;
  farm: string;
  cargo: string;
  payout: number;
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const MISSION_STATUS_BADGE: Record<MissionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  picked_up: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  in_transit: "bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const MISSION_STATUS_ICON: Record<MissionStatus, string> = {
  pending: "schedule",
  accepted: "check_circle",
  picked_up: "inventory",
  in_transit: "local_shipping",
  delivered: "task_alt",
  cancelled: "cancel",
};

export const MISSION_STATUS_PROGRESS: Record<MissionStatus, number> = {
  pending: 10,
  accepted: 30,
  picked_up: 55,
  in_transit: 75,
  delivered: 100,
  cancelled: 0,
};

export const STATUS_FILTER_OPTIONS: { value: MissionStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function formatMissionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-DZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}