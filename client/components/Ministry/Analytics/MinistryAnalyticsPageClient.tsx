"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { ApiDashboardResponse } from "@/types/UserManagement";
import type { RegionComparisonResponse } from "@/types/Regional";
import { ministryApi, regionalApi, ApiError, productApi } from "@/lib/api";
import { apiRoleToDisplay } from "@/types/UserManagement";
import { ApiProduct } from "@/types/Product";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDZD(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`} style={style} />;
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({
  data, color = "#0df20d", isLoading, label,
}: {
  data: { label: string; value: number }[];
  color?: string;
  isLoading: boolean;
  label: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      {isLoading ? (
        <div className="flex items-end gap-2 h-40">
          {Array.from({length: 6}).map((_,i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <Skeleton className="w-full rounded-t-lg" style={{ height: `${30 + Math.random()*60}%` } as React.CSSProperties} />
              <Skeleton className="h-2 w-8" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data available</div>
      ) : (
        <div className="flex items-end gap-1.5 h-40">
          {data.map((d, i) => {
            const pct = Math.max((d.value / max) * 100, 2);
            return (
              <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {d.value}
                </div>
                <div
                  className="w-full rounded-t-lg transition-all duration-500 group-hover/bar:opacity-80"
                  style={{ height: `${pct}%`, background: color }}
                />
                <span className="text-[9px] font-bold mt-1 text-slate-400 uppercase tracking-tight">{d.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Donut chart (pure SVG) ───────────────────────────────────────────────────

function DonutChart({
  segments, isLoading,
}: {
  segments: { label: string; value: number; color: string }[];
  isLoading: boolean;
}) {
  const total  = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const R      = 60;
  const CX     = 80;
  const CY     = 80;
  const stroke = 20;

  let cumPct = 0;
  const arcs = segments.map(seg => {
    const pct   = seg.value / total;
    const start = cumPct;
    cumPct += pct;
    return { ...seg, startPct: start, endPct: cumPct };
  });

  function describeArc(startPct: number, endPct: number) {
    const toRad = (p: number) => (p * 2 * Math.PI) - Math.PI / 2;
    const sx = CX + R * Math.cos(toRad(startPct));
    const sy = CY + R * Math.sin(toRad(startPct));
    const ex = CX + R * Math.cos(toRad(endPct));
    const ey = CY + R * Math.sin(toRad(endPct));
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${CX} ${CY} L ${sx} ${sy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey} Z`;
  }

  if (isLoading) return <Skeleton className="w-40 h-40 rounded-full mx-auto" />;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0">
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={describeArc(arc.startPct, arc.endPct)}
            fill={arc.color}
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}
        {/* Inner circle cutout */}
        <circle cx={CX} cy={CY} r={R - stroke} fill="white" className="dark:fill-neutral-dark" />
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="inherit">{total}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="inherit">TOTAL</text>
      </svg>
      <div className="space-y-2">
        {arcs.map((arc, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: arc.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{arc.label}</span>
            <span className="ml-auto text-xs font-bold text-slate-800 dark:text-slate-100">{arc.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal bar (revenue by region) ──────────────────────────────────────

function HorizBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="capitalize">{label}</span>
        <span>{fmtDZD(value)} DZD</span>
      </div>
      <div className="h-2 w-full bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Line chart (sparkline) ───────────────────────────────────────────────────

function LineSparkline({ data, color = "#0df20d", label }: {
  data: { label: string; value: number }[];
  color?: string;
  label: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W   = 260;
  const H   = 80;

  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * W;
    const y = H - (d.value / max) * (H - 10) - 5;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{label}</p>
      {data.length < 2 ? (
        <div className="h-20 flex items-center justify-center text-xs text-slate-400">Insufficient data for chart</div>
      ) : (
        <div className="relative h-20 w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[H * 0.25, H * 0.5, H * 0.75].map((y, i) => (
              <line key={i} x1={0} y1={y} x2={W} y2={y} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="4" />
            ))}
            {/* Fill */}
            <polygon points={fillPoints} fill={color} opacity="0.1" />
            {/* Line */}
            <polyline fill="none" points={points} stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {/* Dots */}
            {data.map((d, i) => {
              const x = (i / Math.max(data.length - 1, 1)) * W;
              const y = H - (d.value / max) * (H - 10) - 5;
              return <circle key={i} cx={x} cy={y} r={2.5} fill={color} />;
            })}
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-bold uppercase">
            {data.map((d, i) => <span key={i}>{d.label}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MinistryAnalyticsPage() {
  const [dashboard, setDashboard] = useState<ApiDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<ApiProduct[]>([]);
  const cancelledRef = useRef(false);

function exportAnalyticsCSV() {
  if (!dashboard) {
    alert("No data to export");
    return;
  }

  const rows: string[] = [];
  const ov = dashboard.overview;
  const charts = dashboard.charts;

  // ── HEADER ──
  rows.push("MINISTRY PLATFORM ANALYTICS REPORT");
  rows.push(`Generated At,${new Date().toLocaleString()}`);
  rows.push("");

  // ── OVERVIEW ──
  rows.push("=== OVERVIEW ===");
  rows.push(`Total Revenue,${ov.total_revenue}`);
  rows.push(`Monthly Revenue,${ov.monthly_revenue}`);
  rows.push(`Total Orders,${ov.total_orders}`);
  rows.push("");

  // ── REVENUE TREND ──
  rows.push("=== REVENUE TREND ===");
  (charts?.revenue_trend ?? []).forEach(d => {
    rows.push(`${d.month},${d.total}`);
  });
  rows.push("");

  // ── USER DISTRIBUTION ──
  rows.push("=== USER DISTRIBUTION ===");
  (charts?.user_distribution ?? []).forEach(d => {
    rows.push(`${d.role},${d.count}`);
  });
  rows.push("");

  // ── REGION PERFORMANCE ──
  rows.push("=== REGION PERFORMANCE ===");
  (charts?.region_performance ?? []).forEach(r => {
    rows.push(
      `${r.farm__wilaya},${r.total}`
    );
  });
  rows.push("");

  // ── TOP PRODUCTS ──
  rows.push("=== TOP PRODUCTS ===");
  topProducts.forEach(p => {
    rows.push(
      `${p.ministry_product.name},${p.average_rating ?? 0}`
    );
  });

  // ── DOWNLOAD ──
  const blob = new Blob([rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `analytics-report-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}


  // Effect 1: Fetch Dashboard Data
  useEffect(() => {
    cancelledRef.current = false;
    setIsLoading(true);

    ministryApi.dashboard()
      .then((data) => {
        if (!cancelledRef.current) {
          setDashboard(data);
        }
      })
      .catch(() => {
        if (!cancelledRef.current) {
          setLoadError("Failed to load dashboard data.");
        }
      })
      .finally(() => {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // Effect 2: Fetch Top Products
  useEffect(() => {
    let cancelled = false;

    const fetchTopProducts = async () => {
      try {
        const qs = new URLSearchParams({
          ordering: "-average_rating", 
          page_size: "5",
        }).toString();

        const res = await productApi.list(qs);

        if (!cancelled) {
          setTopProducts(res.results);
        }
      } catch (err) {
        console.error("Failed to fetch top products", err);
      }
    };

    fetchTopProducts();
    return () => {
      cancelled = true;
    };
  }, []);
  const charts = dashboard?.charts;
  const ov     = dashboard?.overview ?? null;
const ratedProductsCount = topProducts.filter(p => p.average_rating !== null &&   Number(p.average_rating) !== 0 ).length;
const avg_rating = topProducts.length > 0 
  ? ratedProductsCount / topProducts.length 
  : 0;
  // ── Derived chart data ────────────────────────────────────────────────────

const revenueBarData = useMemo(() =>
  (charts?.revenue_trend ?? []).map(d => ({
    label: new Date(d.month).toLocaleDateString("fr-DZ", { month: "short" }),
    value: d.total,
  })), [charts]);

const revenueLine = useMemo(() =>
  (charts?.revenue_trend ?? []).map(d => ({
    label: new Date(d.month).toLocaleDateString("fr-DZ", { month: "short" }),
    value: d.total,
  })), [charts]);


  const catColors = ["#0df20d","#4ade80","#86efac","#bbf7c4","#d1fad1"];
const categoryDonut = useMemo(() =>
  (charts?.user_distribution ?? []).map((c, i) => ({
    label: apiRoleToDisplay(c.role) ?? c.role,
    value: c.count,
    color: catColors[i % catColors.length],
  })), [charts]);

  // Regional revenue bars
  const regionColors: Record<string, string> = {
    north: "#0df20d", east: "#4ade80", west: "#09a009", south: "#d1fad1",
  };
const regionRevData = useMemo(() => {
  const data = charts?.region_performance ?? [];

  return data
    .sort((a, b) => b.total - a.total) 
    .map(r => ({
      label: r.farm__wilaya,
      value: r.total,
      color: "#0df20d",
    }));
}, [charts]);
  const maxRegRev = Math.max(...regionRevData.map(r => r.value), 1);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased min-h-screen">
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
                <span className="material-icons text-xs">chevron_right</span>
                <span className="text-slate-800 dark:text-slate-200">Analytics</span>
              </nav>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics</h2>
              <p className="text-slate-500 text-sm mt-1">Performance insights from national agricultural data.</p>
            </div>
<button
  type="button"
  onClick={exportAnalyticsCSV}
  className="flex items-center px-4 py-2 bg-white dark:bg-neutral-dark border border-neutral-light rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors text-slate-700"
>
  <span className="material-icons text-base mr-2">cloud_download</span>
  Export CSV
</button>
          </div>

          {loadError && (
            <div role="alert" className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
              <span className="material-icons text-base">warning</span>
              {loadError}
            </div>
          )}

          {/* ── KPI summary ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue",  value: ov ? `${fmtDZD(ov.total_revenue)} DZD`  : "—", icon: "payments",        color: "text-primary"    },
              { label: "Monthly Revenue",value: ov ? `${fmtDZD(ov.monthly_revenue)} DZD`: "—", icon: "calendar_month",  color: "text-blue-500"   },
              { label: "Total Orders",   value: ov ? String(ov.total_orders)              : "—", icon: "receipt_long",   color: "text-purple-500" },
              { label: "Avg Rating",     value: ov ? `${avg_rating?.toFixed(2)} / 5` : "—", icon: "star",            color: "text-amber-500"  },
            ].map(k => (
              <div key={k.label} className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-icons text-[20px] ${k.color}`}>{k.icon}</span>
                  <p className="text-xs font-medium text-slate-500">{k.label}</p>
                </div>
                {isLoading ? <Skeleton className="h-7 w-28" /> : (
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">{k.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Revenue trend + Orders ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-dark lg:w-[200%] rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Revenue Over Time</h3>
                  <p className="text-sm text-slate-500">Daily sales (DZD)</p>
                </div>
              </div>
              <BarChart data={revenueBarData} color="#0df20d" isLoading={isLoading} label="DZD per day" />
              <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-border-dark">
                <LineSparkline data={revenueLine} color="#0bb80b" label="Revenue trend" />
              </div>
            </div>
          </div>

          {/* ── Category distribution + Regional revenue ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category donut */}
            <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold">Sales by Category</h3>
                <p className="text-sm text-slate-500">Units sold distribution</p>
              </div>
              {isLoading ? (
                <div className="flex items-center gap-6">
                  <Skeleton className="w-36 h-36 rounded-full" />
                  <div className="space-y-3 flex-1">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-5" />)}</div>
                </div>
              ) : categoryDonut.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No category data</div>
              ) : (
                <DonutChart segments={categoryDonut} isLoading={false} />
              )}
            </div>

            {/* Regional revenue horizontal bars */}
            <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold">Revenue by Region</h3>
                <p className="text-sm text-slate-500">Comparison of regional performance</p>
              </div>
              {isLoading ? (
                <div className="space-y-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-8" />)}</div>
              ) : regionRevData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No regional data</div>
              ) : (
                <div className="space-y-4">
                  {regionRevData.map(r => (
                    <HorizBar key={r.label} label={r.label} value={r.value} max={maxRegRev} color={r.color} />
                  ))}
                  {/* Orders by region */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-border-dark">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Orders by Region</p>
{(charts?.region_performance ?? []).map(r => (
  <div key={r.farm__wilaya} className="flex items-center justify-between text-sm py-1.5 border-b">
    <span className="font-medium capitalize">
      {r.farm__wilaya}
    </span>
    <span className="text-xs text-slate-500">
      {fmtDZD(r.total)} DZD
    </span>
  </div>
))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Top products ── */}
          <div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold">Top Products</h3>
                <p className="text-sm text-slate-500">Best-performing products by units sold</p>
              </div>
            </div>
           {topProducts.length === 0 ? (
  <p className="text-sm text-slate-400 text-center py-6">
    No product data available.
  </p>
) : (
  [...topProducts]
    // 1. Sort by average_rating descending
    .sort((a, b) => (Number(b.average_rating) ?? 0) - (Number(a.average_rating) ?? 0))
    .slice(0, 5)
    .map((p, i) => {
      const rating = Number(p.average_rating) ?? 0;
      
      // 2. Calculate percentage based on a max scale of 5
      const pct = (rating / 5) * 100;

      return (
        <div key={p.id} className="flex items-center gap-4">
          <span className="w-5 text-[10px] font-black text-slate-300 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold truncate capitalize text-slate-800 dark:text-slate-100">
                {p.ministry_product.name}
              </span>

              {/* 3. Display rating value */}
              <span className="text-xs font-bold text-slate-500 ml-2 shrink-0">
                {rating > 0 ? `${rating.toFixed(1)} / 5` : "No ratings"}
              </span>
            </div>

            <div className="h-1.5 w-full bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700" 
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
          </div>
        </div>
      );
    })
)}
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-slate-400 pb-4">
            Data sourced from /api/dashboard/ and /api/regions/comparision/ — refreshed on page load.
          </footer>
        </div>
      </main>
    </div>
  );
}