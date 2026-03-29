'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FarmerProfileSidebar from './ProfileSidebar';
import PersonalDetailsCard from './PersonalDetailsCard';
import FarmLocationCard from './FarmLocationCard';
import SettlementAccountsCard from './SettlementCard';
import AccountSecurityCard from './AccountSecurityCard';
import ProfileCompletionGauge from './ProfileCompletion';
import MobileBottomNav from './MobileBottomNav';
import {
  INITIAL_PROFILE,
  FARM_LOCATION,
  PAYMENT_METHODS,
  SECURITY_SETTINGS,
  PROFILE_BADGES,
  PROFILE_COMPLETION,
  TOP_NAV,
  TOPBAR_AVATAR_URL,
} from '@/types/Profile';
import type { FarmerProfile, SecuritySetting } from '@/types/Profile';

export default function FarmerProfilePage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [profile, setProfile]       = useState<FarmerProfile>(INITIAL_PROFILE);
  const [security, setSecurity]     = useState<SecuritySetting[]>(SECURITY_SETTINGS);
  const [isSaving, setIsSaving]     = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleProfileChange(field: keyof FarmerProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleToggle(id: string) {
    setSecurity((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  async function handleSave() {
    setIsSaving(true);
    // TODO: call API to persist profile
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
  }

  function handleDiscard() {
    setProfile(INITIAL_PROFILE);
    setSecurity(SECURITY_SETTINGS);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm border-b border-primary/10">
        <span className="text-xl font-extrabold text-primary italic">Harvest Intel</span>

        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4 text-slate-500 dark:text-slate-400 font-bold text-base" aria-label="Top navigation">
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`px-3 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  item.active
                    ? 'text-primary border-b-2 border-primary font-semibold'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icon buttons + avatar */}
          <div className="flex items-center gap-3">
            <button
              aria-label="View notifications"
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              aria-label="Open settings"
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary relative">
              <Image
                src={TOPBAR_AVATAR_URL}
                alt="User profile avatar"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <FarmerProfileSidebar />

      {/* Main Content */}
      <main className="md:ml-64 pt-20 px-6 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <span className="text-primary font-bold text-sm tracking-widest uppercase">
                Member Profile
              </span>
              <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Account Overview
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDiscard}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:bg-neutral-light dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-primary text-slate-900 font-bold rounded-full shadow-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                {isSaving && (
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                )}
                Save Profile
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <PersonalDetailsCard
              profile={profile}
              onChange={handleProfileChange}
              onEditAvatar={() => console.log('Edit avatar')}
            />
            <FarmLocationCard
              location={FARM_LOCATION}
              onVerifyBoundaries={() => console.log('Verify boundaries')}
            />
            <SettlementAccountsCard
              methods={PAYMENT_METHODS}
              onAddMethod={() => console.log('Add payment method')}
            />
            <AccountSecurityCard
              settings={security}
              onToggle={handleToggle}
              onLinkAction={(id) => console.log('Link action:', id)}
              onChangePassword={() => console.log('Change password')}
              onDeactivate={() => console.log('Deactivate account')}
            />
          </div>

          {/* Completion Gauge */}
          <ProfileCompletionGauge
            percent={PROFILE_COMPLETION}
            badges={PROFILE_BADGES}
            onCompleteProfile={() => console.log('Complete profile')}
          />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}