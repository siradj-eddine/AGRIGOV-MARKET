import type { CargoInfo } from '@/types/MissionDetails';

interface CargoCardProps {
  cargo: CargoInfo;
}

export default function CargoCard({ cargo }: CargoCardProps) {
  return (
    <section className="bg-background-light dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/10 border-b-2 border-b-primary">
      <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-4">
        Cargo Information
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
          <span className="material-symbols-outlined text-3xl">{cargo.icon}</span>
        </div>
        <div>
          <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100">{cargo.name}</h4>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{cargo.variety}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Show weight only if available, otherwise show order value */}
        <div className="bg-white/50 dark:bg-slate-800 p-3 rounded-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {cargo.weightTons > 0 ? 'Weight' : 'Order Value'}
          </p>
          <p className="font-bold text-slate-900 dark:text-slate-100">
            {cargo.weightTons > 0
              ? `${cargo.weightTons.toFixed(1)} T`
              : cargo.totalPrice
              ? `${parseFloat(cargo.totalPrice).toLocaleString()} DZD`
              : '—'}
          </p>
        </div>

        <div className="bg-white/50 dark:bg-slate-800 p-3 rounded-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Lot #</p>
          <p className="font-bold text-slate-900 dark:text-slate-100">{cargo.lotNumber}</p>
        </div>
      </div>
    </section>
  );
}