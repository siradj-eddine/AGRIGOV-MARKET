import type { Metadata } from 'next';
import ProductEditPage from '@/components/Inventory/EditProduct/ProducEditPageClient';

export const metadata: Metadata = {
  title:       'Edit Product | Harvest Intel',
  description: 'Manage crop specifications, pricing, and inventory for your marketplace listing',
};

export default function ProductEditRoute() {
  return <ProductEditPage />;
}