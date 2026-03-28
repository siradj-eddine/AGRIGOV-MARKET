import Image from 'next/image';
import type { ActiveMission } from '@/types/Missions';
import { PHASE_LABEL_STYLES } from '@/types/Missions';

interface ActiveMissionCardProps {
  mission:       ActiveMission;
  onAction:      (id: string) => void;
  isActionLoading: boolean;
}

export default function ActiveMissionCard({
  mission,
  onAction,
  isActionLoading,
}: ActiveMissionCardProps) {
  const phaseLabelStyle = PHASE_LABEL_STYLES[mission.phase];

  return (
    <div className="bg-white dark:bg-background-dark border border-primary/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col @3xl:flex-row">
        {/* Map thumbnail */}
        <div className="w-full @3xl:w-64 h-48 @3xl:h-auto relative overflow-hidden bg-slate-200 shrink-0">
          <Image
            src={mission.mapImageUrl}
            alt={mission.mapImageAlt}
            fill
            sizes="(min-width: 1024px) 256px, 100vw"
            className={`object-cover ${
              mission.phase === 'In Transit' ? 'opacity-60 grayscale-40' : ''
            }`}
          />
          {/* Status chip */}
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${mission.chipClass}`}
          >
            {mission.chipLabel}
          </span>
        </div>

        {/* Card body */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Title row */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className={`text-xs font-bold tracking-widest uppercase ${phaseLabelStyle}`}>
                  {mission.phase}
                </p>
                <h3 className="text-xl font-extrabold">Order {mission.orderId}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Est. Payout
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  ${mission.payout.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 mt-4 py-4 border-t border-primary/5">
              {[mission.pickup, mission.dropoff].map((loc) => (
                <div key={loc.label} className="flex items-start gap-3">
                  <span className={`material-symbols-outlined mt-1 ${loc.iconClass ?? ''}`}>
                    {loc.icon}
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      {loc.label}
                    </p>
                    <p className="text-sm font-semibold">{loc.name}</p>
                    <p className="text-xs text-slate-400">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer row */}
          <div className="mt-4 flex flex-col @xl:flex-row items-center justify-between gap-4 pt-4 border-t border-primary/5">
            {/* Cargo info */}
            <div className="flex items-center gap-6 w-full @xl:w-auto">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
                <span className="text-sm font-medium">{mission.cargo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">weight</span>
                <span className="text-sm font-medium">{mission.weightTons} Tons</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onAction(mission.id)}
              disabled={isActionLoading}
              className={`w-full @xl:w-auto flex items-center justify-center gap-2 font-bold px-8 py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-60 ${mission.actionClass}`}
            >
              {isActionLoading ? (
                <span className="material-symbols-outlined text-lg animate-spin">
                  progress_activity
                </span>
              ) : (
                <>
                  {mission.actionLabel}
                  <span className="material-symbols-outlined text-lg">
                    {mission.actionIcon}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}