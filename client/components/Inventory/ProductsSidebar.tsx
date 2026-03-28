import Link from 'next/link';
import { NAV_ITEMS } from '@/types/Inventory';

export default function ProductManagementSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-primary/10 bg-white dark:bg-slate-900 p-4 gap-6 shrink-0">
      <div className="flex flex-col gap-4">
        {/* Farm identity */}
        <div className="flex gap-3 items-center">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">potted_plant</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-slate-100 text-sm font-bold">
              Green Harvest
            </h1>
            <p className="text-primary text-xs font-medium">Premium Farmer</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1" aria-label="Farmer navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'flex items-center gap-3 px-3 py-2 bg-primary/20 text-primary rounded-lg'
                  : 'flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors'
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className={`text-sm ${item.active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}