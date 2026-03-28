import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS } from '@/types/CategoryManagement';

export default function CategorySidebar() {
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined text-3xl">agriculture</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Ministry of Ag</h1>
            <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20'
                : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className={`text-sm ${item.active ? 'font-bold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDawmSdbQd770LFUCpDhoRaKgcSoLwGOdzaDWBUgybjMBbbzlLHA-1UrBgQM1R5qj-5MlS7SFnNmD3k5Oxy5hDREg3X0eGeUgiHeTXxBcmB6cuIThnnuLmWCSQDPSXgUsn4-wrXhj6iTRgaKUZQ_21Y10WHBMYK40s1uUZUw-OW-t8qRjtIBTHzuiKWncGN0fC0F8JNNFJcu_TvV2T6oAxPA41AQNytjyymNbbN6Umsbg4P-OQoQjxhCcb-TKtlYiFCb_4WprMj_Q6p"
              alt="Admin User Profile Avatar"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">John Smith</p>
            <p className="text-xs text-slate-500 truncate">Senior Admin</p>
          </div>
          <button
            aria-label="Open settings"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}