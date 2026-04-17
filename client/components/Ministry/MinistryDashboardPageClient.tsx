"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { ApiDashboardResponse } from "@/types/UserManagement";
import type { OfficialPricesResponse } from "@/types/Prices";
import type { CategoriesApiResponse } from "@/types/CategoryManagement";
import type { AllRegionsStatsResponse } from "@/types/Regional";
import {
  ministryApi,
  officialPriceApi,
  categoryApi,
  regionalApi,
  ApiError,
} from "@/lib/api";

// ─── Small helpers ────────────────────────────────────────────────────────────

function fmtDZD(n: number) {
  return n.toLocaleString("fr-DZ", { maximumFractionDigits: 0 });
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`}
    />
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon,
  iconColor,
  label,
  value,
  sub,
  trend,
  trendLabel,
  isLoading,
}: {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  isLoading: boolean;
}) {
  const ts = {
    up: { badge: "text-primary bg-primary/10", icon: "arrow_upward" },
    down: { badge: "text-red-500 bg-red-50", icon: "arrow_downward" },
    flat: { badge: "text-slate-400 bg-slate-100", icon: "remove" },
  }[trend];

  return (
    <div className="bg-white dark:bg-neutral-dark p-5 rounded-xl border border-neutral-light dark:border-border-dark shadow-sm relative overflow-hidden group">
      <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <span className={`material-icons text-6xl ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="flex items-end mt-2 gap-2">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </h3>
            <span
              className={`mb-1 text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${ts.badge}`}
            >
              <span className="material-icons text-[10px] mr-0.5">
                {ts.icon}
              </span>
              {trendLabel}
            </span>
          </>
        )}
      </div>
      {sub && !isLoading && (
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      )}
    </div>
  );
}

// ─── Region summary bar ───────────────────────────────────────────────────────

function RegionBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MinistryDashboardPage() {
  const [dashboard, setDashboard] = useState<ApiDashboardResponse | null>(null);
  const [prices, setPrices] = useState<OfficialPricesResponse | null>(null);
  const [categories, setCategories] = useState<CategoriesApiResponse | null>(
    null,
  );
  const [regions, setRegions] = useState<AllRegionsStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  function exportReport() {
    if (!dashboard && !prices && !categories && !regions) {
      alert("No data to export");
      return;
    }

    const ov = dashboard?.overview;

    // Build CSV content
    const rows: string[] = [];

    // ── Overview ──
    rows.push("=== OVERVIEW ===");
    rows.push(`Total Users,${ov?.total_users ?? 0}`);
    rows.push(`New Users (30d),${ov?.new_users_last_30_days ?? 0}`);
    rows.push(`Total Orders,${ov?.total_orders ?? 0}`);
    rows.push(`Total Revenue (DZD),${ov?.total_revenue ?? 0}`);
    rows.push(`Monthly Revenue (DZD),${ov?.monthly_revenue ?? 0}`);
    rows.push("");

    // ── Categories ──
    rows.push("=== CATEGORIES ===");
    categories?.results.forEach((c) => {
      rows.push(`${c.id},${c.name},${c.slug}`);
    });
    rows.push("");

    // ── Prices ──
    rows.push("=== PRICES ===");
    prices?.results.forEach((p) => {
      rows.push(
        `${p.product_detail.name},${p.region_name},${p.min_price}-${p.max_price},${p.unit},${p.is_active ? "Active" : "Inactive"}`,
      );
    });
    rows.push("");

    // ── Regions ──
    rows.push("=== REGIONS ===");
    const regionStats = regions?.data;
    if (regionStats) {
      Object.entries(regionStats).forEach(([region, data]) => {
        rows.push(`${region},${data.farmers.total},${data.farmers.active}`);
      });
    }

    // Convert to blob
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    cancelledRef.current = false;
    setIsLoading(true);

    Promise.allSettled([
      ministryApi.dashboard(),
      officialPriceApi.list(1, 5),
      categoryApi.list(1, 20),
      regionalApi.allStats(),
    ])
      .then(([dashRes, pricesRes, catsRes, regRes]) => {
        if (cancelledRef.current) return;
        if (dashRes.status === "fulfilled") setDashboard(dashRes.value);
        if (pricesRes.status === "fulfilled") setPrices(pricesRes.value);
        if (catsRes.status === "fulfilled") setCategories(catsRes.value);
        if (regRes.status === "fulfilled") setRegions(regRes.value);

        const anyFailed = [dashRes, pricesRes, catsRes, regRes].some(
          (r) => r.status === "rejected",
        );
        if (anyFailed) setLoadError("Some data could not be loaded.");
      })
      .finally(() => {
        if (!cancelledRef.current) setIsLoading(false);
      });

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const ov = dashboard?.overview;

  // Regional totals
  const regionStats = regions?.data;
  const maxFarmers = regionStats
    ? Math.max(...Object.values(regionStats).map((r) => r.farmers.total), 1)
    : 1;

  // Active prices count
  const activePrices = prices?.results.filter((p) => p.is_active).length ?? 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased min-h-screen">
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ── Page header ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Overview Dashboard
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Real-time agricultural metrics for Algeria.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-white dark:bg-neutral-dark border border-neutral-light dark:border-border-dark rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700 dark:text-slate-300"
              >
                <span className="material-icons text-base mr-2">
                  cloud_download
                </span>
                Export Report
              </button>
              <Link
                href="/Ministry/dashboard/PricesManagement/add"
                className="flex items-center px-4 py-2 bg-primary text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-colors shadow-md shadow-primary/20"
              >
                <span className="material-icons text-base mr-2">add</span>
                New Price Entry
              </Link>
            </div>
          </div>

          {/* Error banner */}
          {loadError && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700"
            >
              <span className="material-icons text-base shrink-0">warning</span>
              <span>{loadError}</span>
            </div>
          )}

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard
              icon="people"
              iconColor="text-primary"
              label="Total Users"
              value={ov ? String(ov.total_users) : "—"}
              sub={`${ov?.new_users_last_30_days ?? 0} new this month`}
              trend="up"
              trendLabel={`+${ov?.new_users_last_30_days ?? 0}`}
              isLoading={isLoading}
            />
            <KpiCard
              icon="shopping_bag"
              iconColor="text-blue-500"
              label="Total Orders"
              value={ov ? String(ov.total_orders) : "—"}
              sub={`${fmtDZD(ov?.total_revenue ?? 0)} DZD revenue`}
              trend={ov && ov.total_orders > 0 ? "up" : "flat"}
              trendLabel="All time"
              isLoading={isLoading}
            />
            <KpiCard
              icon="category"
              iconColor="text-purple-500"
              label="Categories"
              value={categories ? String(categories.count) : "—"}
              sub="Product classifications"
              trend="flat"
              trendLabel="Stable"
              isLoading={isLoading}
            />
            <KpiCard
              icon="price_change"
              iconColor="text-amber-500"
              label="Active Prices"
              value={isLoading ? "—" : String(activePrices)}
              sub={`of ${prices?.count ?? 0} total entries`}
              trend={activePrices > 0 ? "up" : "flat"}
              trendLabel="Live"
              isLoading={isLoading}
            />
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Regional overview ─ 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Regional Farmer Distribution
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Active farmers per macro-region
                  </p>
                </div>
                <Link
                  href="/Ministry/dashboard/RegionalData"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Full Map{" "}
                  <span className="material-icons text-sm">arrow_forward</span>
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6" />
                  ))}
                </div>
              ) : regionStats ? (
                <div className="space-y-4">
                  {(["north", "east", "west", "south"] as const).map((r) => (
                    <RegionBar
                      key={r}
                      label={r}
                      value={regionStats[r].farmers.total}
                      max={maxFarmers}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No regional data available.
                </p>
              )}

              {/* Region quick stats */}
              {regionStats && !isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-neutral-light dark:border-border-dark">
                  {(["north", "east", "west", "south"] as const).map((r) => (
                    <div key={r} className="text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {r}
                      </p>
                      <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                        {regionStats[r].farmers.active}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        active farmers
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Revenue card */}
              <div className="bg-slate-900 dark:bg-earth-800 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Total Revenue
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-40 bg-slate-700" />
                  ) : (
                    <p className="text-3xl font-extrabold">
                      {fmtDZD(ov?.total_revenue ?? 0)}{" "}
                      <span className="text-lg font-normal text-slate-400">
                        DZD
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-slate-400 mt-2">
                    {isLoading
                      ? ""
                      : `Monthly: ${fmtDZD(ov?.monthly_revenue ?? 0)} DZD`}
                  </p>
                  <div className="mt-4 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: ov && ov.total_revenue > 0 ? "65%" : "3%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent prices */}
              <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Latest Price Entries
                  </h4>
                  <Link
                    href="/Ministry/dashboard/PricesManagement"
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                  </div>
                ) : prices?.results.length ? (
                  <div className="space-y-3">
                    {prices.results.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">
                            {p.product_detail.name}
                          </p>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {p.region_name} · {p.unit}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-bold font-mono text-slate-800 dark:text-slate-100 text-xs">
                            {parseFloat(p.min_price).toLocaleString("fr-DZ")}–
                            {parseFloat(p.max_price).toLocaleString("fr-DZ")}
                          </p>
                          <span
                            className={`text-[10px] font-bold ${p.is_active ? "text-primary" : "text-slate-400"}`}
                          >
                            {p.is_active ? "● Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No price entries yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Categories + reviews + missions row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Product Categories
                </h4>
                <Link
                  href="/Ministry/dashboard/categories"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Manage
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              ) : categories?.results.length ? (
                <div className="space-y-2">
                  {categories.results.slice(0, 5).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-icons text-primary text-[14px]">
                          category
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold capitalize truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {c.slug}
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold text-slate-300 font-mono">
                        #{c.id}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  No categories.
                </p>
              )}
            </div>

            {/* Platform stats */}
            <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-5">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                Platform Statistics
              </h4>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : ov ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Products",
                      value: ov.total_products,
                      icon: "inventory_2",
                      color: "text-blue-500",
                    },
                    {
                      label: "Orders",
                      value: ov.total_orders,
                      icon: "receipt_long",
                      color: "text-purple-500",
                    },
                    {
                      label: "Reviews",
                      value: ov.total_reviews,
                      icon: "star",
                      color: "text-amber-500",
                    },
                    {
                      label: "Avg Rating",
                      value: ov.avg_rating?.toFixed(1) ?? "—",
                      icon: "grade",
                      color: "text-primary",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-neutral-50 dark:bg-earth-800 rounded-xl p-4 flex flex-col items-center text-center"
                    >
                      <span
                        className={`material-icons text-2xl ${s.color} mb-1`}
                      >
                        {s.icon}
                      </span>
                      <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  No data.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-slate-400 pb-4">
            © {new Date().getFullYear()} Ministry of Agriculture, Algeria. All
            rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
