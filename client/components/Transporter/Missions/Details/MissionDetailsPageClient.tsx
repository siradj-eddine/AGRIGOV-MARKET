'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RouteTimeline from './RouteTimeLine';
import PayoutCard from './PayoutCard';
import CargoCard from './CargoCard';
import MissionActions from './MissionActions';
import MissionDetailMobileNav from './MissionDetailsMobileNav';
import { transporterApi } from '@/lib/api';
import { ApiMission } from '@/types/Missions';

// Dynamically import map to avoid SSR issues
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-80 flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
        <p className="text-sm text-slate-500 mt-2">Loading map...</p>
      </div>
    </div>
  ),
});

interface Props {
  missionId: string;
}

export default function MissionDetailPage({ missionId }: Props) {
  const router = useRouter();
  const [mission, setMission] = useState<ApiMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchMissionDetail = async () => {
      if (!missionId) return;
      try {
        const data = await transporterApi.getMissionDetail(parseInt(missionId));
        setMission(data);
      } catch (err) {
        console.error('Failed to fetch mission detail:', err);
        setError('Mission not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMissionDetail();
  }, [missionId]);

  const getProgressPercent = (status: string): number => {
    const progressMap: Record<string, number> = {
      pending: 10,
      accepted: 30,
      picked_up: 55,
      in_transit: 75,
      delivered: 100,
      cancelled: 0,
    };
    return progressMap[status] ?? 0;
  };

  async function handleScanQR() {
    setIsScanLoading(true);
    // TODO: implement QR scanner
    await new Promise((r) => setTimeout(r, 800));
    setIsScanLoading(false);
  }

  async function handleUpdateStatus() {
    if (!missionId || !mission) return;
    setIsUpdateLoading(true);
    try {
      const statusFlow: Record<string, 'picked_up' | 'in_transit' | 'delivered'> = {
        accepted: 'picked_up',
        picked_up: 'in_transit',
        in_transit: 'delivered',
      };
      const newStatus = statusFlow[mission.status];
      if (!newStatus) return;

      await transporterApi.updateMissionStatus(parseInt(missionId), newStatus);
      const updated = await transporterApi.getMissionDetail(parseInt(missionId));
      setMission(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdateLoading(false);
    }
  }

  function handleNavigate() {
    if (mission?.pickup_latitude && mission?.pickup_longitude && 
        mission?.delivery_latitude && mission?.delivery_longitude) {
      const url = `https://www.google.com/maps/dir/${mission.pickup_latitude},${mission.pickup_longitude}/${mission.delivery_latitude},${mission.delivery_longitude}`;
      window.open(url, '_blank');
    } else if (mission?.pickup_address && mission?.delivery_address) {
      const url = `https://www.google.com/maps/dir/${encodeURIComponent(mission.pickup_address)}/${encodeURIComponent(mission.delivery_address)}`;
      window.open(url, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="mt-4 text-slate-500">Loading mission details...</p>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-3">error</span>
          <p className="text-slate-500">Mission not found</p>
          <button
            onClick={() => router.push('/Transporter/dashboard/missions')}
            className="mt-4 px-4 py-2 bg-primary text-black rounded-lg"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  const orderTotalPrice = mission.order_total_price || 0;
  const pickupName = mission.pickup_address?.split(',')[0] || 'Pickup';
  const deliveryName = mission.delivery_address?.split(',')[0] || 'Delivery';

  const stops = [
    {
      role: 'Pickup',
      name: pickupName,
      address: mission.pickup_address || '',
      time: mission.picked_up_at ? new Date(mission.picked_up_at).toLocaleTimeString() : 'Scheduled',
      icon: 'location_on',
      dotClass: 'bg-primary/20',
      iconClass: 'text-primary',
    },
    {
      role: 'Destination',
      name: deliveryName,
      address: mission.delivery_address || '',
      time: mission.delivered_at ? new Date(mission.delivered_at).toLocaleTimeString() : 'Pending',
      icon: 'warehouse',
      dotClass: 'bg-slate-200 dark:bg-slate-700',
      iconClass: 'text-slate-600 dark:text-slate-400',
    },
  ];

  const cargo = {
    name: `Order #${mission.order}`,
    variety: mission.notes || 'Agricultural produce',
    icon: 'agriculture',
    weightTons: mission.order_total_weight ? parseFloat(mission.order_total_weight.toFixed(2)) : 0,
    lotNumber: `LOT-${mission.order}`,
    totalPrice: orderTotalPrice.toString(),
  };
// Add this before the return statement
console.log('Map Coordinates:', {
  pickupLat: mission.pickup_latitude,
  pickupLng: mission.pickup_longitude,
  deliveryLat: mission.delivery_latitude,
  deliveryLng: mission.delivery_longitude,
});
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="pt-6 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Dynamic Map Section */}
        <div className="mb-6">
          <DynamicMap
            pickupLat={mission.pickup_latitude ?? null}
            pickupLng={mission.pickup_longitude ?? null}
            deliveryLat={mission.delivery_latitude ?? null}
            deliveryLng={mission.delivery_longitude ?? null}
            pickupAddress={mission.pickup_address}
            deliveryAddress={mission.delivery_address}
            status={mission.status}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <RouteTimeline stops={stops} />
          </div>

          {/* Right column - Info & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <PayoutCard
              payout={orderTotalPrice}
              progressPercent={getProgressPercent(mission.status)}
            />
            <CargoCard cargo={cargo} />
            <MissionActions
              status={mission.status}
              syncedAgo="Just now"
              onScanQR={handleScanQR}
              onUpdateStatus={handleUpdateStatus}
              isScanLoading={isScanLoading}
              isUpdateLoading={isUpdateLoading}
            />
          </div>
        </div>
      </main>
      <MissionDetailMobileNav />
    </div>
  );
}