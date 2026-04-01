import type { Metadata } from "next";
import ShoppingCart from "@/components/Cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart — AgriConnect",
};

export default function CartPage() {
  return <ShoppingCart />;
}