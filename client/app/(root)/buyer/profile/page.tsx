import type { Metadata } from "next";
import BuyerProfilePage from "@/components/profile/BuyerProfileClient";

export const metadata: Metadata = {
  title: "My Profile — AgriConnect Buyer",
  description: "Manage your account, view your orders and reviews.",
};

export default function Page() {
  return <BuyerProfilePage />;
}