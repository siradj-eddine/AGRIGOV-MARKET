import type { CategoryForm } from '@/types/EditCategory';

interface CoreDefinitionCardProps {
  form:     CategoryForm;
  onChange: (field: keyof CategoryForm, value: string) => void;
}

export default function CoreDefinitionCard({ form, onChange }: CoreDefinitionCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">info</span>
        Core Definition
      </h3>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="cat-name"
            className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
          >
            Category Name
          </label>
          <input
            id="cat-name"
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="cat-desc"
            className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
          >
            Description
          </label>
          <textarea
            id="cat-desc"
            rows={4}
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 outline-none transition-all resize-none"
          />
        </div>
      </div>
    </section>
  );
}