import Link from 'next/link';
import { SIDEBAR_NAV } from '@/types/Profile';

export default function FarmerProfileSidebar() {
  return (
    <aside className="hidden md:flex h-full w-64 fixed left-0 top-0 z-40 flex-col py-4 space-y-2 bg-white dark:bg-slate-900 border-r border-primary/10 pt-20">
      <div className="px-6 mb-8">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl">
          Modern Homestead
        </h2>
        <p className="text-[10px] font-medium tracking-wide uppercase text-slate-500">
          Agri-Management System
        </p>
      </div>

      <nav className="flex-1 px-2 space-y-1" aria-label="Main navigation">
        {SIDEBAR_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium tracking-wide uppercase">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 mt-auto space-y-1 border-t border-primary/10">
        <Link
          href="#"
          className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm font-medium tracking-wide uppercase">Help</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium tracking-wide uppercase">Logout</span>
        </Link>
      </div>
    </aside>
  );
}