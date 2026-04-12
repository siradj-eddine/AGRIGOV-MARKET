import type { Metadata } from 'next';
import MissionManagementPage from '@/components/Transporter/Missions/MissionsClientPage';

export const metadata: Metadata = {
  title: 'Mission Management | Transporter Hub',
  description: 'Manage active and upcoming delivery missions',
};

export default function MissionsRoute() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <MissionManagementPage />
    </div>
  );
}