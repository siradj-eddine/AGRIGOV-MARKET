import type { UpcomingMission } from '@/types/Missions';

interface UpcomingMissionCardProps {
  mission:       UpcomingMission;
  onViewDetails: (id: string) => void;
}

export default function UpcomingMissionCard({
  mission,
  onViewDetails,
}: UpcomingMissionCardProps) {
  return (
    <div className="bg-white/50 dark:bg-background-dark/50 border border-slate-200 dark:border-primary/5 rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex flex-col @3xl:flex-row items-center p-6 gap-6">
        {/* Date badge */}
        <div className="size-20 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
          <span className="text-xs font-bold uppercase">{mission.month}</span>
          <span className="text-2xl font-black">{mission.day}</span>
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-1">
            <h3 className="text-lg font-bold">Order {mission.orderId}</h3>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              Queued
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">agriculture</span>
              {mission.farm}
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              {mission.cargo}
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">payments</span>
              ${mission.payout.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onViewDetails(mission.id)}
          className="px-6 py-2 rounded-lg border border-primary/30 text-primary font-bold hover:bg-primary/5 transition-colors shrink-0"
        >
          View Details
        </button>
      </div>
    </div>
  );
}