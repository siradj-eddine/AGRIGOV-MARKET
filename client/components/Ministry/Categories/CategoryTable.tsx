import type { Category } from '@/types/CategoryManagement';
import { STATUS_BADGE_STYLES } from '@/types/CategoryManagement';

interface CategoryTableProps {
  categories: Category[];
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold">Active Product Categories</h3>
        <div className="flex gap-2">
          <button
            aria-label="Filter categories"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">filter_list</span>
          </button>
          <button
            aria-label="Download categories"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">download</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="px-6 py-4">Icon &amp; Category</th>
              <th className="px-6 py-4">Sub-categories</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Quality Score</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                >
                  No categories found. Create your first category to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const styles = STATUS_BADGE_STYLES[cat.status];
                const isActive = cat.status === 'Active';

                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    {/* Icon & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-lg flex items-center justify-center ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined">{cat.icon}</span>
                        </div>
                        <span
                          className={`font-semibold ${
                            isActive ? '' : 'text-slate-400'
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    {/* Sub-category count */}
                    <td
                      className={`px-6 py-4 font-medium ${
                        isActive
                          ? 'text-slate-600 dark:text-slate-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {cat.subCategoryCount} items
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${styles.badge}`}
                      >
                        {cat.status}
                      </span>
                    </td>

                    {/* Quality Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full ${styles.bar} transition-all duration-500`}
                            style={{ width: `${cat.qualityScore}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isActive ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {cat.qualityScore}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          aria-label={`Edit ${cat.name}`}
                          onClick={() => onEdit(cat.id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button
                          aria-label={`Delete ${cat.name}`}
                          onClick={() => onDelete(cat.id)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">
          Showing {categories.length} of {categories.length}{' '}
          {categories.length === 1 ? 'category' : 'categories'}
        </span>
        <div className="flex gap-1">
          <button className="p-1 px-3 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40">
            Prev
          </button>
          <button className="p-1 px-3 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}