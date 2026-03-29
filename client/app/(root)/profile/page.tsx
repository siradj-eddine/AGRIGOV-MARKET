import type { Metadata } from 'next';
import FarmerProfilePage from '@/components/profile/ProfilePageClient';

export const metadata: Metadata = {
  title:       'Account Overview | Harvest Intel',
  description: 'Manage your farmer profile, farm location, payment methods and security settings',
};

export default function FarmerProfileRoute() {
  return <FarmerProfilePage />;
}