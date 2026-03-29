import type { Metadata } from 'next';
import PriceManagementPage from '@/components/Ministry/Pricings/Edit/EditPricePageClient';

export const metadata: Metadata = {
  title:       'Price Management | Harvest Intel',
  description: 'Official price revision and market trend analysis for Premium Yellow Maize',
};

export default function PriceManagementRoute() {
  return <PriceManagementPage />;
}