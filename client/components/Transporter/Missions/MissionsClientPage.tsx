'use client';

import { useState, useMemo } from 'react';
import MissionSidebar from './MissionsSidebar';
import ActiveMissionCard from './ActiveMissionsCard';
import UpcomingMissionCard from './UpcomingMissionsCard';
import StatusFooter from './StatusFooter';
import {
  MISSION_TABS,
  DEFAULT_TAB,
  ACTIVE_MISSIONS,
  UPCOMING_MISSIONS,
} from '@/types/Missions';
import type { MissionStatus } from '@/types/Missions';

export default function MissionManagementPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState<MissionStatus>(DEFAULT_TAB);
  const [search, setSearch]             = useState('');
  const [loadingId, setLoadingId]       = useState<string | null>(null);

  // ── Derived: tabs with live counts ────────────────────────────────────────
  const tabs = useMemo(
    () =>
      MISSION_TABS.map((t) => ({
        ...t,
        // In a real app these counts would be server-driven;
        // we expose the mutable tab so child gets correct count
      })),
    [],
  );

  // ── Derived: search-filtered missions ─────────────────────────────────────
  const filteredActive = useMemo(
    () =>
      ACTIVE_MISSIONS.filter(
        (m) =>
          search.trim() === '' ||
          m.orderId.toLowerCase().includes(search.toLowerCase()) ||
          m.cargo.toLowerCase().includes(search.toLowerCase()) ||
          m.pickup.name.toLowerCase().includes(search.toLowerCase()) ||
          m.dropoff.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredUpcoming = useMemo(
    () =>
      UPCOMING_MISSIONS.filter(
        (m) =>
          search.trim() === '' ||
          m.orderId.toLowerCase().includes(search.toLowerCase()) ||
          m.farm.toLowerCase().includes(search.toLowerCase()) ||
          m.cargo.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleMissionAction(id: string) {
    setLoadingId(id);
    // TODO: call API to confirm pickup / start offloading
    await new Promise((r) => setTimeout(r, 800));
    setLoadingId(null);
  }

  function handleViewDetails(id: string) {
    // TODO: navigate to mission detail or open drawer
    console.log('View mission details:', id);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <MissionSidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-background-dark border-b border-primary/10 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">Mission Management</h2>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                aria-label="Search missions"
                className="w-full bg-primary/5 border-none focus:ring-2 focus:ring-primary rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
              />
            </div>

            {/* Notifications */}
            <button
              aria-label="View notifications"
              className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Mission status tabs"
            className="flex items-center border-b border-primary/10 mb-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab.label}
                role="tab"
                aria-selected={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={
                  activeTab === tab.label
                    ? 'px-6 py-3 border-b-2 border-primary text-primary font-bold transition-colors'
                    : 'px-6 py-3 border-b-2 border-transparent text-slate-500 font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
                }
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* In Progress tab */}
          {activeTab === 'In Progress' && (
            <div className="grid gap-6 @container">
              {filteredActive.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium text-center py-12">
                  No active missions match your search.
                </p>
              ) : (
                filteredActive.map((mission) => (
                  <ActiveMissionCard
                    key={mission.id}
                    mission={mission}
                    onAction={handleMissionAction}
                    isActionLoading={loadingId === mission.id}
                  />
                ))
              )}

              {/* Upcoming preview at bottom of In Progress view */}
              {filteredUpcoming.length > 0 && (
                <>
                  <div className="pt-8 pb-2">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                      Upcoming Missions
                    </h4>
                  </div>
                  {filteredUpcoming.map((mission) => (
                    <UpcomingMissionCard
                      key={mission.id}
                      mission={mission}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Upcoming tab */}
          {activeTab === 'Upcoming' && (
            <div className="grid gap-6 @container">
              {filteredUpcoming.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium text-center py-12">
                  No upcoming missions match your search.
                </p>
              ) : (
                filteredUpcoming.map((mission) => (
                  <UpcomingMissionCard
                    key={mission.id}
                    mission={mission}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          )}

          {/* Completed tab — placeholder */}
          {activeTab === 'Completed' && (
            <div className="py-12 text-center text-sm text-slate-400 font-medium">
              Completed mission history coming soon.
            </div>
          )}
        </div>

        {/* Status Footer */}
        <StatusFooter
          gpsActive
          fleetLabel="Truck #442 (Semi-Trailer)"
          connection="Stable"
        />
      </main>
    </div>
  );
}