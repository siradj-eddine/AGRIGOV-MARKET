"use client";

import { useState } from "react";
import RegionalHeader from "@/components/Ministry/Regional/RegionalHeader";
import YieldSidebar from "@/components/Ministry/Regional/YieldSideBar";
import RegionalMap from "@/components/Ministry/Regional/RegionalMap";
import RegionalRankings from "@/components/Ministry/Regional/RegionalRanking";
import { regionDetails, regionRankings } from "@/types/Regional";

export default function RegionalDataPage() {
  const [activeRegionId, setActiveRegionId] = useState<string | null>("north-valley");

  const handleRegionClick = (id: string) => {
    setActiveRegionId((prev) => (prev === id ? null : id));
  };

  const handleCardClose = () => setActiveRegionId(null);

  const activeDetail = activeRegionId ? regionDetails[activeRegionId] ?? null : null;

  return (
    <div className="bg-background-light text-slate-800 font-display antialiased h-screen flex flex-col overflow-hidden selection:bg-primary selection:text-black">
      <main className="flex-1 flex overflow-hidden">
        <YieldSidebar />

        <RegionalMap
          activeRegionId={activeRegionId}
          onRegionClick={handleRegionClick}
          onCardClose={handleCardClose}
          activeDetail={activeDetail}
        />

        <RegionalRankings
          rankings={regionRankings}
          activeRegionId={activeRegionId}
          onSelect={handleRegionClick}
        />
      </main>
    </div>
  );
}