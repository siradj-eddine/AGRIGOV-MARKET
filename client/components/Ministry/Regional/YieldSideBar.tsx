import type { AllRegionsStatsData, RegionalAlert } from "@/types/Regional";
import { heatmapGrid, heatmapTitles, regionalAlerts } from "@/types/Regional";

const alertStyles: Record<
  RegionalAlert["severity"],
  { wrapper: string; icon: string; title: string; msg: string }
> = {
  danger:  { wrapper: "bg-red-50 border-red-100",    icon: "text-red-500",    title: "text-red-800",    msg: "text-red-600"    },
  info:    { wrapper: "bg-blue-50 border-blue-100",   icon: "text-blue-500",   title: "text-blue-800",   msg: "text-blue-600"   },
  warning: { wrapper: "bg-yellow-50 border-yellow-100", icon: "text-yellow-500", title: "text-yellow-800", msg: "text-yellow-600" },
};

interface Props {
  stats:     AllRegionsStatsData | null;
  isLoading: boolean;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700 rounded ${className ?? ""}`} />
  );
}

export default function YieldSidebar({ stats, isLoading }: Props) {
  // Aggregate national totals
  const totalFarmers      = stats
    ? Object.values(stats).reduce((s, r) => s + r.farmers.total, 0)
    : null;
  const activeFarmers     = stats
    ? Object.values(stats).reduce((s, r) => s + r.farmers.active, 0)
    : null;
  const totalOrders       = stats
    ? Object.values(stats).reduce((s, r) => s + r.orders.total, 0)
    : null;
  const totalRevenue      = stats
    ? Object.values(stats).reduce((s, r) => s + r.orders.revenue, 0)
    : null;
  const completedMissions = stats
    ? Object.values(stats).reduce((s, r) => s + r.missions.completed, 0)
    : null;

  const progressPct = totalFarmers && activeFarmers
    ? Math.min((activeFarmers / Math.max(totalFarmers, 1)) * 100, 100)
    : 0;

  const fmtRevenue = (n: number) =>
    n.toLocaleString("fr-DZ", { maximumFractionDigits: 0 });
  return (
    <aside className="w-80 bg-white border-r border-neutral-light flex flex-col z-10 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Yield Analytics
        </h2>

        {/* National KPI card */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
            <span className="material-icons text-6xl">analytics</span>
          </div>

          <p className="text-slate-400 text-xs font-medium mb-1">National Active Farmers</p>

          {isLoading ? (
            <>
              <Skeleton className="h-8 w-28 mb-2" />
              <Skeleton className="h-3 w-40 mb-4" />
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">{activeFarmers ?? 0}</span>
                <span className="text-sm text-primary font-medium">
                  of {totalFarmers ?? 0} total
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {totalOrders ?? 0} orders · {fmtRevenue(totalRevenue ?? 0)} DZD revenue
              </p>
            </>
          )}

          <div className="mt-4 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.max(progressPct, 3)}%` }}
            />
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              label: "Completed Missions",
              value: isLoading ? null : String(completedMissions ?? 0),
              icon:  "local_shipping",
            },
            {
              label: "Total Orders",
              value: isLoading ? null : String(totalOrders ?? 0),
              icon:  "receipt_long",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-neutral-50 rounded-xl p-3 border border-neutral-light"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons text-primary text-[16px]">{item.icon}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
              </div>
              {item.value === null ? (
                <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
              ) : (
                <p className="text-lg font-bold text-slate-800">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Heatmap widget (static visual) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 text-sm">Crop Yield Intensity</h3>
            <button type="button" className="text-xs text-primary-dark font-medium hover:underline">
              View Report
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden border border-neutral-light p-1 bg-neutral-light/30">
            {heatmapGrid.map((opacity, i) => (
              <div
                key={i}
                className="aspect-square bg-primary rounded-sm hover:opacity-100 transition-opacity cursor-help"
                style={{ opacity }}
                title={heatmapTitles[opacity] ?? "Yield data"}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase">
            <span>Low Intensity</span>
            <span>High Intensity</span>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h3 className="font-semibold text-slate-700 text-sm mb-3">Regional Alerts</h3>
          <div className="space-y-3">
            {regionalAlerts.map((alert) => {
              const s = alertStyles[alert.severity];
              return (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-lg flex gap-3 ${s.wrapper}`}
                >
                  <span className={`material-icons text-sm mt-0.5 ${s.icon}`}>
                    {alert.icon}
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${s.title}`}>{alert.title}</p>
                    <p className={`text-[11px] mt-0.5 ${s.msg}`}>{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}