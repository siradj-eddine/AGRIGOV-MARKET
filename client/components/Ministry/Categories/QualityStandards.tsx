import type { QualityStandard } from '@/types/CategoryManagement';

interface QualityStandardsPanelProps {
  standards: QualityStandard[];
  onAddStandard: () => void;
  onConfigureStandard: (id: string) => void;
}

export default function QualityStandardsPanel({
  standards,
  onAddStandard,
  onConfigureStandard,
}: QualityStandardsPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined">verified</span>
        </div>
        <div>
          <h4 className="font-bold">Quality Standards</h4>
          <p className="text-xs text-slate-500">Define required metrics per category</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Standard Items */}
        {standards.map((std) => {
          const isMet = std.status === 'met';
          return (
            <div
              key={std.id}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`material-symbols-outlined ${
                    isMet ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  {isMet ? 'check_circle' : 'circle'}
                </span>
                <div>
                  <p className="text-sm font-bold">{std.name}</p>
                  <p className="text-[11px] text-slate-500">{std.description}</p>
                </div>
              </div>
              <button
                aria-label={`Configure ${std.name}`}
                onClick={() => onConfigureStandard(std.id)}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">settings_suggest</span>
              </button>
            </div>
          );
        })}

        {/* Empty state */}
        {standards.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            No standards defined yet.
          </p>
        )}

        {/* Add New Standard */}
        <button
          onClick={onAddStandard}
          className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Standard
        </button>
      </div>
    </div>
  );
}