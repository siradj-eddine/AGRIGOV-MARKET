import type { Metadata } from 'next';
import MinistryProductsClientPage from '@/components/Ministry/MinistryProducts/MinistryProductPageClient';

export const metadata: Metadata = {
  title:       'Ministry Products | Ministry of Agriculture',
  description: 'Manage Official product types',
};

export default function CategoriesRoute() {
  return <MinistryProductsClientPage />;
}