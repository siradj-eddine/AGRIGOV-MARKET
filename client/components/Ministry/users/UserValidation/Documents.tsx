import type { FarmDocument } from '@/types/UserValidation';

interface FarmDocumentsCardProps {
  documents:   FarmDocument[];
  onOpenDoc:   (id: string) => void;
}

export default function FarmDocumentsCard({ documents, onOpenDoc }: FarmDocumentsCardProps) {
  return (
    <div className="bg-background-light dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-primary/10">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary">description</span>
        Farm Assets &amp; Deeds
      </h3>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between border border-primary/5 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.iconBgClass}`}>
                <span className="material-symbols-outlined">{doc.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</h4>
                <p className="text-xs text-slate-500">{doc.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => onOpenDoc(doc.id)}
              aria-label={`Open ${doc.title}`}
              className="p-2 text-slate-400 group-hover:text-primary transition-colors shrink-0"
            >
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}