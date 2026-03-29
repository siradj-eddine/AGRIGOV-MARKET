import type { Metadata } from 'next';
import MissionDetailPage from '@/components/Transporter/Missions/Details/MissionDetailsPageClient';

export const metadata: Metadata = {
  title:       'Mission TR-8821 | Transporter Hub',
  description: 'Active transporter mission detail — route, cargo, and actions',
};

export default function MissionDetailRoute() {
  return <MissionDetailPage />;
}