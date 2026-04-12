"use client";

import { useState } from "react";
import type { SidebarTab, TransportRequest, ActiveMission } from "@/types/Transporter";
import RequestCard from "@/components/Transporter/RequestCard";
import ActiveMissionStrip from "@/components/Transporter/ActiveMissions";

interface Props {
  isOpen: boolean;
  availableRequests: TransportRequest[];
  activeMission: ActiveMission | null;
  loadingId: number | null;
  onSelectRequest: (req: TransportRequest) => void;
  onAcceptMission: (id: number) => void;
  onDeclineMission: (id: number) => void;
}

export default function MissionSidebar({
  isOpen,
  availableRequests,
  activeMission,
  loadingId,
  onSelectRequest,
  onAcceptMission,
  onDeclineMission,
}: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("Available");

  return (
    <aside
      className={`w-96 bg-white dark:bg-[#152815] border-r border-slate-200 dark:border-slate-700 flex flex-col z-10 shadow-lg h-full transition-transform duration-300 absolute md:relative ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Tabs */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(["Available", "My Missions"] as SidebarTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const label =
              tab === "Available"
                ? `Available (${availableRequests.length})`
                : `My Missions (${activeMission ? 1 : 0})`;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-all ${
                  isActive
                    ? "bg-white dark:bg-[#1a2e1a] text-primary-dark dark:text-primary font-semibold shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {activeTab === "Available" ? "Nearby Requests" : "Accepted Missions"}
          </h2>
          <button
            type="button"
            className="text-xs text-primary font-medium hover:underline"
          >
            Filter
          </button>
        </div>

        {activeTab === "Available" &&
          availableRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              loadingId={loadingId}
              onViewRoute={onSelectRequest}
              onAccept={() => onAcceptMission(req.id)}
              onDecline={() => onDeclineMission(req.id)}
            />
          ))}

        {activeTab === "My Missions" && (
          <>
            {activeMission ? (
              <ActiveMissionStrip mission={activeMission} />
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                No active missions.
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}