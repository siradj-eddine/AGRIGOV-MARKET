"use client";

import { useState } from "react";
import TransporterHeader from "@/components/Transporter/TransporterHeader";
import MissionSidebar from "@/components/Transporter/MissionSidebar";
import MapView from "@/components/Transporter/Map";
import MissionDetailOverlay from "@/components/Transporter/MissionDetail";
import type { TransportRequest } from "@/types/Transporter";
import { mapPins, statsWidgets } from "@/types/Transporter";

export default function TransporterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);

  const handleSelectRequest = (req: TransportRequest) => setSelectedRequest(req);
  const handleCloseOverlay = () => setSelectedRequest(null);

  const handleAccept = (req: TransportRequest) => {
    // In a real app: POST to API, move to "My Missions", etc.
    setSelectedRequest(null);
    setSidebarOpen(false);
  };

  const handleDecline = (req: TransportRequest) => setSelectedRequest(null);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex overflow-hidden relative">
        <MissionSidebar
          isOpen={sidebarOpen}
          onSelectRequest={handleSelectRequest}
        />

        {/* Map section — takes remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <MapView pins={mapPins} stats={statsWidgets} />

          {/* Mission detail overlay (shown when a card is selected) */}
          {selectedRequest && (
            <MissionDetailOverlay
              request={selectedRequest}
              onClose={handleCloseOverlay}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}

          {/* Mobile sidebar toggle */}
          <button
            type="button"
            aria-label="Toggle mission sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
            className="absolute bottom-6 left-6 md:hidden z-30 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-black"
          >
            <span className="material-icons">{sidebarOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </main>
    </div>
  );
}