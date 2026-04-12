"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { transporterApi } from "@/lib/api";
import { ApiMission, MISSION_STATUS_BADGE, MISSION_STATUS_ICON, MISSION_STATUS_LABEL, MISSION_STATUS_PROGRESS, formatMissionDate } from "@/types/Missions";
import { statusToStep, MISSION_STEPS, cargoTagStyles } from "@/types/Transporter";

type TabType = "available" | "active" | "completed" | "declined";

// ─── Small reusable status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: ApiMission["status"] }) {
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${MISSION_STATUS_BADGE[status]}`}>
      <span className="material-symbols-outlined text-sm">{MISSION_STATUS_ICON[status]}</span>
      {MISSION_STATUS_LABEL[status]}
    </span>
  );
}

// ─── Progress bar driven by MISSION_STATUS_PROGRESS ───────────────────────────
function MissionProgressBar({ status }: { status: ApiMission["status"] }) {
  const pct = MISSION_STATUS_PROGRESS[status];
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Step tracker ─────────────────────────────────────────────────────────────
function StepTracker({ status }: { status: ApiMission["status"] }) {
  const currentStep = statusToStep[status] ?? MISSION_STEPS[0];
  const stepIndex = MISSION_STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center">
      {MISSION_STEPS.map((step, idx) => {
        const isDone = idx < stepIndex;
        const isActive = idx === stepIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isDone
                    ? "bg-primary"
                    : isActive
                    ? "bg-primary ring-2 ring-primary/30"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
              <span className={`text-[10px] whitespace-nowrap ${isDone || isActive ? "text-primary font-medium" : "text-slate-400"}`}>
                {step}
              </span>
            </div>
            {idx < MISSION_STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 mb-3.5 transition-colors ${
                  isDone ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MissionManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [search, setSearch] = useState("");
  const [availableMissions, setAvailableMissions] = useState<ApiMission[]>([]);
  const [myMissions, setMyMissions] = useState<ApiMission[]>([]);
  const [declinedIds, setDeclinedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const determineCargoTag = (notes: string): keyof typeof cargoTagStyles => {
    const l = notes.toLowerCase();
    if (l.includes("perishable") || l.includes("fresh")) return "Perishable";
    if (l.includes("fragile") || l.includes("glass")) return "Fragile";
    if (l.includes("livestock") || l.includes("animal")) return "Livestock";
    return "Bulk";
  };

  const fetchAvailableMissions = useCallback(async () => {
    try {
      const res = await transporterApi.getAvailableMissions({ search: search || undefined });
      setAvailableMissions(res.results);
    } catch (err) {
      console.error("Failed to fetch available missions:", err);
      setAvailableMissions([]);
    }
  }, [search]);

  const fetchMyMissions = useCallback(async () => {
    try {
      const res = await transporterApi.getMyMissions({ search: search || undefined });
      setMyMissions(res.results);
    } catch (err) {
      console.error("Failed to fetch my missions:", err);
      setMyMissions([]);
    }
  }, [search]);

  const loadDeclined = useCallback(() => {
    const stored = localStorage.getItem("declined_missions");
    setDeclinedIds(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      loadDeclined();
      await Promise.all([fetchAvailableMissions(), fetchMyMissions()]);
      setLoading(false);
    };
    load();
  }, [fetchAvailableMissions, fetchMyMissions, loadDeclined]);

  // ── Derived lists from a single ApiMission[] — no intermediate type ──────────
  const activeMissions = useMemo(
    () => myMissions.filter((m) => ["accepted", "picked_up", "in_transit"].includes(m.status)),
    [myMissions]
  );
  const completedMissions = useMemo(
    () => myMissions.filter((m) => m.status === "delivered"),
    [myMissions]
  );

  // ── Search filters ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const match = (m: ApiMission) =>
      !q ||
      `order #${m.order}`.includes(q) ||
      m.pickup_address.toLowerCase().includes(q) ||
      m.delivery_address.toLowerCase().includes(q) ||
      m.wilaya.toLowerCase().includes(q);

    return {
      available: availableMissions.filter(match),
      active: activeMissions.filter(match),
      completed: completedMissions.filter(match),
    };
  }, [search, availableMissions, activeMissions, completedMissions]);

  const tabCounts = {
    available: availableMissions.length,
    active: activeMissions.length,
    completed: completedMissions.length,
    declined: declinedIds.length,
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleAccept = async (missionId: number) => {
    setActionLoadingId(missionId);
    try {
      const vehicles = await transporterApi.getMyVehicles();
      await transporterApi.acceptMission(missionId, vehicles.results[0]?.id);
      await Promise.all([fetchAvailableMissions(), fetchMyMissions()]);
    } catch (err) {
      console.error("Failed to accept:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecline = async (missionId: number) => {
    setActionLoadingId(missionId);
    try {
      await transporterApi.declineMission(missionId);
      const updated = [...declinedIds, missionId];
      setDeclinedIds(updated);
      localStorage.setItem("declined_missions", JSON.stringify(updated));
      await fetchAvailableMissions();
    } catch (err) {
      console.error("Failed to decline:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateStatus = async (mission: ApiMission) => {
    const next: Partial<Record<ApiMission["status"], "picked_up" | "in_transit" | "delivered">> = {
      accepted: "picked_up",
      picked_up: "in_transit",
      in_transit: "delivered",
    };
    const newStatus = next[mission.status];
    if (!newStatus) return;
    setActionLoadingId(mission.id);
    try {
      await transporterApi.updateMissionStatus(mission.id, newStatus);
      await fetchMyMissions();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const nextStatusLabel: Partial<Record<ApiMission["status"], string>> = {
    accepted: "Mark Picked Up",
    picked_up: "Mark In Transit",
    in_transit: "Mark Delivered",
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
          <p className="mt-4 text-slate-500">Loading missions...</p>
        </div>
      </div>
    );
  }

  const TABS: { key: TabType; label: string }[] = [
    { key: "available", label: "Available" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "declined", label: "Declined" },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mission Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your deliveries, track progress, and view history
          </p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search missions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === key
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {label}
            <span
              className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === key
                  ? "bg-primary/20 text-primary"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {tabCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Available ── */}
      {activeTab === "available" && (
        <div className="grid gap-4">
          {filtered.available.length === 0 ? (
            <EmptyState icon="inbox" title="No available missions" sub="Check back later for new opportunities." />
          ) : (
            filtered.available.map((mission) => {
              const tag = determineCargoTag(mission.notes);
              return (
                <div
                  key={mission.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Clickable area → detail */}
                  <Link
                    href={`/Transporter/dashboard/missions/${mission.id}`}
                    className="block p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Order #{mission.order}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {mission.wilaya} · {mission.baladiya}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${cargoTagStyles[tag]}`}>
                        {tag}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-500 mt-3">
                      <span className="material-symbols-outlined text-base text-primary mt-0.5">
                        trip_origin
                      </span>
                      <span className="flex-1">{mission.pickup_address}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-500 mt-1">
                      <span className="material-symbols-outlined text-base text-slate-400 mt-0.5">
                        location_on
                      </span>
                      <span className="flex-1">{mission.delivery_address}</span>
                    </div>
                    {mission.notes && (
                      <p className="text-xs text-slate-400 mt-2 italic">"{mission.notes}"</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      Posted {formatMissionDate(mission.created_at)}
                    </p>
                  </Link>

                  {/* Action buttons outside the Link */}
                  <div className="flex gap-3 px-4 pb-4">
                    <button
                      onClick={() => handleDecline(mission.id)}
                      disabled={actionLoadingId === mission.id}
                      className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(mission.id)}
                      disabled={actionLoadingId === mission.id}
                      className="flex-1 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-green-400 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {actionLoadingId === mission.id ? (
                        <span className="material-symbols-outlined animate-spin text-sm">
                          progress_activity
                        </span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Accept Mission
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Active ── */}
      {activeTab === "active" && (
        <div className="grid gap-4">
          {filtered.active.length === 0 ? (
            <EmptyState icon="local_shipping" title="No active missions" sub="Accept a mission to get started." />
          ) : (
            filtered.active.map((mission) => (
              <div
                key={mission.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-primary/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link href={`/Transporter/dashboard/missions/${mission.id}`} className="block p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold">Order #{mission.order}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {mission.wilaya} · {mission.baladiya}
                      </p>
                    </div>
                    <StatusBadge status={mission.status} />
                  </div>

                  <MissionProgressBar status={mission.status} />

                  <div className="mt-3">
                    <StepTracker status={mission.status} />
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    {mission.accepted_at && (
                      <span>Accepted {formatMissionDate(mission.accepted_at)}</span>
                    )}
                    {mission.picked_up_at && (
                      <span>Picked up {formatMissionDate(mission.picked_up_at)}</span>
                    )}
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleUpdateStatus(mission)}
                    disabled={actionLoadingId === mission.id}
                    className="w-full py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-green-400 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {actionLoadingId === mission.id ? (
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">
                          {MISSION_STATUS_ICON[mission.status]}
                        </span>
                        {nextStatusLabel[mission.status] ?? "Update Status"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Completed ── */}
      {activeTab === "completed" && (
        <div className="grid gap-4">
          {filtered.completed.length === 0 ? (
            <EmptyState icon="history" title="No completed missions yet" sub="Completed deliveries will appear here." />
          ) : (
            filtered.completed.map((mission) => (
              <Link
                key={mission.id}
                href={`/Transporter/dashboard/missions/${mission.id}`}
                className="bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800 p-4 shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">Order #{mission.order}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {mission.wilaya} · {mission.baladiya}
                    </p>
                  </div>
                  <StatusBadge status={mission.status} />
                </div>
                <MissionProgressBar status={mission.status} />
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-sm text-green-500">
                    task_alt
                  </span>
                  {mission.delivered_at
                    ? `Delivered ${formatMissionDate(mission.delivered_at)}`
                    : "Delivered"}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* ── Declined ── */}
      {activeTab === "declined" && (
        <div className="grid gap-4">
          {declinedIds.length === 0 ? (
            <EmptyState icon="block" title="No declined missions" sub="You haven't declined any missions yet." />
          ) : (
            declinedIds.map((id) => (
              <div
                key={id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">Mission #{id}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Declined · Still open for other transporters
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold">
                    Declined
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared empty state ────────────────────────────────────────────────────────
function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="text-center py-16">
      <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">
        {icon}
      </span>
      <p className="font-medium text-slate-600 dark:text-slate-300">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{sub}</p>
    </div>
  );
}