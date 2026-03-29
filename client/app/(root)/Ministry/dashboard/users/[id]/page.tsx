import type { Metadata } from 'next';
import FarmerVerificationPage from '@/components/Ministry/users/UserValidation/UserValidationPageClient';

export const metadata: Metadata = {
  title:       'Farmer Verification - Amara Okafor | Harvest Intel',
  description: 'Review and approve farmer registration documents and identity verification',
};

export default function FarmerVerificationRoute() {
  return <FarmerVerificationPage />;
}