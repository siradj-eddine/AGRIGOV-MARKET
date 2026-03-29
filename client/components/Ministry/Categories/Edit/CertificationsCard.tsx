import type { Certification } from '@/types/EditCategory';

interface CertificationsCardProps {
  certifications: Certification[];
  onRemove:       (id: string) => void;
  onAdd:          () => void;
}

export default function CertificationsCard({
  certifications,
  onRemove,
  onAdd,
}: CertificationsCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">verified</span>
        Mandatory Certifications
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Active cert chips */}
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="flex items-center gap-2 bg-primary/20 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-full shadow-sm"
          >
            <span className="font-bold">{cert.label}</span>
            <button
              onClick={() => onRemove(cert.id)}
              aria-label={`Remove ${cert.label} certification`}
              className="hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}

        {/* Add chip */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 px-4 py-2 rounded-full hover:border-primary/50 hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="font-bold">Add Cert</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400 italic">
        These certifications will be required for all listings under this category.
      </p>
    </section>
  );
}