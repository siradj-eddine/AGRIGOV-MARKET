import type { Metadata } from 'next';
import MissionDetailPage from '@/components/Transporter/Missions/Details/MissionDetailsPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Mission #${id} | Transporter Hub`,
    description: 'View mission details, track delivery, and update status',
  };
}

export default async function MissionDetailRoute({ params }: Props) {
  const { id } = await params;
  console.log('Route - missionId:', id); // ← Add this to debug
  return <MissionDetailPage missionId={id} />;
}