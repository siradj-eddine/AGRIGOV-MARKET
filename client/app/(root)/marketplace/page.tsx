import type { Metadata } from "next";
import MarketplaceCatalog from "@/components/Products/MarketplaceCatalog";

export const metadata: Metadata = {
  title: "Marketplace — AGRIGOV",
  description: "Browse fresh agricultural products from verified farmers across Algeria.",
};

export default function MarketplacePage() {
  return <MarketplaceCatalog />;
}