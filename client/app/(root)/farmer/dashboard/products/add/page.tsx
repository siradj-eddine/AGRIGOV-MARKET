import AddProductPage from "@/components/Inventory/AddProduct/AddProductPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Product | Green Acres Farm",
};

export default function Page() {
  return <AddProductPage />;
}