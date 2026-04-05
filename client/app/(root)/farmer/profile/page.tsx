import type { Metadata } from "next";
import FarmerProfilePage from "@/components/profile/FarmerProfilePageClient";

export const metadata: Metadata = {
  title: "My Profile — AgriConnect Farmer",
  description: "Manage your farm details, verification status and account security.",
};

export default function Page() {
  return <FarmerProfilePage />;
}