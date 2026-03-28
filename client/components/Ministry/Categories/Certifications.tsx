import type { Certification } from '@/types/CategoryManagement';

interface CertificationsPanelProps {
  certifications: Certification[];
  onEdit: (id: string) => void;
}

export default function CertificationsPanel({
  certifications,
  onEdit,
}: CertificationsPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined">assignment_turned_in</span>
        </div>
        <div>
          <h4 className="font-bold">Required Certifications</h4>
          <p className="text-xs text-slate-500">Necessary documents for market entry</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Certification Items */}
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 dark:border-slate-800"
          >
            <div className="p-2 rounded bg-primary/20 text-primary shrink-0">
              <span className="material-symbols-outlined text-lg">{cert.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{cert.name}</p>
              <p className="text-[11px] text-slate-500 mt-1">{cert.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {cert.appliesTo.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onEdit(cert.id)}
              className="text-xs font-bold text-primary hover:opacity-75 transition-opacity shrink-0"
            >
              Edit
            </button>
          </div>
        ))}

        {/* Empty state */}
        {certifications.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            No certifications configured yet.
          </p>
        )}

        {/* Info Banner */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary shrink-0">info</span>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            Changes to certifications will notify all active producers in the affected
            categories.
          </p>
        </div>
      </div>
    </div>
  );
}