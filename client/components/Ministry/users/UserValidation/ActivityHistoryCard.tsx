import type { ActivityEvent } from '@/types/UserValidation';

interface ActivityHistoryCardProps {
  events: ActivityEvent[];
}

export default function ActivityHistoryCard({ events }: ActivityHistoryCardProps) {
  return (
    <div className="bg-background-light dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-primary/10">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">history</span>
        Activity History
      </h3>

      <div className="relative space-y-6">
        {/* Connector line */}
        <div
          className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />

        {events.map((event) => (
          <div key={event.id} className="relative pl-8">
            {/* Dot */}
            <div
              className={`absolute left-0 top-1.5 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center z-10 shadow-sm ${
                event.isActive ? 'border-2 border-primary/40' : 'border-2 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  event.isActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/5">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {event.title}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{event.timestamp}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {event.isActive ? (
                  event.body
                ) : (
                  <>
                    {event.body.split('Low Risk').map((part, i) =>
                      i === 0 ? (
                        <span key={i}>{part}</span>
                      ) : (
                        <span key={i}>
                          <span className="text-primary font-bold">Low Risk</span>
                          {part}
                        </span>
                      ),
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}