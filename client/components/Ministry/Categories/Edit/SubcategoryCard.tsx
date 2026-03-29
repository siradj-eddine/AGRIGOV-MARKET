import Image from 'next/image';
import type { SubCategory } from '@/types/EditCategory';

interface SubCategoriesCardProps {
  subCategories: SubCategory[];
  onEdit:        (id: string) => void;
  onAdd:         () => void;
}

export default function SubCategoriesCard({
  subCategories,
  onEdit,
  onAdd,
}: SubCategoriesCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10 overflow-hidden relative">
      {/* Decorative blur circle */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <h3 className="text-xl font-bold mb-6">Managed Sub-Categories</h3>

      <div className="space-y-4">
        {subCategories.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4 font-medium">
            No sub-categories yet.
          </p>
        ) : (
          subCategories.map((sub) => (
            <div
              key={sub.id}
              className="group flex items-center justify-between p-4 bg-background-light dark:bg-slate-800 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer"
              onClick={() => onEdit(sub.id)}
              role="button"
              tabIndex={0}
              aria-label={`Edit ${sub.name} sub-category`}
              onKeyDown={(e) => e.key === 'Enter' && onEdit(sub.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 relative shrink-0">
                  <Image
                    src={sub.imageUrl}
                    alt={sub.imageAlt}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">
                    {sub.variantCount} Registered Variants
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                edit_note
              </span>
            </div>
          ))
        )}

        {/* Add sub-category */}
        <button
          onClick={onAdd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 font-bold hover:bg-white dark:hover:bg-slate-800 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Sub-Category
        </button>
      </div>
    </section>
  );
}