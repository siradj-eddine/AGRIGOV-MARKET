// types/Transporter.ts

export type CargoTag = "Perishable" | "Fragile" | "Bulk" | "Livestock";
export type MissionStatus = "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "cancelled";
export type SidebarTab = "Available" | "My Missions";
export type DriverStatus = "Online" | "Offline" | "On Break";
export type MissionStep = "Picked Up" | "Transit" | "Delivered";

// Map backend status to UI step
export const statusToStep: Record<string, MissionStep> = {
  accepted: "Picked Up",
  picked_up: "Picked Up",
  in_transit: "Transit",
  delivered: "Delivered",
};

// Map UI step to backend status
export const stepToStatus: Record<MissionStep, string> = {
  "Picked Up": "picked_up",
  Transit: "in_transit",
  Delivered: "delivered",
};

export interface TransportRequest {
  id: number;
  cargo: string;
  tag: CargoTag;
  pay: number;
  weightKg: number;
  distanceKm: number;
  pickup: string;
  dropoff: string;
  estimatedMins: number;
  wilaya: string;
  baladiya: string;
}

export interface ActiveMission {
  missionId: number;
  cargo: string;
  status: string;
  etaMins: number;
  currentStep: MissionStep;
  orderId: number;
}

export interface MapPin {
  id: string;
  label: string;
  sublabel: string;
  topPct: number;
  leftPct: number;
  variant: "pickup" | "dropoff" | "available";
}

export interface StatsWidget {
  id: string;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
}

export const cargoTagStyles: Record<CargoTag, string> = {
  Perishable: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Fragile: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Bulk: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Livestock: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export const MISSION_STEPS: MissionStep[] = ["Picked Up", "Transit", "Delivered"];