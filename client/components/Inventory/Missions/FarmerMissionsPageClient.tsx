"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { ApiMission, MissionStatus, MissionFilterParams } from "@/types/Missions";
import {
  MISSION_STATUS_LABEL,
  MISSION_STATUS_BADGE,
  MISSION_STATUS_ICON,
  MISSION_STATUS_PROGRESS,
  STATUS_FILTER_OPTIONS,
  formatMissionDate,
} from "@/types/Missions";
import { farmerMissionApi, ApiError } from "@/lib/api";
// import FarmerSidebar from "@/components/Inventory/AddProduct/FarmSidebar";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

// ─── sub-components ───────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-neutral-dark rounded-xl border-l-4 p-5 shadow-sm ${accent}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-3xl font-extrabold font-display">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: MissionStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${MISSION_STATUS_BADGE[status]}`}
    >
      <span className="material-symbols-outlined text-[12px] leading-none">
        {MISSION_STATUS_ICON[status]}
      </span>
      {MISSION_STATUS_LABEL[status]}
    </span>
  );
}

function MissionCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-neutral-dark rounded-2xl p-6 shadow-sm border border-neutral-light dark:border-border-dark space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

function MissionCard({
  mission,
  onCancel,
  isCancelling,
}: {
  mission: ApiMission;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}) {
  const progress = MISSION_STATUS_PROGRESS[mission.status];
  const canCancel =
    mission.status === "pending" || mission.status === "accepted";

  return (
    <div className="group bg-white dark:bg-neutral-dark rounded-2xl p-6 shadow-sm border border-neutral-light dark:border-border-dark hover:border-primary/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-primary-dark"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_shipping
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Mission #{mission.id}
              </span>
              {mission.status === "pending" && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              Order #{mission.order}
            </p>
          </div>
        </div>

        <StatusBadge status={mission.status} />
      </div>

      {/* Route */}
      <div className="bg-neutral-50 dark:bg-earth-800 rounded-xl p-4 mb-5 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
            trip_origin
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pickup
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">
              {mission.pickup_address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="ml-2 w-px h-4 bg-primary/30" />
          <p className="text-[10px] text-slate-400 italic">{mission.wilaya}, {mission.baladiya}</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span
            className="material-symbols-outlined text-[18px] text-primary shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Delivery
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">
              {mission.delivery_address}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Mission Progress
          </p>
          <p className="text-[10px] font-bold text-primary">{progress}%</p>
        </div>
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-5">
        <div>
          <span className="font-bold uppercase tracking-wider block">Transporter</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {mission.transporter ? `#${mission.transporter}` : "Not assigned"}
          </span>
        </div>
        <div>
          <span className="font-bold uppercase tracking-wider block">Created</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {formatMissionDate(mission.created_at)}
          </span>
        </div>
        {mission.notes && (
          <div className="col-span-2">
            <span className="font-bold uppercase tracking-wider block">Notes</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
              {mission.notes}
            </span>
          </div>
        )}
        {mission.decline_count > 0 && (
          <div>
            <span className="font-bold uppercase tracking-wider block">Declines</span>
            <span className="text-orange-500 font-bold">{mission.decline_count}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {canCancel && (
        <button
          type="button"
          disabled={isCancelling}
          onClick={() => onCancel(mission.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCancelling ? (
            <span className="material-symbols-outlined text-base animate-spin">
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined text-base">cancel</span>
          )}
          {isCancelling ? "Cancelling…" : "Cancel Mission"}
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MissionsPage() {
  // ── data state ─────────────────────────────────────────────────────────────
  const [missions,    setMissions]    = useState<ApiMission[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [loadError,   setLoadError]   = useState<string | null>(null);

  // ── filter state ───────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState<MissionStatus | "">("");
  const [page,        setPage]        = useState(1);

  // ── action state ──────────────────────────────────────────────────────────
  const [cancellingId,setCancellingId]= useState<number | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);

  const cancelledRef = useRef(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchMissions = useCallback(() => {
    cancelledRef.current = false;
    setIsLoading(true);
    setLoadError(null);

    const params: MissionFilterParams = {
      page,
      page_size: PAGE_SIZE,
      ordering: "-created_at",
    };
    if (statusFilter) params.status = statusFilter;
    if (search.trim()) params.search = search.trim();

    farmerMissionApi
      .list(params)
      .then((res) => {
        if (cancelledRef.current) return;
        setMissions(res.results);
        setTotalCount(res.count);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Failed to load missions. Please retry."
        );
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => { cancelledRef.current = true; };
  }, [page, statusFilter, search]);

  useEffect(fetchMissions, [fetchMissions]);

  // ── derived stats ──────────────────────────────────────────────────────────
  const activeMissions  = missions.filter(
    (m) => m.status === "accepted" || m.status === "in_transit" || m.status === "picked_up"
  ).length;
  const pendingMissions = missions.filter((m) => m.status === "pending").length;
  const delivered       = missions.filter((m) => m.status === "delivered").length;
  const cancelled       = missions.filter((m) => m.status === "cancelled").length;

  // ── cancel ─────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(async (id: number) => {
    setCancellingId(id);
    try {
      await farmerMissionApi.cancel(id);
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "cancelled" } : m))
      );
      showToast("Mission cancelled successfully.");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to cancel mission.",
        true
      );
    } finally {
      setCancellingId(null);
    }
  }, []);

  function showToast(msg: string, _isError = false) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">

          {/* ── Hero header ── */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-earth-800 text-white p-8 lg:p-10 mb-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Decorative bg circle */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Mission Tracking
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
                Transportation<br />Mission Control
              </h1>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                Monitor every harvest shipment from your farm to the final delivery point.
              </p>
            </div>

            <Link
              href="/farmer/dashboard/missions/add"
              className="relative z-10 shrink-0 flex items-center gap-2 bg-primary text-slate-900 font-black px-6 py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              New Mission
            </Link>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatPill label="Active"    value={activeMissions}  accent="border-primary"      />
            <StatPill label="Pending"   value={pendingMissions} accent="border-yellow-400"   />
            <StatPill label="Delivered" value={delivered}       accent="border-green-500"    />
            <StatPill label="Cancelled" value={cancelled}       accent="border-red-400"      />
          </div>

          {/* ── Filters ── */}
          <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
                Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Order ID, address, notes…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-earth-800 border border-neutral-200 dark:border-border-dark text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="w-full sm:w-52">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as MissionStatus | "");
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-earth-800 border border-neutral-200 dark:border-border-dark text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-border-dark text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </div>

          {/* ── Load error ── */}
          {loadError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{loadError}</span>
              <button
                onClick={() => { setLoadError(null); fetchMissions(); }}
                className="shrink-0 underline font-semibold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Missions grid ── */}
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-xl font-extrabold tracking-tight">Active Deployments</h2>
            <span className="text-sm text-slate-500">
              {totalCount} mission{totalCount !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <MissionCardSkeleton key={i} />
              ))}
            </div>
          ) : missions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                local_shipping
              </span>
              <p className="text-slate-500 font-medium mb-4">No missions found.</p>
              <Link
                href="/farmer/dashboard/missions/add"
                className="flex items-center gap-2 bg-primary text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Your First Mission
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === mission.id}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page <span className="font-bold">{page}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-border-dark text-sm font-semibold disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoading}
                  className="px-4 py-2 rounded-xl bg-primary text-slate-900 text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in"
        >
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}