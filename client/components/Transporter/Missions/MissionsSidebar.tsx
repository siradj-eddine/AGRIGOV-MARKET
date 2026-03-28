import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS } from '@/types/Missions';

export default function MissionSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-background-dark border-r border-primary/20 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark shrink-0">
            <span className="material-symbols-outlined font-bold">local_shipping</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
              Transporter Hub
            </h1>
            <p className="text-primary text-xs font-medium">Logistics Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto" aria-label="Transporter navigation">
        {NAV_ITEMS.map((item) => (
          <div key={item.href}>
            {item.dividerBefore && (
              <div className="pt-4 mt-4 border-t border-primary/10" />
            )}
            <Link
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'flex items-center gap-3 px-3 py-2 bg-primary/20 text-slate-900 dark:text-slate-100 rounded-lg border border-primary/30'
                  : 'flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/10 rounded-lg transition-colors'
              }
            >
              <span
                className={`material-symbols-outlined ${item.active ? 'text-primary' : ''}`}
                style={
                  item.filled
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className={`text-sm ${item.active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center gap-3 px-2 py-3 bg-primary/5 rounded-xl">
          <div className="size-10 rounded-full overflow-hidden relative shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD81k4T8fU045VF9IhKrNaWAAGsHY6uOTQU6uBs_03vJaRjgBzbxfhZLFKfGnlGvy1oAIvjNnR2bj9Jo8xmBz9lf7Li9KZUoJUHr_BJEqoV5goGVAFhwFvu6GGkYZw9MskLhDTSX7zk5clptWPxu2GKCN1lv4v_aAlGpQXch6so0qZNDswLfSsRhmQ_asvzJQkgRL1snk6rUH3uVwXny8nP4zg1d5jaGJJMaJs2u7sjQTeEB4F3GCIrwlsp2ESHOL0WH_jEqBuIMm-s"
              alt="User profile avatar portrait"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Fleet Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}