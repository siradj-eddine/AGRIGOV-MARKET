import Link from 'next/link';
import { SIDEBAR_NAV } from '@/types/ProductEdit';

export default function ProductEditSidebar() {
  return (
    <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 z-40 py-4 space-y-2 bg-white dark:bg-slate-900 border-r border-primary/10 pt-20">
      <div className="px-6 mb-8">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl">Modern Homestead</h2>
        <p className="text-[10px] font-medium tracking-wide uppercase text-slate-500">
          Agri-Management System
        </p>
      </div>

      <div className="flex-1 space-y-1 px-2">
        {SIDEBAR_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 flex items-center gap-3 text-sm font-semibold tracking-wide uppercase'
                : 'text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 flex items-center gap-3 text-sm font-medium tracking-wide uppercase hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200'
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
      </div>

      <div className="mt-auto space-y-1 px-2">
        <button className="w-[calc(100%-12px)] mx-1.5 mb-4 bg-primary text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform hover:opacity-90">
          <span className="material-symbols-outlined">add</span>
          New Record
        </button>
        {[
          { label: 'Help',   icon: 'help',   href: '#' },
          { label: 'Logout', icon: 'logout', href: '#' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 flex items-center gap-3 text-sm font-medium tracking-wide uppercase hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}