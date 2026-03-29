import Link from 'next/link';
import { SIDEBAR_NAV } from '@/types/EditCategory';

export default function CategoryEditSidebar() {
  return (
    <aside className="h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 flex-col py-4 space-y-2 pt-20 hidden lg:flex">
      <div className="px-6 mb-8">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl">
          Modern Homestead
        </h2>
        <p className="text-[10px] font-medium tracking-widest uppercase text-slate-500">
          Agri-Management System
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-2" aria-label="Main navigation">
        {SIDEBAR_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'flex items-center gap-3 bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 text-sm font-semibold tracking-wide uppercase'
                : 'flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 text-sm font-medium tracking-wide uppercase'
            }
          >
            <span
              className="material-symbols-outlined"
              style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* New Record CTA */}
      <div className="px-4 mt-auto">
        <button className="w-full bg-primary text-slate-900 rounded-xl py-3 px-4 font-semibold shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>
          New Record
        </button>
      </div>

      {/* Footer links */}
      <div className="pt-4 border-t border-primary/10 mt-4 px-2">
        {[
          { label: 'Help',   icon: 'help',   href: '#' },
          { label: 'Logout', icon: 'logout', href: '#' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-medium tracking-wide uppercase"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}