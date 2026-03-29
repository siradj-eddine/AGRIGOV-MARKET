import type { InventoryStatus } from '@/types/ProductEdit';

interface InventoryStatusCardProps {
  statuses: InventoryStatus[];
}

export function InventoryStatusCard({ statuses }: InventoryStatusCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10">
      <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-500">
        Inventory Status
      </h3>
      <div className="space-y-4">
        {statuses.map((status) => (
          <div
            key={status.id}
            className={`flex items-center gap-4 bg-background-light dark:bg-slate-800 p-3 rounded-xl ${status.borderClass}`}
          >
            <span
              className={`material-symbols-outlined p-2 rounded-lg shrink-0 ${status.iconClass}`}
            >
              {status.icon}
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                {status.label}
              </div>
              <div className="text-[10px] text-slate-500">{status.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface MarketExpertCardProps {
  onConnect: () => void;
}

export function MarketExpertCard({ onConnect }: MarketExpertCardProps) {
  return (
    <div className="bg-primary p-6 rounded-xl text-slate-900 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <h4 className="font-bold text-lg leading-tight mb-2">Need a Market Expert?</h4>
        <p className="text-sm opacity-80 mb-4">
          Chat with a specialized agricultural broker for pricing strategies.
        </p>
        <button
          onClick={onConnect}
          className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all hover:opacity-90"
        >
          Connect Now
        </button>
      </div>
      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12 pointer-events-none"
        aria-hidden="true"
      >
        support_agent
      </span>
    </div>
  );
}