"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { FarmerDashboardResponse } from "@/types/FarmerAnalytics";
import type { ApiOrder } from "@/types/Orders";
import {
  formatDZD, shortMonthDay,
} from "@/types/FarmerAnalytics";
import {
  STATUS_BADGE, STATUS_LABELS, STATUS_ICON,
  parseBuyerEmail, formatOrderDate,
} from "@/types/Orders";
import { farmerDashboardApi, farmerOrderApi, ApiError } from "@/lib/api";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className ?? ""}`} />;
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon, iconBg, label, value, sub, badge, badgeColor, isLoading,
}: {
  icon: string; iconBg: string; label: string; value: string;
  sub?: string; badge?: string; badgeColor?: string; isLoading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-5 relative overflow-hidden group">
      <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <span className={`material-symbols-outlined text-5xl ${iconBg}`}>{icon}</span>
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined text-[20px] text-slate-900">{icon}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      {isLoading ? <Sk className="h-8 w-28" /> : (
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
          {badge && (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      {sub && !isLoading && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Bar chart (revenue / orders) ─────────────────────────────────────────────

function BarChart({
  data, color = "#0df20d", height = 120, fmt,
}: {
  data:   { label: string; value: number }[];
  color?: string;
  height?: number;
  fmt:    (n: number) => string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-6">No data yet.</p>;
  }
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div
  key={i}
  className="flex-1 flex flex-col justify-end items-center h-full group/bar relative"
>
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {fmt(d.value)}
          </div>
          <div
            className="w-full rounded-t-md cursor-default group-hover/bar:opacity-80 transition-opacity"
            style={{ height: `${Math.max((d.value / max) * 100, 3)}%`, background: color }}
          />
          <span className="text-[8px] font-bold mt-1 text-slate-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut (category distribution) ────────────────────────────────────────────

const CAT_COLORS = ["#0df20d","#4ade80","#86efac","#22c55e","#bbf7c4","#16a34a"];

function DonutChart({ segments }: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;
  const R = 48; const CX = 64; const CY = 64;
  let cum = 0;
  const arcs = segments.map(sg => {
    const start = cum;
    cum += sg.value / total;
    return { ...sg, start, end: cum };
  });
  const arc = (s: number, e: number) => {
    const r  = (p: number) => (p * 2 * Math.PI) - Math.PI / 2;
    const sx = CX + R * Math.cos(r(s)); const sy = CY + R * Math.sin(r(s));
    const ex = CX + R * Math.cos(r(e)); const ey = CY + R * Math.sin(r(e));
    return `M${CX},${CY} L${sx},${sy} A${R},${R} 0 ${e - s > 0.5 ? 1 : 0} 1 ${ex},${ey} Z`;
  };
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 128 128" className="w-28 h-28 shrink-0">
        {arcs.map((a, i) => (
          <path key={i} d={arc(a.start, a.end)} fill={a.color} stroke="#fff" strokeWidth={1.2} />
        ))}
        <circle cx={CX} cy={CY} r={28} fill="white" className="dark:fill-neutral-dark" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a" fontFamily="inherit">{total}</text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="inherit">ORDERS</text>
      </svg>
      <div className="space-y-1.5 min-w-0">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400 truncate capitalize">{a.label || "Uncategorised"}</span>
            <span className="ml-auto text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color = "#0df20d" }: {
  data: { value: number }[]; color?: string;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 220; const H = 48;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.value / max) * (H - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" preserveAspectRatio="none">
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={color} opacity={0.12} />
      <polyline fill="none" points={pts} stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── CSV export helper ────────────────────────────────────────────────────────

export function exportOrdersCSV(orders: ApiOrder[]) {
  const header = ["Order ID","Buyer","Farm","Status","Total (DZD)","Products","Date"].join(",");
  const rows   = orders.map(o => [
    o.id,
    `"${parseBuyerEmail(o.buyer)}"`,
    `"${o.farm.split(" - ")[0] ?? o.farm}"`,
    o.status,
    parseFloat(o.total_price).toFixed(2),
    `"${o.items.map(i => `${i.product.title} ×${i.quantity}`).join("; ")}"`,
    formatOrderDate(o.created_at),
  ].join(","));
  const csv  = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FarmerDashboardPage() {
  const [dash,      setDash]      = useState<FarmerDashboardResponse | null>(null);
  const [orders,    setOrders]    = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const cancelledRef = useRef(false);
const [mounted, setMounted] = useState(false);
  useEffect(() => {
    cancelledRef.current = false;
    setMounted(true);
    setIsLoading(true);

    Promise.allSettled([
      farmerDashboardApi.get(),
      farmerOrderApi.list({ page: 1, page_size: 5, ordering: "-created_at" }),
    ]).then(([dashRes, ordersRes]) => {
      if (cancelledRef.current) return;
      if (dashRes.status   === "fulfilled") setDash(dashRes.value);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.results);
      if ([dashRes, ordersRes].some(r => r.status === "rejected"))
        setError("Some data failed to load.");
    }).finally(() => { if (!cancelledRef.current) setIsLoading(false); });

    return () => { cancelledRef.current = true; };
  }, []);

  const ov       = dash?.overview;
  const charts   = dash?.charts;
  const insights = dash?.insights;

  // ── Derived chart data ──────────────────────────────────────────────────────

  const revenueBars = useMemo(() =>
    (charts?.revenue_over_time ?? []).slice(-10).map(d => ({
      label: shortMonthDay(d.day),
      value: d.total,
    })), [charts]);

  const ordersBars = useMemo(() =>
    (charts?.orders_over_time ?? []).slice(-10).map(d => ({
      label: shortMonthDay(d.day),
      value: d.count,      
    })), [charts]);

  const catSegments = useMemo(() =>
    (charts?.category_distribution ?? []).map((c, i) => ({
      label: c.product_item__category_name,
      value: c.total,
      color: CAT_COLORS[i % CAT_COLORS.length],
    })), [charts]);

  const topProducts = useMemo(() =>
    [...(insights?.top_products ?? [])].sort((a, b) => (b.total_sold ?? 0) - (a.total_sold ?? 0)),
    [insights]);

  const maxSold = topProducts.length > 0
    ? Math.max(...topProducts.map(p => p.total_sold ?? 0), 1)
    : 1;

  const revenueGrowth = ov?.revenue_growth ?? 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  console.log(charts?.orders_over_time.slice(-10).map(d => ({
      label: shortMonthDay(d.day),
      value: d.count,      
    })));
  

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ── Page header ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Farmer Portal</p>
              <h1 className="text-3xl font-extrabold tracking-tight">Farm Overview</h1>
              <p className="text-slate-500 text-sm mt-1">
                {mounted ? new Date().toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Loading date..."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => exportOrdersCSV(orders)}
                disabled={orders.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 border border-neutral-light dark:border-border-dark bg-white dark:bg-neutral-dark rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors shadow-sm disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                Export Orders
              </button>
              <Link
                href="/farmer/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Product
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
              <span className="material-symbols-outlined text-base shrink-0">warning</span>
              {error}
            </div>
          )}

          {/* Low-stock alert */}
          {!isLoading && (insights?.low_stock_products ?? 0) > 0 && (
            <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4">
              <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0">inventory_2</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  {insights!.low_stock_products} product{insights!.low_stock_products !== 1 ? "s" : ""} running low on stock
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Review your inventory to avoid missed orders.</p>
              </div>
              <Link
                href="/farmer/dashboard/inventory"
                className="shrink-0 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                View Inventory
              </Link>
            </div>
          )}

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon="payments" iconBg="bg-primary/20" label="Total Revenue"
              value={ov ? `${formatDZD(ov.total_revenue)} DZD` : "—"}
              sub="All time earned"
              badge={ov ? `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}% vs last period` : undefined}
              badgeColor={revenueGrowth >= 0 ? "text-primary" : "text-red-500"}
              isLoading={isLoading}
            />
            <KpiCard
              icon="inventory_2" iconBg="bg-blue-100 dark:bg-blue-900/30" label="Products Listed"
              value={ov ? String(ov.total_products) : "—"}
              sub={insights ? `${insights.low_stock_products} low stock` : undefined}
              isLoading={isLoading}
            />
            <KpiCard
              icon="receipt_long" iconBg="bg-purple-100 dark:bg-purple-900/30" label="Recent Orders"
              value={isLoading ? "—" : String(ordersBars.reduce((s, d) => s + d.value, 0))}
              sub="Last 10 days"
              isLoading={isLoading}
            />
            <KpiCard
              icon="star" iconBg="bg-amber-100 dark:bg-amber-900/30" label="Avg Rating"
              value={ov ? `${ov.avg_rating.toFixed(1)} / 5` : "—"}
              sub="From buyer reviews"
              isLoading={isLoading}
            />
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Revenue chart – 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold">Revenue Over Time</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Daily sales in DZD</p>
                </div>
                {ov && (
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatDZD(ov.total_revenue)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total DZD</p>
                  </div>
                )}
              </div>
              {isLoading ? <Sk className="h-32" /> : (
                <>
                  <BarChart data={revenueBars} color="#0df20d" height={120} fmt={n => `${formatDZD(n)} DZD`} />
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-border-dark">
                    <Sparkline data={revenueBars} color="#0bb80b" />
                  </div>
                </>
              )}
            </div>

            {/* Category distribution */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <h3 className="text-lg font-bold mb-1">Sales by Category</h3>
              <p className="text-xs text-slate-400 mb-5">Units sold distribution</p>
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Sk className="w-28 h-28 rounded-full" />
                  <div className="space-y-2 flex-1">{Array.from({length:3}).map((_,i)=><Sk key={i} className="h-4"/>)}</div>
                </div>
              ) : catSegments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No sales data yet.</p>
              ) : (
                <DonutChart segments={catSegments} />
              )}
            </div>
          </div>

          {/* ── Orders + Top products row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Orders over time */}
            <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <h3 className="text-base font-bold mb-1">Orders Per Day</h3>
              <p className="text-xs text-slate-400 mb-4">Last 10 days</p>
              {isLoading ? <Sk className="h-28" /> : (
                <BarChart data={ordersBars} color="#4ade80" height={100} fmt={n => `${n} orders`} />
              )}
            </div>

            {/* Top products – 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold">Top Products</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Best sellers by units sold</p>
                </div>
                <Link href="/farmer/dashboard/inventory" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                  All Products <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-3">{Array.from({length:4}).map((_,i)=><Sk key={i} className="h-10"/>)}</div>
              ) : topProducts.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                  <p className="text-sm">No sales yet.</p>
                  <Link href="/farmer/dashboard/products/add" className="mt-3 text-xs font-bold text-primary hover:underline">
                    Add your first product →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.slice(0, 5).map((p, i) => {
                    const sold = p.total_sold ?? 0;
                    const pct  = (sold / maxSold) * 100;
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="w-5 text-[10px] font-black text-slate-300 shrink-0 text-center">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold capitalize truncate text-slate-800 dark:text-slate-100">
                              {p.ministry_product__name}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 shrink-0 font-mono">
                              {sold > 0 ? `${sold} units` : "No sales"}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-100 dark:bg-earth-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-700"
                              style={{ width: `${Math.max(pct, 2)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Recent orders ── */}
          <div className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-light dark:border-border-dark flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <p className="text-xs text-slate-400 mt-0.5">Latest 5 orders from buyers</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => exportOrdersCSV(orders)}
                  disabled={orders.length === 0}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  CSV
                </button>
                <Link href="/farmer/dashboard/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                  View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="p-4 space-y-3">{Array.from({length:5}).map((_,i)=><Sk key={i} className="h-16"/>)}</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
                <p className="text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-50 dark:bg-earth-800 text-[11px] uppercase font-bold text-slate-500 border-b border-neutral-light dark:border-border-dark">
                    <tr>
                      <th className="px-6 py-3">Order</th>
                      <th className="px-6 py-3">Buyer</th>
                      <th className="px-6 py-3">Products</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Total</th>
                      <th className="px-6 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-light dark:divide-border-dark">
                    {orders.map(order => {
                      const firstItem  = order.items[0];
                      const extraCount = order.items.length - 1;
                      const buyer      = parseBuyerEmail(order.buyer);
                      return (
                        <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                            #{order.id}
                          </td>
                          <td className="px-6 py-3.5">
                            <p className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate max-w-35">{buyer}</p>
                          </td>
                          <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                            <span className="capitalize">{firstItem?.product.title ?? "—"}</span>
                            {extraCount > 0 && <span className="text-slate-400"> +{extraCount} more</span>}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${STATUS_BADGE[order.status]}`}>
                              <span className="material-symbols-outlined text-[11px] leading-none">{STATUS_ICON[order.status]}</span>
                              {STATUS_LABELS[order.status]}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-right font-bold font-mono text-slate-800 dark:text-slate-100 whitespace-nowrap">
                            {formatDZD(parseFloat(order.total_price))} DZD
                          </td>
                          <td className="px-6 py-3.5 text-right text-slate-400 text-xs whitespace-nowrap">
                            {formatOrderDate(order.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Quick links ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Inventory",  icon: "inventory_2",    href: "/farmer/dashboard/inventory",         desc: "Manage products"       },
              { label: "Orders",     icon: "receipt_long",   href: "/farmer/dashboard/orders",            desc: "View & process orders" },
              { label: "Missions",   icon: "local_shipping", href: "/farmer/dashboard/missions",          desc: "Delivery missions"     },
              { label: "Analytics",  icon: "analytics",      href: "/farmer/dashboard/analytics",         desc: "Performance charts"    },
            ].map(lnk => (
              <Link key={lnk.href} href={lnk.href}
                className="bg-white dark:bg-neutral-dark border border-neutral-light dark:border-border-dark rounded-2xl p-4 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors shadow-sm group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">{lnk.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{lnk.label}</p>
                  <p className="text-[10px] text-slate-400">{lnk.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-slate-400 pb-2">
            © {new Date().getFullYear()} AGRIGOV · Farmer Portal
          </footer>
        </div>
      </main>
    </div>
  );
}