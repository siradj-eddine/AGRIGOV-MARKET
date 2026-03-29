import type { VerificationStep } from '@/types/UserValidation';

interface VerificationPanelProps {
  steps:            VerificationStep[];
  internalNote:     string;
  onNoteChange:     (note: string) => void;
  onConfirmApproval: () => void;
  isConfirming:     boolean;
}

export default function VerificationPanel({
  steps,
  internalNote,
  onNoteChange,
  onConfirmApproval,
  isConfirming,
}: VerificationPanelProps) {
  return (
    <>
      {/* Checklist */}
      <div className="bg-background-light dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-primary/10">
        <h3 className="text-xl font-bold mb-4">Verification Steps</h3>
        <div className="space-y-3">
          {steps.map((step) => {
            const isComplete = step.status === 'complete';
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isComplete
                    ? 'bg-primary/10'
                    : 'bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isComplete ? 'text-primary' : 'text-slate-400'
                  }`}
                  style={isComplete ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {isComplete ? 'check_circle' : 'hourglass_empty'}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isComplete
                      ? 'text-primary'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal note + confirm */}
      <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold mb-2 text-white">Internal Note</h3>
        <textarea
          value={internalNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a private note about this farmer..."
          rows={4}
          aria-label="Internal note about this farmer"
          className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none mb-4 resize-none"
        />
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1 text-xs text-slate-400 mb-2">
            <span className="material-symbols-outlined text-sm">security</span>
            Approval will grant access to Grain Loans.
          </div>
          <button
            onClick={onConfirmApproval}
            disabled={isConfirming}
            className="w-full bg-primary hover:opacity-90 text-slate-900 font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isConfirming && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            Confirm Approval
          </button>
        </div>
      </div>
    </>
  );
}