interface ApprovalSuccessOverlayProps {
  farmerName:  string;
  onContinue:  () => void;
}

export default function ApprovalSuccessOverlay({
  farmerName,
  onContinue,
}: ApprovalSuccessOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Farmer verified successfully"
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-sm max-w-sm w-full text-center border border-primary/10 mx-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <span
            className="material-symbols-outlined text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <h2 className="text-2xl font-black mb-2 text-slate-900 dark:text-slate-100">
          Farmer Verified
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {farmerName} has been successfully approved and notified via SMS.
        </p>
        <button
          onClick={onContinue}
          className="w-full bg-primary text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Continue to Next Review
        </button>
      </div>
    </div>
  );
}