import type { Metadata } from "next";
import MissionsPage from "@/components/Inventory/Missions/FarmerMissionsPageClient";

export const metadata: Metadata = {
  title: "Transportation Missions | AgriGov",
  description: "Monitor and manage all harvest transportation missions for your farm.",
};

export default function MissionsRoute() {
  return <MissionsPage />;
}