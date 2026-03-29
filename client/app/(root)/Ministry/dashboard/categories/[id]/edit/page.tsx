import type { Metadata } from 'next';
import CategoryEditPage from '@/components/Ministry/Categories/Edit/CategoryEditPageClient';

export const metadata: Metadata = {
  title:       'Edit Category: Grains | Harvest Intel',
  description: 'Configure regulatory standards, quality benchmarks, and taxonomic structures for the Grains category',
};

export default function CategoryEditRoute() {
  return <CategoryEditPage />;
}