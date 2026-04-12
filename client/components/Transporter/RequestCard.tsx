import type { TransportRequest } from "@/types/Transporter";
import { cargoTagStyles } from "@/types/Transporter";

interface Props {
  request: TransportRequest;
  loadingId: number | null;
  onViewRoute: (req: TransportRequest) => void;
  onAccept: () => void;
  onDecline: () => void;
}

export default function RequestCard({ request, loadingId, onViewRoute, onAccept, onDecline }: Props) {
  const isLoading = loadingId === request.id;

  return (
    <div className="group bg-white dark:bg-[#1a2e1a] border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-3">
        <div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-1 ${cargoTagStyles[request.tag]}`}
          >
            {request.tag}
          </span>
          <h3 className="font-bold text-slate-800 dark:text-white">{request.cargo}</h3>
        </div>
        <span className="block text-lg font-bold text-primary-dark dark:text-primary">
          ${request.pay}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-3">
        <div className="flex items-center gap-1">
          <span className="material-icons text-base text-slate-400">scale</span>
          <span>{request.weightKg} kg</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-base text-slate-400">route</span>
          <span>{request.distanceKm} km</span>
        </div>
      </div>

      <div className="space-y-2 mb-4 relative pl-1">
        <div className="absolute left-1.25 top-2 bottom-2 w-0.5 border-l border-dashed border-slate-300 dark:border-slate-600" />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-white dark:border-[#1a2e1a] ring-1 ring-slate-400 shrink-0" />
          <p className="text-sm truncate">{request.pickup}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary border-2 border-white dark:border-[#1a2e1a] ring-1 ring-primary shrink-0" />
          <p className="text-sm truncate">{request.dropoff}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDecline}
          disabled={isLoading}
          className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={isLoading}
          className="flex-1 py-2 bg-primary hover:bg-green-400 text-black font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="material-icons animate-spin text-sm">progress_activity</span>
          ) : (
            "Accept"
          )}
        </button>
        <button
          type="button"
          onClick={() => onViewRoute(request)}
          className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-sm transition-colors"
        >
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}