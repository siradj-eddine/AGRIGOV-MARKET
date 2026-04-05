import type { Metadata } from "next";
import TransporterProfilePage from "@/components/profile/TransporterProfilePage";

export const metadata: Metadata = {
  title: "My Profile — AgriConnect Transporter",
  description: "Manage your vehicle details, missions and account settings.",
};

export default function Page() {
  return <TransporterProfilePage />;
}