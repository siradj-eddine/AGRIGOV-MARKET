interface MissionActionsProps {
  status:       string;
  syncedAgo:    string;
  onScanQR:     () => void;
  onUpdateStatus: () => void;
  // onContactSupport: () => void;
  isScanLoading:   boolean;
  isUpdateLoading: boolean;
}

export default function MissionActions({
  status,
  syncedAgo,
  onScanQR,
  onUpdateStatus,
  // onContactSupport,
  isScanLoading,
  isUpdateLoading,
}: MissionActionsProps) {
  return (
    <section className="flex flex-col gap-3">
      {/* Primary CTA */}
      <button
        onClick={onScanQR}
        disabled={isScanLoading}
        className="w-full h-14 bg-primary text-slate-900 font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {isScanLoading ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined">qr_code_scanner</span>
        )}
        Scan QR at Pickup
      </button>

      {/* Secondary CTA */}
      <button
        onClick={onUpdateStatus}
        disabled={isUpdateLoading}
        className="w-full h-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold rounded-xl flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all border border-primary/10 disabled:opacity-60"
      >
        {isUpdateLoading ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-primary">sync_alt</span>
        )}
        Update Status
      </button>

      {/* Tertiary CTA */}
      {/* <button
        onClick={onContactSupport}
        className="w-full h-14 bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        <span className="material-symbols-outlined">support_agent</span>
        Contact Support
      </button> */}

      {/* Live status indicator */}
      <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-slate-800 rounded-xl border border-primary/10">
        <div className="flex items-center gap-3">
          {/* Pulsing dot */}
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm font-bold text-primary">{status}</span>
        </div>
        <span className="text-xs font-medium text-slate-400">Synced {syncedAgo}</span>
      </div>
    </section>
  );
}