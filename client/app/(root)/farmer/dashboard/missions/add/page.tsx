import type { Metadata } from "next";
import AddMissionPage from "@/components/Inventory/Missions/add/AddMissionPageClient";

export const metadata: Metadata = {
  title: "Create Mission | AgriGov",
  description: "Request a verified transporter for your confirmed crop order.",
};

export default function AddMissionRoute() {
  return <AddMissionPage />;
}