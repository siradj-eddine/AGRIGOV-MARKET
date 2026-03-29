import type { Metadata } from 'next';
import CommodityEntryPage from '@/components/Ministry/Pricings/Add/AddPricePageClient';

export const metadata: Metadata = {
  title:       'Add Official Price | Agrigov Market Dashboard',
  description: 'Official administrative entry for the national agricultural commodity pricing index',
};

export default function CommodityEntryRoute() {
  return <CommodityEntryPage />;
}