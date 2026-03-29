import type { MissionStop } from '@/types/MissionDetails';

interface RouteTimelineProps {
  stops: MissionStop[];
}

export default function RouteTimeline({ stops }: RouteTimelineProps) {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/10">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">route</span>
        Delivery Schedule
      </h3>

      {/* Vertical timeline — the ::before line is replicated with a positioned div */}
      <div className="relative space-y-8">
        {/* Connector line */}
        <div
          className="absolute left-2.75 top-0 bottom-0 w-0.5 bg-neutral-light dark:bg-slate-700"
          aria-hidden="true"
        />

        {stops.map((stop, idx) => (
          <div key={idx} className="relative pl-10">
            {/* Dot */}
            <div
              className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${stop.dotClass}`}
            >
              <span
                className={`material-symbols-outlined text-xs ${stop.iconClass}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {stop.icon}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${stop.iconClass}`}>
                  {stop.role}
                </p>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{stop.name}</h4>
                <p className="text-sm text-slate-500">{stop.address}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 shrink-0 ml-4">{stop.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}