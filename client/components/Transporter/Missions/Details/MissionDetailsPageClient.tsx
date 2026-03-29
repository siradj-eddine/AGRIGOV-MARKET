'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MissionMapCard from './MissionMapCards';
import RouteTimeline from './RouteTimeLine';
import PayoutCard from './PayoutCard';
import CargoCard from './CargoCard';
import MissionActions from './MissionActions';
import MissionDetailMobileNav from './MissionDetailsMobileNav';
import {
  MISSION_DETAIL,
  DRIVER_AVATAR_URL,
} from '@/types/MissionDetails';

export default function MissionDetailPage() {
  const router = useRouter();

  // ── Loading states per action ──────────────────────────────────────────────
  const [isScanLoading,   setIsScanLoading]   = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const mission = MISSION_DETAIL;

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleScanQR() {
    setIsScanLoading(true);
    // TODO: open QR scanner
    await new Promise((r) => setTimeout(r, 800));
    setIsScanLoading(false);
  }

  async function handleUpdateStatus() {
    setIsUpdateLoading(true);
    // TODO: call status API
    await new Promise((r) => setTimeout(r, 600));
    setIsUpdateLoading(false);
  }

  function handleContactSupport() {
    // TODO: open support chat/modal
    console.log('Contact support');
  }

  function handleNavigate() {
    // TODO: open maps deep-link
    console.log('Open navigation');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm border-b border-primary/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-primary">
              Mission {mission.orderId}
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Active Transporter Mission
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="View notifications"
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            aria-label="Open settings"
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden ml-2 ring-2 ring-primary/30 relative">
            <Image
              src={DRIVER_AVATAR_URL}
              alt="Driver profile avatar"
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          <MissionMapCard
            imageUrl={mission.mapImageUrl}
            imageAlt={mission.mapImageAlt}
            stats={mission.mapStats}
            onNavigate={handleNavigate}
          />
          <RouteTimeline stops={mission.stops} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          <PayoutCard
            payout={mission.payout}
            progressPercent={mission.progressPercent}
          />
          <CargoCard cargo={mission.cargo} />
          <MissionActions
            status={mission.status}
            syncedAgo={mission.syncedAgo}
            onScanQR={handleScanQR}
            onUpdateStatus={handleUpdateStatus}
            onContactSupport={handleContactSupport}
            isScanLoading={isScanLoading}
            isUpdateLoading={isUpdateLoading}
          />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MissionDetailMobileNav />
    </div>
  );
}