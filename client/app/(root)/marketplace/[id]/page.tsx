import type { Metadata } from "next";
import ProductDetailPage from "@/components/Products/Details/ProductDetailsPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Product — AGRIGOV Marketplace",
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  return <ProductDetailPage productId={id} />;
}