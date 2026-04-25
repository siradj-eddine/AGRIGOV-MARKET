"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { transporterApi } from "@/lib/api";
import { profileApi } from "@/lib/api";
import { ApiMission, MISSION_STATUS_BADGE, MISSION_STATUS_ICON, MISSION_STATUS_LABEL, MISSION_STATUS_PROGRESS, formatMissionDate } from "@/types/Missions";
import { ActiveMission, statusToStep, MISSION_STEPS } from "@/types/Transporter";

interface DashboardStats {
  totalMissions: number;
  completedMissions: number;
  activeMissions: number;
  declinedMissions: number;
  thisMonthEarnings: number;
  onTimeRate: number;
  averageRating: number;
}

interface VehicleInfo {
  id: number;
  type: string;
  model: string;
  year: number;
  capacity: number;
}

export default function TransporterDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalMissions: 0,
    completedMissions: 0,
    activeMissions: 0,
    declinedMissions: 0,
    thisMonthEarnings: 0,
    onTimeRate: 0,
    averageRating: 4.8,
  });
  const [activeMission, setActiveMission] = useState<ActiveMission | null>(null);
  const [recentMissions, setRecentMissions] = useState<ApiMission[]>([]);
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await profileApi.me();
      const user = data.data?.user;
      if (user) {
        setUserName(user.username || user.email?.split("@")[0] || "Transporter");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await transporterApi.getMyVehicles();
      setVehicles(res.results || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  }, []);

  const fetchMissionsData = useCallback(async () => {
    try {
      const res = await transporterApi.getMyMissions();
      const missions: ApiMission[] = res.results || [];

      const completed = missions.filter((m) => m.status === "delivered");
      const active = missions.filter((m) =>
        ["accepted", "picked_up", "in_transit"].includes(m.status)
      );
      const declinedCount = JSON.parse(localStorage.getItem("declined_missions") || "[]").length;

      const now = new Date();
      const thisMonthEarnings = completed
        .filter((m) => {
          const d = new Date(m.delivered_at ?? m.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        // placeholder payout — replace when API exposes it
        .reduce((sum) => sum + 150, 0);

      const onTimeRate =
        missions.length > 0
          ? Math.round((completed.length / missions.length) * 100)
          : 0;

      setStats({
        totalMissions: missions.length,
        completedMissions: completed.length,
        activeMissions: active.length,
        declinedMissions: declinedCount,
        thisMonthEarnings,
        onTimeRate,
        averageRating: 4.8,
      });

      const currentActive = active[0];
      if (currentActive) {
        setActiveMission({
          missionId: currentActive.id,
          cargo: `Order #${currentActive.order}`,
          status: currentActive.status,
          etaMins:
            currentActive.status === "in_transit" ? 30
            : currentActive.status === "picked_up" ? 60
            : 90,
          currentStep: statusToStep[currentActive.status] ?? MISSION_STEPS[0],
          orderId: currentActive.order,
        });
      }

      setRecentMissions(missions.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch missions data:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchVehicles(), fetchMissionsData()]);
      setLoading(false);
    };
    load();
  }, [fetchUserData, fetchVehicles, fetchMissionsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
          <p className="mt-4 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Missions",
      value: stats.totalMissions,
      icon: "local_shipping",
      accent: "border-primary",
      valueClass: "",
    },
    {
      label: "Completed",
      value: stats.completedMissions,
      icon: "task_alt",
      accent: "border-green-500",
      valueClass: "text-green-600",
    },
    {
      label: "In Progress",
      value: stats.activeMissions,
      accent: "border-yellow-500",
      valueClass: "text-yellow-600",
    },
    {
      label: "Declined",
      value: stats.declinedMissions,
      icon: "block",
      accent: "border-red-500",
      valueClass: "text-red-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's an overview of your logistics performance
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, accent, valueClass }) => (
          <div
            key={label}
            className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border-l-4 ${accent}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
              </div>
              <span className={`material-symbols-outlined text-3xl ${valueClass || "text-primary"}`}>
                {icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">This Month</p>
            <p className="text-xl font-bold">{stats.thisMonthEarnings} DZD</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary">payments</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">On-Time Rate</p>
            <p className="text-xl font-bold text-green-600">{stats.onTimeRate}%</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-green-500">verified</span>
        </div>

      
      </div>

      {/* Active mission */}
      {activeMission && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">my_location</span>
              Active Mission
            </h2>
            {/* Live status badge */}
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${MISSION_STATUS_BADGE[activeMission.status as keyof typeof MISSION_STATUS_BADGE]}`}>
              <span className="material-symbols-outlined text-sm">
                {MISSION_STATUS_ICON[activeMission.status as keyof typeof MISSION_STATUS_ICON]}
              </span>
              {MISSION_STATUS_LABEL[activeMission.status as keyof typeof MISSION_STATUS_LABEL]}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <p className="font-bold text-xl">{activeMission.cargo}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                ETA: <span className="font-semibold text-primary">{activeMission.etaMins} min</span>
              </p>
            </div>
            <Link
              href={`/Transporter/dashboard/missions/${activeMission.missionId}`}
              className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
            >
              Track Mission
            </Link>
          </div>

          {/* Progress steps */}
          <div className="flex items-center">
            {MISSION_STEPS.map((step, idx) => {
              const stepIndex = MISSION_STEPS.indexOf(activeMission.currentStep);
              const isDone = idx < stepIndex;
              const isActive = idx === stepIndex;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isDone
                          ? "bg-primary border-primary"
                          : isActive
                          ? "border-primary bg-white dark:bg-slate-800 animate-pulse"
                          : "border-slate-300 bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      {isDone && (
                        <span className="material-symbols-outlined text-sm text-black">check</span>
                      )}
                      {isActive && (
                        <span className="material-symbols-outlined text-sm text-primary">
                          radio_button_checked
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs text-center ${
                        isDone || isActive ? "text-primary font-semibold" : "text-slate-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {idx < MISSION_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 mb-5 transition-colors ${
                        isDone ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vehicles */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">directions_car</span>
          My Vehicles
        </h2>
        {vehicles.length === 0 ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              no_transfer
            </span>
            <p className="text-slate-500 text-sm">
              No vehicles registered.{" "}
              <Link
                href="/Transporter/dashboard/profile"
                className="text-primary hover:underline"
              >
                Add one in your profile →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-4 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  local_shipping
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {v.type} — {v.model}
                  </p>
                  <p className="text-sm text-slate-500">
                    {v.year} · {v.capacity} kg capacity
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent missions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Missions
          </h2>
          <Link
            href="/Transporter/dashboard/missions"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentMissions.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              inbox
            </span>
            <p className="text-slate-500 text-sm">No missions yet. Accept one to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentMissions.map((mission) => (
              <Link
                key={mission.id}
                href={`/Transporter/dashboard/missions/${mission.id}`}
                className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      MISSION_STATUS_BADGE[mission.status].includes("green")
                        ? "text-green-500"
                        : MISSION_STATUS_BADGE[mission.status].includes("yellow")
                        ? "text-yellow-500"
                        : "text-slate-400"
                    }`}
                  >
                    {MISSION_STATUS_ICON[mission.status]}
                  </span>
                  <div>
                    <p className="font-medium text-sm">Order #{mission.order}</p>
                    <p className="text-xs text-slate-400">
                      {formatMissionDate(mission.delivered_at ?? mission.accepted_at ?? mission.created_at)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${MISSION_STATUS_BADGE[mission.status]}`}
                >
                  {MISSION_STATUS_LABEL[mission.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}