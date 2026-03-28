import type { Metadata } from 'next';
import CategoryManagementPage from '@/components/Ministry/Categories/CategoryManagementClient';

export const metadata: Metadata = {
  title:       'Category Management | Ministry of Agriculture',
  description: 'Manage agricultural product classifications and quality metrics',
};

export default function CategoriesRoute() {
  return <CategoryManagementPage />;
}