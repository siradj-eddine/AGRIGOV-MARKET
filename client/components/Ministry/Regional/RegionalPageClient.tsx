"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import YieldSidebar from "@/components/Ministry/Regional/YieldSideBar";
import RegionalMap from "@/components/Ministry/Regional/RegionalMap";
import RegionalRankings from "@/components/Ministry/Regional/RegionalRanking";
import type {
  AlgeriaRegion,
  RegionDetail,
  AllRegionsStatsData,
  ApiRegionComparison,
} from "@/types/Regional";
import { apiToRegionDetail } from "@/types/Regional";
import { regionalApi, ApiError } from "@/lib/api";

interface Props {
  comparisons:    ApiRegionComparison[];
  allStats:       AllRegionsStatsData | null;
  activeRegionId: AlgeriaRegion | null;
  isLoading:      boolean;
  onSelect:       (id: AlgeriaRegion) => void;
}
export default function RegionalDataPage() {
  // ── data ───────────────────────────────────────────────────────────────────
  const [allStats,    setAllStats]    = useState<AllRegionsStatsData | null>(null);
  const [comparisons, setComparisons] = useState<ApiRegionComparison[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [loadError,   setLoadError]   = useState<string | null>(null);

  // ── selection ──────────────────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId] = useState<AlgeriaRegion | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch both endpoints in parallel ──────────────────────────────────────
  const fetchData = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    Promise.all([
      regionalApi.allStats(),
      regionalApi.comparison(),
    ])
      .then(([statsRes, compRes]) => {
        if (cancelledRef.current) return;
        setAllStats(statsRes.data);
        setComparisons(compRes.data);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Failed to load regional data. Please retry."
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, []);

  useEffect(fetchData, [fetchData]);

  // ── derive active detail ───────────────────────────────────────────────────
  const activeDetail: RegionDetail | null = (() => {
    if (!activeRegionId || !allStats) return null;
    const stat = allStats[activeRegionId];
    if (!stat) return null;
    const comp = comparisons.find(
      (c) => c.region.toLowerCase() === activeRegionId
    );
    return apiToRegionDetail(stat, comp);
  })();

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleRegionClick = (id: string) =>
    setActiveRegionId((prev) => (prev === id ? null : (id as AlgeriaRegion)));

  const handleCardClose = () => setActiveRegionId(null);
  
  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background-light text-slate-800 font-display antialiased h-screen flex flex-col overflow-hidden">
      {/* Error banner */}
      {loadError && (
        <div
          role="alert"
          className="shrink-0 flex items-center gap-3 bg-red-50 border-b border-red-200 px-6 py-2 text-sm text-red-700"
        >
          <span className="material-icons text-base">error</span>
          <span className="flex-1">{loadError}</span>
          <button
            onClick={() => { setLoadError(null); fetchData(); }}
            className="underline font-semibold text-xs shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        <YieldSidebar stats={allStats} isLoading={isLoading} />

        <RegionalMap
          activeRegionId={activeRegionId}
          onRegionClick={handleRegionClick}
          onCardClose={handleCardClose}
          activeDetail={activeDetail}
        />

        <RegionalRankings
          comparisons={comparisons}
          allStats={allStats}
          activeRegionId={activeRegionId}
          isLoading={isLoading}
          onSelect={handleRegionClick}
        />
      </main>
    </div>
  );
}