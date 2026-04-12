interface PayoutCardProps {
  payout:          number;
  progressPercent: number;
}

export default function PayoutCard({ payout, progressPercent }: PayoutCardProps) {
  return (
    <section className="bg-primary text-slate-900 p-6 rounded-xl shadow-sm relative overflow-hidden">
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none" aria-hidden="true">
        <span className="material-symbols-outlined text-8xl">payments</span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
          Guaranteed Payout
        </p>
        <div className="text-4xl font-black tracking-tight mb-4">
          {payout.toFixed(2)} DZD
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Verified by Harvest Intel
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1.5 w-full bg-slate-900/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900/50 rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-[10px] mt-2 text-slate-700/70 font-medium uppercase tracking-tighter">
        Mission Progress: {progressPercent}% Complete
      </p>
    </section>
  );
}